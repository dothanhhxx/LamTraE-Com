import type { FastifyPluginAsync } from "fastify";
import { reply, sanitizeHistory } from "./chat.service.js";

// Giới hạn đơn giản theo IP để tránh bị spam tốn phí AI: 20 tin / phút.
const WINDOW_MS = 60_000;
const LIMIT = 20;
const hits = new Map<string, number[]>();

function allow(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length <= LIMIT;
}

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
  // Public: khách hỏi trợ lý. Body: { messages: [{ role: "user" | "assistant", content: string }] }
  fastify.post("/api/chat", async (request, res) => {
    if (!allow(request.ip)) {
      return res.status(429).send({ ok: false, error: "Bạn hỏi hơi nhanh, đợi một phút rồi hỏi tiếp nhé." });
    }
    const history = sanitizeHistory((request.body as { messages?: unknown } | undefined)?.messages);
    if (!history.length || history[history.length - 1].role !== "user") {
      return res.status(400).send({ ok: false, error: "Bạn nhập câu hỏi giúp Lam Trà nhé." });
    }
    const result = await reply(history);
    return { ok: true, reply: result.text, source: result.source };
  });
};
