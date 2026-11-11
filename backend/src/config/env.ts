import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(BACKEND_ROOT, ".env") });

export const ENV = {
  BACKEND_ROOT,
  PORT: Number(process.env.PORT) || 4000,
  HOST: process.env.HOST || "0.0.0.0",
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY || "",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  LAMTRA_WEBHOOK_URL: process.env.LAMTRA_WEBHOOK_URL || "",
  DATA_DIR: process.env.DATA_DIR || path.resolve(BACKEND_ROOT, "data"),
  UPLOADS_DIR: process.env.UPLOADS_DIR || path.resolve(BACKEND_ROOT, "uploads"),
  // Có đủ 2 biến này thì dữ liệu + ảnh lưu lên Supabase; thiếu thì dùng file trong DATA_DIR / UPLOADS_DIR như cũ.
  // Chỉ lấy gốc https://<id>.supabase.co: bỏ "/rest/v1" (hay bị copy nhầm từ trang Data API) và "/" cuối,
  // vì client tự nối /rest/v1, /storage/v1 — dư đường dẫn sẽ báo "Invalid path specified in request URL".
  SUPABASE_URL: (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "").replace(/\/(rest|storage|auth)\/v1$/, ""),
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET || "products",
  // Trợ lý AI. Ưu tiên Gemini nếu có GEMINI_API_KEY, rồi tới Claude; thiếu cả hai thì chatbot
  // vẫn chạy bằng bộ câu hỏi mẫu (không gọi AI).
  GEMINI_API_KEY: (process.env.GEMINI_API_KEY || "").trim(),
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",
  CHAT_MODEL: process.env.CHAT_MODEL || "claude-opus-5-5",
};
