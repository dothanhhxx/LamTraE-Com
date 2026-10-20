// Lưu đơn và tin nhắn tạm thời khi chưa có database (GĐ3).
// 1) Ghi vào file .data/*.jsonl: dùng được khi chạy `next start` trên máy chủ riêng / VPS.
// 2) Nếu đặt biến môi trường LAMTRA_WEBHOOK_URL, gửi thêm bản sao tới webhook
//    (Google Apps Script ghi vào Google Sheet, n8n, Make, bot Zalo/Telegram…) để chủ shop nhận ngay.
// Trên Vercel/serverless, ổ đĩa không giữ được dữ liệu: bắt buộc dùng webhook.
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), ".data");

export async function append(kind: string, record: object) {
  try {
    await mkdir(DIR, { recursive: true });
    await appendFile(path.join(DIR, `${kind}.jsonl`), JSON.stringify(record) + "\n", "utf8");
  } catch (e) {
    console.error(`[store] không ghi được ${kind}`, e);
  }
}

export async function readAll<T>(kind: string): Promise<T[]> {
  try {
    const raw = await readFile(path.join(DIR, `${kind}.jsonl`), "utf8");
    return raw.split("\n").filter(Boolean).map((l) => JSON.parse(l) as T);
  } catch {
    return [];
  }
}

/** Trả về true nếu đã lưu được ít nhất một nơi. */
export async function notify(type: string, payload: object): Promise<boolean> {
  const url = process.env.LAMTRA_WEBHOOK_URL;
  if (!url) return false;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, at: new Date().toISOString(), payload }),
      signal: AbortSignal.timeout(6000),
    });
    return r.ok;
  } catch (e) {
    console.error("[webhook] lỗi", e);
    return false;
  }
}
