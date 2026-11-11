"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { formatVND, Icon, Dialog } from "@/components/ds";
import { ProductEditModal } from "./ProductEditModal";
import type { Product } from "@/shared";
import { CATEGORIES, PRODUCTS, photo } from "@/lib/products";

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<Record<string, { base: number; compareAt?: number }>>({});

  // Filter & Search
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string; slug: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!previewImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setPreviewImage(null);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [previewImage]);

  const populatePrices = (list: Product[]) => {
    const prices: Record<string, { base: number; compareAt?: number }> = {};
    for (const p of list) {
      prices[p.slug] = { base: p.base, compareAt: p.compareAt };
    }
    setEditPrice((prev) => ({ ...prices, ...prev }));
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // 1. Thử gọi API quản trị đầy đủ
      const res = await fetch("/api/admin/products");
      const data = await res.json().catch(() => ({ ok: false }));

      if (res.status === 401 || !data.ok) {
        // Chưa đăng nhập hoặc cookie hết hạn -> Fallback sang API công khai để chủ shop vẫn xem được sản phẩm
        const pubRes = await fetch("/api/products").catch(() => null);
        if (pubRes && pubRes.ok) {
          const pubData = await pubRes.json().catch(() => ({ ok: false }));
          if (pubData.ok && Array.isArray(pubData.products) && pubData.products.length > 0) {
            setProducts(pubData.products);
            populatePrices(pubData.products);
            setIsFallback(true);
            return;
          }
        }
        // Fallback danh mục tĩnh
        setProducts(PRODUCTS);
        populatePrices(PRODUCTS);
        setIsFallback(true);
        return;
      }

      if (data.ok) {
        const list = Array.isArray(data.products) ? data.products : [];
        if (list.length === 0) {
          // Danh mục trống -> Tự động kích hoạt đồng bộ 6 sản phẩm mẫu
          await handleSync(false, true);
        } else {
          setProducts(list);
          populatePrices(list);
          setIsFallback(false);
        }
      }
    } catch (e) {
      console.error("Lỗi lấy sản phẩm, chuyển sang dữ liệu dự phòng:", e);
      setProducts(PRODUCTS);
      populatePrices(PRODUCTS);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (forceReset = false, silent = false) => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/products/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceReset }),
      });
      const data = await res.json().catch(() => ({ ok: false }));

      if (data.ok && Array.isArray(data.products)) {
        setProducts(data.products);
        populatePrices(data.products);
        setIsFallback(false);
        if (!silent) {
          alert(`Đã đồng bộ thành công ${data.count || data.products.length} sản phẩm trà vào hệ thống!`);
        }
      } else {
        // Nếu API backend chưa sẵn sàng, nạp trực tiếp danh mục chuẩn vào giao diện
        setProducts(PRODUCTS);
        populatePrices(PRODUCTS);
        if (!silent) {
          alert(`Đã nạp ${PRODUCTS.length} sản phẩm danh mục chuẩn vào giao diện.`);
        }
      }
    } catch {
      setProducts(PRODUCTS);
      populatePrices(PRODUCTS);
      if (!silent) {
        alert("Lỗi khi kết nối máy chủ. Đã nạp sản phẩm mặc định từ hệ thống.");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSavePrice = async (slug: string) => {
    const p = editPrice[slug];
    if (!p) return;

    setSavingSlug(slug);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, base: Number(p.base), compareAt: p.compareAt ? Number(p.compareAt) : undefined }),
      });
      const data = await res.json();
      if (data.ok) {
        setProducts((prev) => prev.map((item) => (item.slug === slug ? { ...item, ...p } : item)));
        alert("Đã cập nhật giá bán thành công!");
      }
    } catch {
      alert("Lỗi khi lưu giá sản phẩm.");
    } finally {
      setSavingSlug(null);
    }
  };

  const handleToggleActive = async (slug: string, currentActive: boolean) => {
    setSavingSlug(slug);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, active: !currentActive }),
      });
      const data = await res.json();
      if (data.ok) {
        setProducts((prev) => prev.map((item) => (item.slug === slug ? { ...item, active: !currentActive } : item)));
      }
    } catch {
      alert("Lỗi khi cập nhật trạng thái.");
    } finally {
      setSavingSlug(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products?slug=${deletingProduct.slug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setProducts((prev) => prev.filter((p) => p.slug !== deletingProduct.slug));
        setDeletingProduct(null);
      } else {
        alert(data.error || "Không thể xóa sản phẩm này.");
      }
    } catch {
      alert("Lỗi khi xóa sản phẩm.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (statusFilter === "active" && p.active === false) return false;
    if (statusFilter === "inactive" && p.active !== false) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.kind.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalActive = products.filter((p) => p.active !== false).length;
  const totalInactive = products.filter((p) => p.active === false).length;
  const totalGift = products.filter((p) => p.category === "qua-tang").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "var(--font-ui)" }}>
      {/* Cảnh báo chế độ dự phòng nếu chưa kết nối phiên quản trị */}
      {isFallback && (
        <div
          style={{
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            padding: "12px 16px",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            fontSize: 13,
            color: "#92400E",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="triangle-alert" size={16} />
            <span>
              <strong>Chế độ dự phòng:</strong> Đang hiển thị sản phẩm từ danh mục hệ thống (phiên quản trị chưa kích hoạt).
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              type="button"
              disabled={isSyncing}
              onClick={() => handleSync(false)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid #D97706",
                background: "#FEF3C7",
                color: "#92400E",
                fontWeight: 600,
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              {isSyncing ? "Đang đồng bộ..." : "🔄 Đồng bộ dữ liệu"}
            </button>
            <Link
              href="/quan-tri"
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid #0D2219",
                background: "#0D2219",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: 12.5,
                textDecoration: "none",
              }}
            >
              Đăng nhập quản trị
            </Link>
          </div>
        </div>
      )}

      {/* Top Banner & Metrics - 2x2 on Mobile */}
      <div className="lt-admin-metrics-grid">
        <div className="lt-admin-metric-card">
          <div className="lt-metric-label" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--stone-600, #74684F)" }}>Tổng danh mục trà</div>
          <div className="lt-metric-value" style={{ fontSize: 24, fontWeight: 700, color: "var(--reu-800, #24341F)", marginTop: 4, fontFamily: "var(--font-display, serif)" }}>
            {products.length} dòng
          </div>
          <div className="lt-metric-sub" style={{ fontSize: 12, color: "var(--stone-500, #978A73)", marginTop: 4 }}>Trên toàn hệ thống</div>
        </div>

        <div className="lt-admin-metric-card">
          <div className="lt-metric-label" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--stone-600, #74684F)" }}>Đang mở bán</div>
          <div className="lt-metric-value" style={{ fontSize: 24, fontWeight: 700, color: "#047857", marginTop: 4, fontFamily: "var(--font-display, serif)" }}>
            {totalActive}
          </div>
          <div className="lt-metric-sub" style={{ fontSize: 12, color: "#10B981", marginTop: 4 }}>Hiển thị ra Storefront</div>
        </div>

        <div className="lt-admin-metric-card">
          <div className="lt-metric-label" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--stone-600, #74684F)" }}>Tạm ẩn mở bán</div>
          <div className="lt-metric-value" style={{ fontSize: 24, fontWeight: 700, color: "#B91C1C", marginTop: 4, fontFamily: "var(--font-display, serif)" }}>
            {totalInactive}
          </div>
          <div className="lt-metric-sub" style={{ fontSize: 12, color: "var(--stone-500, #978A73)", marginTop: 4 }}>Hết hàng / sắp ra mắt</div>
        </div>

        <div className="lt-admin-metric-card">
          <div className="lt-metric-label" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--stone-600, #74684F)" }}>Hộp quà biếu</div>
          <div className="lt-metric-value" style={{ fontSize: 24, fontWeight: 700, color: "var(--tra-600, #7D5F33)", marginTop: 4, fontFamily: "var(--font-display, serif)" }}>
            {totalGift}
          </div>
          <div className="lt-metric-sub" style={{ fontSize: 12, color: "var(--tra-500, #94723F)", marginTop: 4 }}>Set quà Doanh nghiệp</div>
        </div>
      </div>

      {/* Control Bar: Filter, Search & Add Button */}
      <div
        style={{
          background: "#FFFFFF",
          padding: "16px 18px",
          borderRadius: 12,
          border: "1px solid var(--border-hairline, #DFD2BB)",
          boxShadow: "0 1px 3px rgba(36, 52, 31, 0.04)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Category Filter Tabs (Horizontal Scrollable Chips on Mobile) */}
        <div className="lt-admin-tabs-scroll">
          <button
            type="button"
            onClick={() => setCategoryFilter("")}
            className="lt-admin-tab-chip"
            style={{
              padding: "7px 16px",
              borderRadius: 999,
              border: `1px solid ${categoryFilter === "" ? "var(--reu-800, #24341F)" : "var(--border-hairline, #DFD2BB)"}`,
              background: categoryFilter === "" ? "var(--reu-800, #24341F)" : "#FFFFFF",
              color: categoryFilter === "" ? "#F7F0E3" : "var(--stone-800, #39332A)",
              fontWeight: categoryFilter === "" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 140ms ease",
            }}
          >
            Tất cả danh mục
          </button>
          {CATEGORIES.map((c) => {
            const active = categoryFilter === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCategoryFilter(c.slug)}
                className="lt-admin-tab-chip"
                style={{
                  padding: "7px 16px",
                  borderRadius: 999,
                  border: `1px solid ${active ? "var(--reu-800, #24341F)" : "var(--border-hairline, #DFD2BB)"}`,
                  background: active ? "var(--reu-800, #24341F)" : "#FFFFFF",
                  color: active ? "#F7F0E3" : "var(--stone-800, #39332A)",
                  fontWeight: active ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 140ms ease",
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Actions: Status Filter, Search, + Thêm sản phẩm */}
        <div className="lt-admin-filter-bar">
          <div className="lt-admin-filter-search-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                height: 40,
                padding: "0 12px",
                borderRadius: 8,
                border: "1px solid var(--border-hairline, #DFD2BB)",
                background: "#FFFFFF",
                fontSize: 13,
                color: "var(--stone-900, #23201A)",
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang mở bán</option>
              <option value="inactive">Tạm ẩn</option>
            </select>

            <input
              type="text"
              placeholder="Tìm tên trà, mã slug, vùng, ghi chú..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 8,
                border: "1px solid var(--border-hairline, #DFD2BB)",
                background: "#FFFFFF",
                fontSize: 13,
                color: "var(--stone-900, #23201A)",
                flex: 1,
                minWidth: 0,
                outline: "none",
              }}
            />
          </div>

          <div className="lt-admin-filter-action-group">
            <button
              type="button"
              disabled={isSyncing}
              onClick={() => handleSync(false)}
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 8,
                border: "1px solid var(--border-hairline, #DFD2BB)",
                background: "#FFFFFF",
                color: "var(--stone-800, #39332A)",
                fontSize: 13,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                cursor: isSyncing ? "default" : "pointer",
                opacity: isSyncing ? 0.7 : 1,
                transition: "all 140ms ease",
                whiteSpace: "nowrap",
              }}
              title="Đồng bộ danh mục trà chuẩn vào trang quản trị"
            >
              <Icon name="rotate-ccw" size={14} color="var(--tra-500)" />
              <span>{isSyncing ? "Đang đồng bộ..." : "Đồng bộ sản phẩm"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: 8,
                border: "1px solid rgba(188, 154, 108, 0.4)",
                background: "linear-gradient(135deg, #19241A 0%, #24341F 100%)",
                color: "#F7F0E3",
                fontSize: 13.5,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(25, 36, 26, 0.3)",
                whiteSpace: "nowrap",
                transition: "all 140ms ease",
              }}
            >
              <span style={{ fontSize: 16, color: "var(--tra-300)" }}>+</span>
              <span>Thêm sản phẩm mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Content */}
      {loading ? (
        <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: 10, border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280" }}>
          Đang tải danh sách sản phẩm...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ background: "#FFFFFF", padding: "50px 20px", borderRadius: 10, border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>Không tìm thấy sản phẩm nào</div>
          <p style={{ fontSize: 13, marginTop: 6, color: "#6B7280" }}>
            {products.length === 0
              ? "Hệ thống quản trị chưa có dữ liệu sản phẩm hoặc đang tải lại."
              : "Không có sản phẩm nào khớp với bộ lọc hiện tại."}
          </p>
          <div style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              disabled={isSyncing}
              onClick={() => handleSync(false)}
              style={{
                padding: "10px 18px",
                borderRadius: 6,
                border: 0,
                background: "linear-gradient(135deg, #DFBE89, #BC9A6C)",
                color: "#0D2219",
                fontWeight: 700,
                fontSize: 13.5,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon name="rotate-ccw" size={15} />
              <span>{isSyncing ? "Đang đồng bộ..." : "🔄 Khôi phục & Đồng bộ 6 sản phẩm mẫu ngay"}</span>
            </button>
            {(categoryFilter || statusFilter || search) && (
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter("");
                  setStatusFilter("");
                  setSearch("");
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: 6,
                  border: "1px solid #D1D5DB",
                  background: "#FFFFFF",
                  color: "#374151",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* ─── 1. DESKTOP VIEW: BẢNG SẢN PHẨM (≥ 768px) ─── */}
          <div className="lt-admin-desktop-table" style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid var(--border-hairline, #DFD2BB)", overflow: "hidden", boxShadow: "0 1px 4px rgba(36, 52, 31, 0.04), 0 8px 24px rgba(36, 52, 31, 0.02)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "var(--paper-100, #F7F0E3)", borderBottom: "1px solid var(--border-hairline, #DFD2BB)", color: "var(--reu-800, #24341F)" }}>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Ảnh</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Sản phẩm</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Loại trà</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Giá bán cơ sở (VND)</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Giá niêm yết cũ (VND)</th>
                    <th style={{ padding: "14px 18px", textAlign: "center", fontWeight: 700 }}>Trạng thái</th>
                    <th style={{ padding: "14px 18px", textAlign: "center", fontWeight: 700 }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const ep = editPrice[p.slug] || { base: p.base, compareAt: p.compareAt };
                    const isSaving = savingSlug === p.slug;
                    const isActive = p.active ?? true;

                    return (
                      <tr key={p.slug} style={{ borderBottom: "1px solid var(--paper-200, #EEE4D2)", transition: "background 120ms ease" }}>
                        {/* Image Thumbnail with Click-to-Zoom */}
                        <td style={{ padding: "12px 18px", width: 68 }}>
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ src: photo(p.ph), title: p.name, slug: p.slug })}
                            title={`Bấm để xem ảnh phóng to: ${p.name}`}
                            style={{
                              width: 52,
                              height: 52,
                              borderRadius: 8,
                              overflow: "hidden",
                              border: "1.5px solid var(--border-hairline, #DFD2BB)",
                              background: "var(--paper-50, #FCF8F1)",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                              padding: 0,
                              cursor: "pointer",
                              position: "relative",
                              display: "block",
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo(p.ph)}
                              alt={p.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/assets/photos/moccau.jpg";
                              }}
                            />
                            <span
                              className="lt-thumb-zoom-overlay"
                              style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(13, 34, 25, 0.45)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#FFFFFF",
                              }}
                            >
                              <Icon name="search" size={16} />
                            </span>
                          </button>
                        </td>

                        {/* Name & Slug */}
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ fontWeight: 700, color: "var(--stone-900, #23201A)", fontSize: 14.5 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: "var(--stone-600, #74684F)", marginTop: 2 }}>
                            <code>/san-pham/{p.slug}</code>
                          </div>
                          {p.note && <div style={{ fontSize: 12, color: "var(--stone-500, #978A73)", marginTop: 2 }}>{p.note}</div>}
                        </td>

                        {/* Category & Kind */}
                        <td style={{ padding: "14px 18px" }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--reu-800, #24341F)", background: "var(--paper-100, #F7F0E3)", padding: "3px 9px", borderRadius: 999, border: "1px solid var(--border-hairline, #DFD2BB)" }}>
                            {p.kind}
                          </span>
                          <div style={{ fontSize: 11.5, color: "var(--stone-500, #978A73)", marginTop: 4 }}>{p.origin}</div>
                        </td>

                        {/* Base Price inline */}
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input
                              type="number"
                              step={1000}
                              value={ep.base}
                              onChange={(e) =>
                                setEditPrice((prev) => ({
                                  ...prev,
                                  [p.slug]: { ...prev[p.slug], base: Number(e.target.value) },
                                }))
                              }
                              style={{
                                width: 125,
                                height: 36,
                                padding: "0 10px",
                                borderRadius: 7,
                                border: "1px solid var(--border-hairline, #DFD2BB)",
                                background: "var(--paper-50, #FCF8F1)",
                                fontSize: 13.5,
                                fontWeight: 700,
                                color: "var(--reu-800, #24341F)",
                                outline: "none",
                              }}
                            />
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => handleSavePrice(p.slug)}
                              title="Lưu giá nhanh"
                              style={{
                                padding: "7px 12px",
                                borderRadius: 7,
                                border: "1px solid rgba(188, 154, 108, 0.4)",
                                background: "linear-gradient(135deg, #19241A, #24341F)",
                                color: "#F7F0E3",
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "all 140ms ease",
                              }}
                            >
                              {isSaving ? "..." : "Lưu"}
                            </button>
                          </div>
                        </td>

                        {/* Compare At inline */}
                        <td style={{ padding: "14px 18px" }}>
                          <input
                            type="number"
                            step={1000}
                            placeholder="Không có"
                            value={ep.compareAt || ""}
                            onChange={(e) =>
                              setEditPrice((prev) => ({
                                ...prev,
                                [p.slug]: { ...prev[p.slug], compareAt: e.target.value ? Number(e.target.value) : undefined },
                              }))
                            }
                            style={{
                              width: 115,
                              height: 36,
                              padding: "0 10px",
                              borderRadius: 7,
                              border: "1px solid var(--border-hairline, #DFD2BB)",
                              background: "var(--paper-50, #FCF8F1)",
                              fontSize: 13,
                              color: "var(--stone-800)",
                              outline: "none",
                            }}
                          />
                        </td>

                        {/* Active Status Badge */}
                        <td style={{ padding: "14px 18px", textAlign: "center" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 12px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 600,
                              background: isActive ? "#ECFDF5" : "#FEF2F2",
                              color: isActive ? "#047857" : "#B91C1C",
                              border: `1px solid ${isActive ? "#A7F3D0" : "#FECACA"}`,
                            }}
                          >
                            {isActive ? "Đang mở bán" : "Tạm ẩn"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "14px 18px", textAlign: "center" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            {/* Sửa chi tiết */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(p);
                                setIsModalOpen(true);
                              }}
                              style={{
                                padding: "6px 14px",
                                borderRadius: 7,
                                border: "1px solid var(--border-hairline, #DFD2BB)",
                                background: "#FFFFFF",
                                color: "var(--stone-900, #23201A)",
                                fontSize: 12.5,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 140ms ease",
                              }}
                            >
                              Sửa
                            </button>

                            {/* Ẩn / Hiện toggle */}
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => handleToggleActive(p.slug, isActive)}
                              style={{
                                padding: "6px 11px",
                                borderRadius: 7,
                                border: "1px solid var(--border-hairline, #DFD2BB)",
                                background: "#FFFFFF",
                                color: isActive ? "#C2410C" : "#047857",
                                fontSize: 12.5,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 140ms ease",
                              }}
                            >
                              {isActive ? "Tạm ẩn" : "Mở bán"}
                            </button>

                            {/* Xem trên web */}
                            <Link
                              href={`/san-pham/${p.slug}`}
                              target="_blank"
                              style={{
                                padding: "6px 10px",
                                borderRadius: 7,
                                border: "1px solid var(--border-hairline, #DFD2BB)",
                                background: "var(--paper-50, #FCF8F1)",
                                color: "var(--stone-700)",
                                fontSize: 12.5,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                transition: "all 140ms ease",
                              }}
                              title="Xem trang sản phẩm trên website"
                            >
                              <Icon name="arrow-right" size={13} />
                            </Link>

                            {/* Xóa sản phẩm */}
                            <button
                              type="button"
                              onClick={() => setDeletingProduct(p)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 7,
                                border: "1px solid #FECACA",
                                background: "#FEF2F2",
                                color: "#DC2626",
                                fontSize: 12.5,
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 140ms ease",
                              }}
                              title="Xóa sản phẩm này"
                            >
                              <Icon name="trash-2" size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─── 2. MOBILE VIEW: DANH SÁCH THẺ SẢN PHẨM (< 768px) ─── */}
          <div className="lt-admin-mobile-cards">
            {filteredProducts.map((p) => {
              const ep = editPrice[p.slug] || { base: p.base, compareAt: p.compareAt };
              const isSaving = savingSlug === p.slug;
              const isActive = p.active ?? true;

              return (
                <div key={p.slug} className="lt-admin-card-item">
                  {/* Top: Photo thumbnail, Name, Category & Status */}
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <button
                      type="button"
                      onClick={() => setPreviewImage({ src: photo(p.ph), title: p.name, slug: p.slug })}
                      title={`Bấm để xem ảnh phóng to: ${p.name}`}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1.5px solid var(--border-hairline, #DFD2BB)",
                        background: "var(--paper-50, #FCF8F1)",
                        flexShrink: 0,
                        padding: 0,
                        cursor: "pointer",
                        position: "relative",
                        display: "block",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo(p.ph)}
                        alt={p.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/assets/photos/moccau.jpg";
                        }}
                      />
                      <span
                        className="lt-thumb-zoom-overlay"
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(13, 34, 25, 0.45)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#FFFFFF",
                        }}
                      >
                        <Icon name="search" size={16} />
                      </span>
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--stone-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.name}
                        </span>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 600,
                            background: isActive ? "#ECFDF5" : "#FEF2F2",
                            color: isActive ? "#047857" : "#B91C1C",
                            border: `1px solid ${isActive ? "#A7F3D0" : "#FECACA"}`,
                            flexShrink: 0,
                          }}
                        >
                          {isActive ? "Đang bán" : "Tạm ẩn"}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 11.5, color: "var(--reu-800)", background: "var(--paper-100)", padding: "2px 8px", borderRadius: 999, border: "1px solid var(--border-hairline)" }}>
                          {p.kind}
                        </span>
                        <span style={{ fontSize: 11.5, color: "var(--stone-500)" }}>{p.origin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inline Price Edit for Mobile */}
                  <div style={{ background: "var(--paper-50, #FCF8F1)", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border-hairline, #DFD2BB)", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--stone-700)" }}>Giá cơ sở (hộp 200g):</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <input
                          type="number"
                          step={1000}
                          value={ep.base}
                          onChange={(e) =>
                            setEditPrice((prev) => ({
                              ...prev,
                              [p.slug]: { ...prev[p.slug], base: Number(e.target.value) },
                            }))
                          }
                          style={{
                            width: 100,
                            height: 36,
                            padding: "0 8px",
                            borderRadius: 6,
                            border: "1px solid var(--border-hairline, #DFD2BB)",
                            background: "#FFFFFF",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--reu-800)",
                            outline: "none",
                          }}
                        />
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => handleSavePrice(p.slug)}
                          style={{
                            height: 36,
                            padding: "0 12px",
                            borderRadius: 6,
                            border: 0,
                            background: "linear-gradient(135deg, #19241A, #24341F)",
                            color: "#F7F0E3",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {isSaving ? "..." : "Lưu"}
                        </button>
                      </div>
                    </div>

                    {ep.compareAt && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "var(--stone-600)" }}>
                        <span>Giá niêm yết cũ:</span>
                        <span style={{ textDecoration: "line-through" }}>{formatVND(ep.compareAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: 6, paddingTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(p);
                        setIsModalOpen(true);
                      }}
                      style={{
                        height: 38,
                        padding: "0 6px",
                        borderRadius: 7,
                        border: "1px solid var(--border-hairline, #DFD2BB)",
                        background: "#FFFFFF",
                        color: "var(--stone-900)",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Sửa chi tiết
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleToggleActive(p.slug, isActive)}
                      style={{
                        height: 38,
                        padding: "0 6px",
                        borderRadius: 7,
                        border: "1px solid var(--border-hairline, #DFD2BB)",
                        background: "#FFFFFF",
                        color: isActive ? "#C2410C" : "#047857",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isActive ? "Tạm ẩn" : "Mở bán"}
                    </button>

                    <Link
                      href={`/san-pham/${p.slug}`}
                      target="_blank"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 7,
                        border: "1px solid var(--border-hairline, #DFD2BB)",
                        background: "var(--paper-50)",
                        color: "var(--stone-700)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                      }}
                      title="Xem trên website"
                    >
                      <Icon name="arrow-right" size={15} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeletingProduct(p)}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 7,
                        border: "1px solid #FECACA",
                        background: "#FEF2F2",
                        color: "#DC2626",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      title="Xóa sản phẩm"
                    >
                      <Icon name="trash-2" size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Product Edit / Create Modal */}
      <ProductEditModal
        open={isModalOpen}
        product={editingProduct}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSaved={fetchProducts}
      />

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <Dialog open={!!deletingProduct} onClose={() => setDeletingProduct(null)} title="Xác nhận xóa sản phẩm">
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
              Bạn có chắc chắn muốn xóa sản phẩm <strong>&ldquo;{deletingProduct.name}&rdquo;</strong> (<code>{deletingProduct.slug}</code>) khỏi cửa hàng?
            </div>
            <div style={{ fontSize: 12.5, color: "#6B7280", background: "#FEF2F2", padding: "10px 14px", borderRadius: 6, border: "1px solid #FECACA" }}>
              ⚠️ Sản phẩm sau khi xóa sẽ không còn hiển thị trên danh mục hay trang chi tiết của khách hàng.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingProduct(null)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 7,
                  border: "1px solid var(--border-hairline, #DFD2BB)",
                  background: "#FFFFFF",
                  color: "var(--stone-800)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                style={{
                  padding: "8px 18px",
                  borderRadius: 7,
                  border: 0,
                  background: "#DC2626",
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Full-size Image Preview Lightbox */}
      {mounted && previewImage && createPortal(
        <div
          role="dialog"
          aria-modal
          aria-label={`Xem ảnh: ${previewImage.title}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            background: "rgba(10, 22, 16, 0.95)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            color: "#F7F0E3",
            animation: "ltFade .18s ease-out",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewImage(null);
          }}
        >
          {/* Topbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              background: "rgba(13, 34, 25, 0.75)",
              borderBottom: "1px solid rgba(188, 154, 108, 0.3)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#F7F0E3", fontFamily: "var(--font-display, serif)" }}>
                {previewImage.title}
              </span>
              <code style={{ fontSize: 12, background: "rgba(0, 0, 0, 0.35)", padding: "2px 8px", borderRadius: 4, color: "var(--tra-300)" }}>
                /san-pham/{previewImage.slug}
              </code>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <a
                href={previewImage.src}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#F7F0E3",
                  fontSize: 12.5,
                  textDecoration: "none",
                }}
              >
                <Icon name="external-link" size={14} />
                <span>Mở ảnh gốc</span>
              </a>

              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 7,
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  background: "rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title="Đóng (Esc)"
                aria-label="Đóng"
              >
                <Icon name="x" size={18} />
              </button>
            </div>
          </div>

          {/* Main Photo Center */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPreviewImage(null);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage.src}
              alt={previewImage.title}
              style={{
                maxWidth: "88vw",
                maxHeight: "78vh",
                objectFit: "contain",
                borderRadius: 12,
                border: "2px solid rgba(188, 154, 108, 0.4)",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.65)",
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
