import { NextResponse } from "next/server";
import { isEmail, isPhone, normalizePhone } from "@/lib/checkout";
import { append, notify } from "@/lib/server/store";

// Một điểm nhận cho: liên hệ, báo giá quà doanh nghiệp, đánh giá sản phẩm (chờ duyệt).
const TYPES = ["lien-he", "bao-gia", "danh-gia"] as const;
type Kind = (typeof TYPES)[number];

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  if (b.website) return NextResponse.json({ error: "Bị chặn." }, { status: 400 });

  const type = (TYPES as readonly string[]).includes(b.type) ? (b.type as Kind) : "lien-he";
  const rec = {
    type,
    name: str(b.name, 80),
    phone: normalizePhone(str(b.phone, 20)),
    email: str(b.email, 120),
    company: str(b.company, 120),
    quantity: str(b.quantity, 40),
    budget: str(b.budget, 40),
    date: str(b.date, 40),
    product: str(b.product, 80),
    stars: Math.max(1, Math.min(5, Number(b.stars) || 5)),
    message: str(b.message, 2000),
    createdAt: new Date().toISOString(),
  };

  const errors: Record<string, string> = {};
  if (!rec.name) errors.name = "Bạn cho Lam Trà xin tên.";
  if (type === "danh-gia") {
    if (rec.message.length < 10) errors.message = "Bạn viết thêm vài dòng cảm nhận nhé.";
  } else {
    if (!isPhone(rec.phone) && !isEmail(rec.email)) errors.phone = "Bạn để lại số điện thoại hoặc email để Lam Trà liên lạc.";
    if (type === "lien-he" && rec.message.length < 5) errors.message = "Bạn ghi nội dung cần hỏi nhé.";
  }
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  await append("messages", rec);
  await notify(type, rec);
  return NextResponse.json({ ok: true });
}
