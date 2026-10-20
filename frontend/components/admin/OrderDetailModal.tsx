"use client";

import { useEffect, useState } from "react";
import { Dialog, formatVND } from "@/components/ds";
import { StatusBadge } from "./StatusBadge";
import type { Order, OrderStatus } from "@/shared";
import { ORDER_STATUS_METADATA } from "@/shared";

export function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
}: {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (code: string, status: OrderStatus, note?: string) => Promise<void>;
}) {
  const [note, setNote] = useState(order?.internalNote || "");
  const [saving, setSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    setNote(order?.internalNote || "");
    setNoteSaved(false);
  }, [order?.code, order?.internalNote]);

  if (!order) return null;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setSaving(true);
    await onUpdateStatus(order.code, newStatus, note);
    setSaving(false);
  };

  const handleSaveNoteOnly = async () => {
    setSaving(true);
    await onUpdateStatus(order.code, order.status, note);
    setSaving(false);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const statusList: OrderStatus[] = [0, 1, 2, 3, -1];

  return (
    <Dialog open={!!order} onClose={onClose} title={`Đơn hàng #${order.code}`} maxWidth={740}>
      <div style={{ padding: "16px 24px 28px", display: "flex", flexDirection: "column", gap: 20, fontFamily: "var(--font-ui)" }}>
        {/* Header Summary */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
          <div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Thời gian đặt hàng</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StatusBadge status={order.status} />
            <button
              type="button"
              onClick={handlePrint}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid #D1D5DB",
                background: "#FFFFFF",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              In phiếu gửi
            </button>
          </div>
        </div>

        {/* Customer & Shipping info */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, background: "#FAF8F5", padding: 16, borderRadius: 8, border: "1px solid #E5E7EB" }}>
          <div>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B7280", marginBottom: 6 }}>
              Khách hàng
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{order.buyer.name}</div>
            <div style={{ fontSize: 14, color: "#374151", margin: "3px 0" }}>
              SĐT: <a href={`tel:${order.buyer.phone}`} style={{ color: "#047857", fontWeight: 600, textDecoration: "none" }}>{order.buyer.phone}</a>
            </div>
            {order.buyer.email && <div style={{ fontSize: 13, color: "#6B7280" }}>{order.buyer.email}</div>}
            
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <a
                href={`https://zalo.me/${order.buyer.phone}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: 4,
                  background: "#0068FF",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Nhắn Zalo
              </a>
              <a
                href={`tel:${order.buyer.phone}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: 4,
                  background: "#047857",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Gọi điện
              </a>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B7280", marginBottom: 6 }}>
              Địa chỉ giao hàng
            </div>
            <div style={{ fontSize: 14, color: "#111827", lineHeight: 1.5 }}>
              {order.address}, {order.province}
            </div>
            {order.recipient && (
              <div style={{ marginTop: 6, fontSize: 13, color: "#4B5563" }}>
                Người nhận khác: <strong>{order.recipient.name}</strong> ({order.recipient.phone})
              </div>
            )}
            <div style={{ marginTop: 6, fontSize: 13, color: order.express ? "#D97706" : "#6B7280", fontWeight: order.express ? 600 : 400 }}>
              Giao hàng: {order.express ? "Giao nhanh hỏa tốc" : "Tiêu chuẩn"}
            </div>
          </div>
        </div>

        {/* Gift Wrap & Message */}
        {order.gift?.wrap && (
          <div style={{ background: "#FEF3C7", padding: "12px 16px", borderRadius: 6, border: "1px solid #FCD34D" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>🎁 ĐƠN QUÀ TẶNG KÈM THIỆP VIẾT TAY:</div>
            {order.gift.message ? (
              <div style={{ fontSize: 14, fontStyle: "italic", color: "#78350F", marginTop: 4 }}>
                &ldquo;{order.gift.message}&rdquo;
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "#92400E", marginTop: 2 }}>Khách không để lại lời nhắn thiệp.</div>
            )}
            {order.gift.hidePrice && <div style={{ fontSize: 12, color: "#B45309", marginTop: 4 }}>* Yêu cầu: Không đính kèm hóa đơn trong kiện hàng.</div>}
          </div>
        )}

        {/* Items List */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Sản phẩm đặt mua</div>
          <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", textAlign: "left", color: "#6B7280" }}>
                  <th style={{ padding: "10px 14px" }}>Sản phẩm</th>
                  <th style={{ padding: "10px 14px", textAlign: "center" }}>Số lượng</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Đơn giá</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: i < order.items.length - 1 ? "1px solid #F3F4F6" : 0 }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 600, color: "#111827" }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{item.variant}</div>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 600 }}>{item.qty}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: "#4B5563" }}>{formatVND(item.unit)}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 600, color: "#111827" }}>{formatVND(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals & Payment Method */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Hình thức thanh toán</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", textTransform: "uppercase" }}>
              {order.payment === "vietqr" ? "Chuyển khoản VietQR" : "Thanh toán khi nhận hàng (COD)"}
            </div>
            {order.paidClaimedAt && (
              <div style={{ fontSize: 12, color: "#047857", marginTop: 3 }}>
                ✓ Khách đã bấm &ldquo;Tôi đã chuyển khoản&rdquo; lúc {new Date(order.paidClaimedAt).toLocaleTimeString("vi-VN")}
              </div>
            )}
            {order.note && (
              <div style={{ marginTop: 8, fontSize: 13, color: "#4B5563" }}>
                <strong>Ghi chú của khách:</strong> {order.note}
              </div>
            )}
          </div>

          <div style={{ minWidth: 220, textAlign: "right", fontSize: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0", color: "#6B7280" }}>
              <span>Tạm tính:</span>
              <span>{formatVND(order.totals.subtotal)}</span>
            </div>
            {order.totals.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0", color: "#DC2626" }}>
                <span>Giảm giá ({order.totals.coupon}):</span>
                <span>-{formatVND(order.totals.discount)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0", color: "#6B7280" }}>
              <span>Phí vận chuyển:</span>
              <span>{order.totals.shipping === 0 ? "Miễn phí" : formatVND(order.totals.shipping)}</span>
            </div>
            {order.totals.giftWrap > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0", color: "#6B7280" }}>
                <span>Phí gói quà:</span>
                <span>{formatVND(order.totals.giftWrap)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", margin: "8px 0 0", paddingTop: 8, borderTop: "1px solid #E5E7EB", fontSize: 17, fontWeight: 700, color: "#0D2219" }}>
              <span>Tổng thu:</span>
              <span>{formatVND(order.totals.total)}</span>
            </div>
          </div>
        </div>

        {/* Internal Admin Note */}
        <div style={{ background: "#FAF8F5", padding: "14px 16px", borderRadius: 8, border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>📌 Ghi chú nội bộ (Chỉ quản trị viên thấy):</span>
            {noteSaved && <span style={{ color: "#047857", fontSize: 12, fontWeight: 600 }}>✓ Đã lưu thành công!</span>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="VD: Khách hẹn giao sau 18h, Đã đối soát tiền VietQR STB..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                flex: 1,
                height: 36,
                padding: "0 12px",
                borderRadius: 6,
                border: "1px solid #D1D5DB",
                fontSize: 13,
                background: "#FFFFFF",
              }}
            />
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveNoteOnly}
              style={{
                height: 36,
                padding: "0 14px",
                borderRadius: 6,
                border: 0,
                background: "#0D2219",
                color: "#FFFFFF",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {saving ? "Lưu..." : "Lưu ghi chú"}
            </button>
          </div>
        </div>

        {/* Change Status Action Bar */}
        <div style={{ paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
            Cập nhật trạng thái đơn hàng:
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {statusList.map((st) => {
              const meta = ORDER_STATUS_METADATA[st];
              const isCurrent = order.status === st;
              return (
                <button
                  key={st}
                  type="button"
                  disabled={saving || isCurrent}
                  onClick={() => handleStatusChange(st)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: isCurrent ? `2px solid ${meta.fg}` : "1px solid #D1D5DB",
                    background: isCurrent ? meta.bg : "#FFFFFF",
                    color: isCurrent ? meta.fg : "#374151",
                    fontSize: 13,
                    fontWeight: isCurrent ? 700 : 500,
                    cursor: saving || isCurrent ? "default" : "pointer",
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
