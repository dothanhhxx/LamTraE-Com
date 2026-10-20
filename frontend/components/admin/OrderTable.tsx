"use client";

import { useEffect, useState } from "react";
import { formatVND } from "@/components/ds";
import { OrderDetailModal } from "./OrderDetailModal";
import { StatusBadge } from "./StatusBadge";
import type { Order, OrderMetrics, OrderStatus } from "@/shared";

export function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<OrderMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (statusFilter !== "") q.set("status", statusFilter);
      if (search.trim()) q.set("search", search.trim());

      const res = await fetch(`/api/admin/orders?${q.toString()}`);
      const data = await res.json();
      if (data.ok) {
        setOrders(data.orders || []);
        setMetrics(data.metrics || null);
      }
    } catch (e) {
      console.error("Lỗi lấy đơn hàng:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (code: string, newStatus: OrderStatus, note?: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, status: newStatus, note }),
      });
      const data = await res.json();
      if (data.ok) {
        // Cập nhật trạng thái trực tiếp trên view
        setOrders((prev) =>
          prev.map((o) => (o.code === code ? { ...o, status: newStatus, internalNote: note } : o))
        );
        if (selectedOrder && selectedOrder.code === code) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus, internalNote: note } : null));
        }
        fetchOrders();
      }
    } catch (e) {
      console.error("Lỗi cập nhật trạng thái:", e);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("Không có đơn hàng nào để xuất.");
      return;
    }
    const headers = [
      "Mã đơn",
      "Ngày đặt",
      "Khách hàng",
      "Số điện thoại",
      "Địa chỉ",
      "Tỉnh thành",
      "Thanh toán",
      "Mã giảm giá",
      "Sản phẩm",
      "Tạm tính",
      "Giảm giá",
      "Phí ship",
      "Tổng tiền",
      "Trạng thái",
      "Gói quà",
      "Lời nhắn thiệp",
      "Ghi chú khách",
      "Ghi chú nội bộ",
    ];

    const rows = orders.map((o) => {
      const statusLabel =
        o.status === 0
          ? "Mới đặt"
          : o.status === 1
          ? "Đã xác nhận"
          : o.status === 2
          ? "Đang giao"
          : o.status === 3
          ? "Hoàn thành"
          : "Đã hủy";

      const itemsSummary = (o.items || [])
        .map((it) => `${it.name} (${it.variant || ""}) x${it.qty}`)
        .join("; ");

      return [
        `"${o.code}"`,
        `"${new Date(o.createdAt).toLocaleString("vi-VN")}"`,
        `"${(o.buyer?.name || "").replace(/"/g, '""')}"`,
        `"${o.buyer?.phone || ""}"`,
        `"${(o.address || "").replace(/"/g, '""')}"`,
        `"${(o.province || "").replace(/"/g, '""')}"`,
        `"${o.payment === "vietqr" ? "VietQR Chuyển khoản" : "COD Tiền mặt"}"`,
        `"${o.coupon || ""}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        o.totals?.subtotal || 0,
        o.totals?.discount || 0,
        o.totals?.shipping || 0,
        o.totals?.total || 0,
        `"${statusLabel}"`,
        `"${o.gift?.wrap ? "Có gói quà" : "Không"}"`,
        `"${(o.gift?.message || "").replace(/"/g, '""')}"`,
        `"${(o.note || "").replace(/"/g, '""')}"`,
        `"${(o.internalNote || "").replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LamTra_DonHang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { label: "Tất cả", value: "" },
    { label: "Mới đặt", value: "0" },
    { label: "Đã xác nhận", value: "1" },
    { label: "Đang giao", value: "2" },
    { label: "Hoàn thành", value: "3" },
    { label: "Đã hủy", value: "-1" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Metric Cards */}
      {metrics && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: 10, border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Doanh thu tạm tính</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#0D2219", marginTop: 4 }}>
              {formatVND(metrics.totalRevenue)}
            </div>
            <div style={{ fontSize: 12, color: "#10B981", marginTop: 4 }}>{metrics.totalOrders} đơn hàng tổng cộng</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: 10, border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Đơn mới chờ duyệt</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#D97706", marginTop: 4 }}>
              {metrics.pendingCount}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Cần xác nhận VietQR/COD</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: 10, border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Đang giao hàng</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#2563EB", marginTop: 4 }}>
              {metrics.shippingCount}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Bưu cục đang phát</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: 10, border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Giao thành công</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#059669", marginTop: 4 }}>
              {metrics.completedCount}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Khách đã nhận trà</div>
          </div>
        </div>
      )}

      {/* Control Bar: Tabs & Search */}
      <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: 10, border: "1px solid #E5E7EB", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {tabs.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 6,
                  border: active ? "1px solid var(--primary)" : "1px solid #E5E7EB",
                  background: active ? "#0D2219" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#374151",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Actions: Search & Export CSV */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 8, flex: "1 1 220px", maxWidth: 340 }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã đơn, tên, số điện thoại…"
              style={{
                flex: 1,
                height: 38,
                padding: "0 12px",
                borderRadius: 6,
                border: "1px solid #D1D5DB",
                fontSize: 13.5,
                outline: "none",
                background: "#FAF8F5",
              }}
            />
            <button
              type="submit"
              style={{
                height: 38,
                padding: "0 16px",
                borderRadius: 6,
                border: 0,
                background: "#0D2219",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Tìm
            </button>
          </form>

          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: 6,
              border: "1px solid #D1D5DB",
              background: "#FFFFFF",
              color: "#047857",
              fontSize: 13,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <span>📥 Xuất Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ background: "#FFFFFF", borderRadius: 10, border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {loading ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#6B7280", fontSize: 14 }}>
            Đang tải dữ liệu đơn hàng...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: "50px 20px", textAlign: "center", color: "#6B7280" }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: "#374151" }}>Chưa có đơn hàng nào</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Khi khách chốt đơn trên website, thông tin sẽ tự động hiển thị tại đây.</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", color: "#4B5563" }}>
                  <th style={{ padding: "12px 16px" }}>Mã đơn</th>
                  <th style={{ padding: "12px 16px" }}>Thời gian</th>
                  <th style={{ padding: "12px 16px" }}>Khách hàng</th>
                  <th style={{ padding: "12px 16px" }}>Tỉnh/Thành</th>
                  <th style={{ padding: "12px 16px" }}>Thanh toán</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Tổng tiền</th>
                  <th style={{ padding: "12px 16px", textAlign: "center" }}>Trạng thái</th>
                  <th style={{ padding: "12px 16px", textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.code} style={{ borderBottom: "1px solid #F3F4F6", transition: "background 120ms ease" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#0D2219" }}>
                      #{o.code}
                      {o.gift?.wrap && (
                        <span title="Có gói quà thiệp" style={{ marginLeft: 4, cursor: "help" }}>🎁</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#6B7280", fontSize: 12.5 }}>
                      {new Date(o.createdAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#111827" }}>{o.buyer.name}</div>
                      <a href={`tel:${o.buyer.phone}`} style={{ fontSize: 12.5, color: "#047857", textDecoration: "none" }}>
                        {o.buyer.phone}
                      </a>
                      {o.internalNote && (
                        <div style={{ marginTop: 4, fontSize: 11.5, color: "#92400E", background: "#FEF3C7", padding: "2px 6px", borderRadius: 4, display: "inline-block" }}>
                          📌 {o.internalNote}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#374151" }}>{o.province}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: o.payment === "vietqr" ? "#047857" : "#B45309" }}>
                        {o.payment === "vietqr" ? "VietQR" : "COD"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, color: "#111827" }}>
                      {formatVND(o.totals.total)}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <StatusBadge status={o.status} />
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 6,
                            border: "1px solid #D1D5DB",
                            background: "#FFFFFF",
                            fontSize: 12.5,
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          Chi tiết
                        </button>
                        {o.status === 0 && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(o.code, 1)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              border: 0,
                              background: "#047857",
                              color: "#FFFFFF",
                              fontSize: 12.5,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Duyệt
                          </button>
                        )}
                        {o.status === 1 && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(o.code, 2)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              border: 0,
                              background: "#1D4ED8",
                              color: "#FFFFFF",
                              fontSize: 12.5,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Giao
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
