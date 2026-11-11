import Anthropic from "@anthropic-ai/sdk";
import { ENV } from "../../config/env.js";
import { ProductService } from "../products/product.service.js";
import type { Product } from "../../shared/types/product.types.js";
import { formatVND, priceOf } from "../../shared/checkout.js";
import { FAQS, STORE, catalogText, faqText } from "./chat.knowledge.js";

export type ChatTurn = { role: "user" | "assistant"; content: string };

const MAX_TURNS = 12;
const MAX_CHARS = 1000;

const RULES = `Bạn là "Trợ lý Lam Trà", nhân viên tư vấn online của cửa hàng trà Lam Trà (trà Tân Cương, Thái Nguyên).
Mục tiêu: trả lời nhanh, đúng, và giúp khách chọn được sản phẩm để đặt mua.

Cách trả lời:
- Luôn dùng tiếng Việt, xưng "Lam Trà" hoặc "mình", gọi khách là "bạn". Giọng thân thiện, mộc mạc, không sáo rỗng.
- Ngắn gọn: 2–5 câu, hoặc tối đa 5 gạch đầu dòng. Không dùng tiêu đề, không dùng bảng.
- Định dạng cho phép: **in đậm**, gạch đầu dòng bắt đầu bằng "- ", và link dạng [Tên](/duong-dan). Chỉ dùng đường dẫn nội bộ có trong dữ liệu (ví dụ /san-pham/tra-moc-cau, /gio-hang, /tra-cuu-don, /chinh-sach, /lien-he).
- Khi khách cần tư vấn chọn trà: hỏi tối đa 1 câu để làm rõ (uống hằng ngày hay biếu tặng, ngân sách, khẩu vị) rồi gợi ý 1–3 sản phẩm cụ thể kèm giá và link sản phẩm.
- Khi khách đã muốn mua: đưa link sản phẩm và nói ngắn gọn bước đặt (chọn gói, hạng → thêm vào giỏ → thanh toán VietQR hoặc COD), nhắc mã giảm giá hoặc ngưỡng miễn phí giao hàng nếu có lợi cho khách.

Giới hạn:
- CHỈ dùng thông tin trong DỮ LIỆU bên dưới. Không bịa giá, khuyến mãi, chính sách, thời gian giao hay sản phẩm không có. Sản phẩm hoặc gói ghi "hết hàng" thì nói rõ là đang hết.
- Không tự tra cứu được đơn hàng: hướng dẫn khách vào /tra-cuu-don với mã đơn và số điện thoại.
- Câu hỏi sức khỏe: không khẳng định tác dụng chữa bệnh; khuyên hỏi bác sĩ khi có bệnh lý hoặc mang thai.
- Câu hỏi ngoài phạm vi trà và cửa hàng: lịch sự từ chối và kéo về chủ đề trà.
- Không biết hoặc cần người thật (khiếu nại, đơn số lượng lớn, đổi trả): mời khách nhắn Zalo hoặc gọi ${STORE.phone} (${STORE.hours}).`;

// Phần tĩnh (quy tắc + FAQ) đứng trước để được cache; danh mục sản phẩm đổi theo giá/tồn kho nên để sau.
const STATIC_SYSTEM = `${RULES}\n\n# DỮ LIỆU: HỎI ĐÁP THƯỜNG GẶP\n${faqText()}`;

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY, timeout: 30_000, maxRetries: 1 }));

export function sanitizeHistory(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const turns = raw
    .filter((m): m is ChatTurn => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_CHARS) }))
    .filter((m) => m.content)
    .slice(-MAX_TURNS);
  // API yêu cầu tin đầu tiên là của khách
  while (turns.length && turns[0].role !== "user") turns.shift();
  return turns;
}

export async function reply(history: ChatTurn[]): Promise<{ text: string; source: "ai" | "faq" }> {
  const products = await ProductService.getAllProducts(false);
  const provider = ENV.GEMINI_API_KEY ? "gemini" : ENV.ANTHROPIC_API_KEY ? "claude" : null;
  if (!provider) {
    return { text: faqReply(history[history.length - 1].content, products), source: "faq" };
  }
  try {
    const text = provider === "gemini" ? await geminiReply(history, products) : await aiReply(history, products);
    return { text, source: "ai" };
  } catch (err) {
    if (err instanceof Anthropic.APIError) console.error(`[chat] Claude API ${err.status}:`, err.message);
    else console.error(`[chat] Lỗi gọi ${provider === "gemini" ? "Gemini" : "Claude"}:`, err);
    return { text: faqReply(history[history.length - 1].content, products), source: "faq" };
  }
}

const REFUSAL = `Câu này Lam Trà chưa hỗ trợ được. Bạn hỏi mình về trà, cách pha hay đặt hàng nhé, hoặc nhắn Zalo ${STORE.phone}.`;

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  error?: { code?: number; message?: string };
};

// Lỗi tạm thời / model bị ngừng → thử model kế tiếp
const GEMINI_RETRYABLE = new Set([404, 429, 500, 502, 503, 504]);

async function geminiReply(history: ChatTurn[], products: Product[]): Promise<string> {
  const payload = {
    systemInstruction: {
      parts: [{ text: `${STATIC_SYSTEM}

# DỮ LIỆU: SẢN PHẨM ĐANG BÁN (giá và tồn kho hiện tại)
${catalogText(products)}` }],
    },
    // Gemini dùng vai "model" thay cho "assistant"
    contents: history.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
  };
  const models = [...new Set([ENV.GEMINI_MODEL, ...ENV.GEMINI_FALLBACK_MODELS])];

  let data: GeminiResponse = {};
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const isLast = i === models.length - 1;
    // Chat tư vấn không cần suy luận sâu: thinkingLevel "low" (chỉ dòng Gemini 3+) cho phản hồi nhanh hơn
    const generationConfig = {
      maxOutputTokens: 2048,
      temperature: 0.6,
      ...(/^gemini-[3-9]/.test(model) ? { thinkingConfig: { thinkingLevel: "low" } } : {}),
    };
    let res: Response;
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": ENV.GEMINI_API_KEY },
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({ ...payload, generationConfig }),
      });
    } catch (err) {
      // Timeout / lỗi mạng → thử model kế tiếp
      if (isLast) throw err;
      console.warn(`[chat] Gemini ${model} không phản hồi (${(err as Error).name}) → thử ${models[i + 1]}`);
      continue;
    }
    data = (await res.json().catch(() => ({}))) as GeminiResponse;
    if (res.ok) break;
    const msg = `Gemini API ${res.status} (${model}): ${data.error?.message ?? res.statusText}`;
    if (!GEMINI_RETRYABLE.has(res.status) || isLast) throw new Error(msg);
    console.warn(`[chat] ${msg} → thử ${models[i + 1]}`);
  }

  if (data.promptFeedback?.blockReason) return REFUSAL;
  const candidate = data.candidates?.[0];
  if (candidate?.finishReason && ["SAFETY", "PROHIBITED_CONTENT", "BLOCKLIST", "SPII"].includes(candidate.finishReason)) {
    return REFUSAL;
  }
  const text = (candidate?.content?.parts ?? [])
    .flatMap((p) => (!p.thought && p.text ? [p.text] : []))
    .join("")
    .trim();
  if (!text) throw new Error(`Gemini trả về rỗng (finishReason: ${candidate?.finishReason ?? "?"})`);
  return text;
}

async function aiReply(history: ChatTurn[], products: Product[]): Promise<string> {
  const response = await getClient().beta.messages.create({
    model: ENV.CHAT_MODEL,
    max_tokens: 2000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    system: [
      { type: "text", text: STATIC_SYSTEM, cache_control: { type: "ephemeral" } },
      { type: "text", text: `# DỮ LIỆU: SẢN PHẨM ĐANG BÁN (giá và tồn kho hiện tại)\n${catalogText(products)}` },
    ],
    messages: history,
  });

  if (response.stop_reason === "refusal") return REFUSAL;
  const text = response.content
    .flatMap((b) => (b.type === "text" ? [b.text] : []))
    .join("")
    .trim();
  if (!text) throw new Error("Claude trả về rỗng");
  return text;
}

/* ---------- Dự phòng khi chưa cấu hình AI: khớp câu hỏi mẫu ---------- */

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9/ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOP = new Set(["la", "gi", "co", "khong", "nao", "the", "nhu", "cua", "va", "toi", "minh", "ban", "cho", "thi", "tra", "duoc", "bao", "nhieu", "nen", "de", "mot", "cac", "nhung", "voi", "o", "lam", "sao"]);
const words = (s: string) => norm(s).split(" ").filter((w) => w.length > 1 && !STOP.has(w));

function faqReply(question: string, products: Product[]): string {
  const q = norm(question);

  // Khách nhắc tên một sản phẩm cụ thể → trả thông tin sản phẩm đó
  const product = products.find((p) => q.includes(norm(p.name).replace(/^tra /, "")));
  const askingAboutProduct = product && !/(khac nhau|so sanh|phi|ship|doi tra|thanh toan)/.test(q);
  if (product && askingAboutProduct) {
    const price = p200(product);
    const brew = product.brew ? `\n- Cách pha: ${product.brew.amount}, nước ${product.brew.temp}, ${product.brew.time}.` : "";
    return `**${product.name}**: ${product.note}. ${product.desc}\n- Giá: ${price}${brew}\n\nXem và đặt tại [${product.name}](/san-pham/${product.slug}).`;
  }

  const qWords = new Set(words(question));
  let best = { score: 0, faq: FAQS[0] };
  for (const f of FAQS) {
    let score = 0;
    for (const k of f.keys ?? []) if (q.includes(norm(k))) score += 3;
    for (const w of words(f.q)) if (qWords.has(w)) score += 1;
    if (score > best.score) best = { score, faq: f };
  }
  if (best.score >= 2) return best.faq.a;

  return `Lam Trà chưa chắc đã hiểu đúng câu hỏi của bạn. Bạn có thể hỏi về loại trà, giá, cách pha, phí giao hàng hay mã giảm giá; hoặc nhắn Zalo ${STORE.phone} để được tư vấn trực tiếp nhé.`;
}

const p200 = (p: Product) => (p.fixed ? formatVND(p.base) : `từ ${formatVND(priceOf(p, "200", "1"))} (hộp 200g Premium)`);
