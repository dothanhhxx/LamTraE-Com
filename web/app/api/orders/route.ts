import { NextResponse } from "next/server";
import { isOrderCode, newOrderCode, normalizePhone, quote, toItems, validateOrder, type Order, type OrderInput } from "@/lib/checkout";
import { append, notify, readAll } from "@/lib/server/store";


const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Chỉ giữ các trường được phép, cắt độ dài, để không lưu dữ liệu lạ từ client. */
function sanitize(b: Record<string, any>): OrderInput {
  const lines = Array.isArray(b.lines) ? b.lines.slice(0, 50) : [];
  return {
    code: str(b.code, 12).toUpperCase() || undefined,
    lines: lines.map((l: any) => ({ slug: str(l?.slug, 80), size: str(l?.size, 4), grade: str(l?.grade, 4), qty: Number(l?.qty) || 0 })),
    buyer: { name: str(b.buyer?.name, 80), phone: normalizePhone(str(b.buyer?.phone, 20)), email: str(b.buyer?.email, 120) || undefined },
    recipient: b.recipient ? { name: str(b.recipient.name, 80), phone: normalizePhone(str(b.recipient.phone, 20)) } : undefined,
    province: str(b.province, 40),
    address: str(b.address, 300),
    express: !!b.express,
    gift: b.gift ? { wrap: !!b.gift.wrap, message: str(b.gift.message, 300) || undefined, hidePrice: !!b.gift.hidePrice } : undefined,
    payment: b.payment === "cod" ? "cod" : "vietqr",
    coupon: str(b.coupon, 30) || undefined,
    note: str(b.note, 500) || undefined,
  };
}

export async function POST(req: Request) {
  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ error: "Bị chặn." }, { status: 400 }); // bẫy bot

  const input = sanitize(body);
  const errors = validateOrder(input);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const items = toItems(input.lines);
  const totals = quote({ items, coupon: input.coupon, province: input.province, express: input.express, giftWrap: input.gift?.wrap });
  // Giữ mã khách đã thấy ở trang đặt hàng (đã ghi vào nội dung chuyển khoản), trừ khi sai định dạng hoặc trùng.
  const taken = new Set((await readAll<Order>("orders")).map((o) => o.code));
  const code = input.code && isOrderCode(input.code) && !taken.has(input.code) ? input.code : newOrderCode();
  const order: Order = { ...input, lines: items.map(({ slug, size, grade, qty }) => ({ slug, size, grade, qty })), coupon: totals.coupon, code, createdAt: new Date().toISOString(), items, totals, status: 0 };

  await append("orders", order);
  await notify("order", order);
  return NextResponse.json({ order });
}

/** Tra cứu đơn bằng mã + SĐT (không cần đăng nhập). */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const code = str(u.searchParams.get("ma"), 20).toUpperCase();
  const phone = normalizePhone(str(u.searchParams.get("sdt"), 20));
  if (!code || !phone) return NextResponse.json({ error: "Thiếu mã đơn hoặc số điện thoại." }, { status: 400 });
  const all = await readAll<Order>("orders");
  // Cập nhật trạng thái (xác nhận, đang giao…) được ghi nối tiếp vào orders-status.jsonl cho tới khi có admin.
  const updates = await readAll<{ code: string; status: number }>("orders-status");
  const order = all.find((o) => o.code === code && (o.buyer.phone === phone || o.recipient?.phone === phone));
  if (!order) return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
  const last = updates.filter((x) => x.code === code).at(-1);
  return NextResponse.json({ order: last ? { ...order, status: last.status } : order });
}

/** Khách báo đã chuyển khoản VietQR. */
export async function PATCH(req: Request) {
  const b = await req.json().catch(() => ({}));
  const code = str(b.code, 20).toUpperCase();
  const phone = normalizePhone(str(b.phone, 20));
  if (!code || !phone) return NextResponse.json({ error: "Thiếu thông tin." }, { status: 400 });
  const rec = { code, phone, paidClaimedAt: new Date().toISOString() };
  await append("payments", rec);
  await notify("payment-claimed", rec);
  return NextResponse.json({ ok: true, ...rec });
}
