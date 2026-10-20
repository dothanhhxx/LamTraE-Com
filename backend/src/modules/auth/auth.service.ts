import { ENV } from "../../config/env.js";

export const ADMIN_COOKIE_NAME = "lt_admin_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 ngày

function getSecretKey(): string {
  return ENV.ADMIN_SECRET_KEY;
}

function toBase64Url(data: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < data.byteLength; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return atob(base64);
}

export class AuthService {
  /** Kiểm tra mật mã chủ shop */
  static verifyPasscode(passcode: string): boolean {
    if (!passcode || typeof passcode !== "string") return false;
    return passcode.trim() === getSecretKey();
  }

  /** Tạo session token đã được ký HMAC SHA-256 */
  static async createSessionToken(): Promise<string> {
    const payload = JSON.stringify({
      role: "admin",
      issuedAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    });
    const enc = new TextEncoder();
    const b64Payload = toBase64Url(enc.encode(payload));

    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(getSecretKey()),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(b64Payload));
    const signature = toBase64Url(new Uint8Array(sigBuf));

    return `${b64Payload}.${signature}`;
  }

  /** Xác thực token từ Cookie bằng Web Crypto HMAC SHA-256 */
  static async verifySessionToken(token?: string | null): Promise<boolean> {
    if (!token || typeof token !== "string") return false;
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [b64Payload, signature] = parts;
    const enc = new TextEncoder();

    try {
      const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(getSecretKey()),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(b64Payload));
      const expectedSig = toBase64Url(new Uint8Array(sigBuf));

      if (signature !== expectedSig) return false;

      const payload = JSON.parse(fromBase64Url(b64Payload));
      if (payload.role !== "admin") return false;
      if (Date.now() > payload.expiresAt) return false;
      return true;
    } catch {
      return false;
    }
  }
}
