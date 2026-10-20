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
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY || "LamTra@TanCuong2026",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  LAMTRA_WEBHOOK_URL: process.env.LAMTRA_WEBHOOK_URL || "",
  DATA_DIR: process.env.DATA_DIR || path.resolve(BACKEND_ROOT, "data"),
  UPLOADS_DIR: process.env.UPLOADS_DIR || path.resolve(BACKEND_ROOT, "uploads"),
};
