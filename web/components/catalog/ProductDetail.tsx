"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Button, Icon, OptionPicker, Price, ProductImage, QuantityStepper, Rating } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { DEFAULT_GRADE, DEFAULT_SIZE, GRADE_OPTIONS, SIZE_OPTIONS, photo, priceOf, variantLabel, type Product } from "@/lib/products";

export default function ProductDetail({ product: p }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [grade, setGrade] = useState(DEFAULT_GRADE);
  const [qty, setQty] = useState(1);
  const unit = priceOf(p, size, grade);
  const onDefault = size === DEFAULT_SIZE && grade === DEFAULT_GRADE;

  return (
    <div className="lt-container" style={{ paddingTop: 16, paddingBottom: 80 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "28px clamp(28px,4vw,56px)", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 360px", minWidth: 0, maxWidth: 620 }}>
          <ProductImage src={photo(p.ph)} alt={p.name} ratio="4 / 5" />
          {/* TODO GĐ2: thư viện ảnh nhiều góc chụp */}
        </div>

        <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 500, color: "var(--accent)" }}>{p.kind}</span>
              {p.isNew && <Badge tone="new">Mới</Badge>}
              {p.compareAt && <Badge tone="sale">Ưu đãi</Badge>}
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(28px,3vw,38px)", lineHeight: 1.2, fontWeight: 500, letterSpacing: "-.01em", color: "var(--text-strong)" }}>{p.name}</h1>
            <div style={{ fontSize: 15, color: "var(--tra-500)" }}>{p.note}</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 13, color: "var(--text-muted)" }}>
              <Rating value={p.rating} count={p.reviews} />
              <span>·</span>
              <span>Đã bán {p.sold}</span>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--text-body)" }}>{p.desc}</p>

          {p.fixed ? (
            <div style={{ padding: "14px 16px", border: "1px solid var(--border-hairline)", borderRadius: 6, background: "var(--surface-card)", fontSize: 13, lineHeight: 1.55 }}>
              Bộ quà gói sẵn trong hộp sơn mài. Bạn ghi lời nhắn ở bước đặt hàng, Lam Trà sẽ viết tay vào thiệp.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <OptionPicker label="Khối lượng" options={SIZE_OPTIONS} value={size} onChange={setSize} />
              <OptionPicker label="Phân hạng" options={GRADE_OPTIONS} value={grade} onChange={setGrade} />
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, paddingTop: 16, borderTop: "1px solid var(--border-hairline)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Price value={unit * qty} compareAt={p.compareAt && onDefault ? p.compareAt * qty : undefined} size="lg" />
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{variantLabel(p, size, grade)}{qty > 1 ? ` · ${qty} gói` : ""}</span>
            </div>
            <QuantityStepper value={qty} onChange={setQty} />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <div style={{ flex: "1 1 160px" }}>
              <Button variant="secondary" size="lg" fullWidth iconLeft="shopping-bag" onClick={() => add(p.slug, size, grade, qty)}>Thêm vào giỏ</Button>
            </div>
            <div style={{ flex: "1 1 160px" }}>
              <Button size="lg" fullWidth iconRight="arrow-right" onClick={() => { add(p.slug, size, grade, qty); router.push("/gio-hang"); }}>Mua ngay</Button>
            </div>
          </div>

          <ul style={{ listStyle: "none", margin: 0, padding: "16px 0 0", borderTop: "1px solid var(--border-hairline)", display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--text-body)" }}>
            <li style={{ display: "flex", gap: 10 }}><Icon name="map-pin" size={18} color="var(--accent)" />Nguồn gốc: {p.origin}</li>
            <li style={{ display: "flex", gap: 10 }}><Icon name="qr-code" size={18} color="var(--accent)" />Thanh toán VietQR hoặc COD</li>
            <li style={{ display: "flex", gap: 10 }}><Icon name="truck" size={18} color="var(--accent)" />Lam Trà xác nhận qua Zalo trong 30 phút</li>
          </ul>
        </div>
      </div>
      {/* TODO GĐ2: thông số, hướng dẫn pha, chính sách, đánh giá, sản phẩm liên quan */}
    </div>
  );
}
