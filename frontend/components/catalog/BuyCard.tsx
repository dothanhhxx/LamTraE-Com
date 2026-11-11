"use client";

// Thẻ mua nhanh cho trang Sản phẩm: chọn số lượng, thêm giỏ hoặc mua ngay ngay trên thẻ.
// Sản phẩm có nhiều khối lượng/phân hạng được thêm theo bản mặc định (200g · Premium); muốn đổi thì vào trang chi tiết.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon, formatVND } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { DEFAULT_GRADE, DEFAULT_SIZE, badgeOf, keywordsOf, maxQtyOf, photo, priceOf, type Product } from "@/lib/products";

const unitOf = (p: Product) => (p.fixed ? "hộp" : `gói ${DEFAULT_SIZE}g`);

function Stepper({ value, onChange, max, label }: { value: number; onChange: (v: number) => void; max: number; label: string }) {
  return (
    <div className="lt-buy-stepper" role="group" aria-label={`Số lượng ${label}`}>
      <button type="button" aria-label="Giảm số lượng" disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <Icon name="minus" size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" aria-label="Tăng số lượng" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}

/** Trạng thái dùng chung cho thẻ và khối nổi bật. */
function useBuy(p: Product) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const max = maxQtyOf(p);
  const soldOut = max < 1;
  return {
    qty, setQty: (v: number) => setQty(Math.max(1, Math.min(max, v))), max, soldOut,
    addToCart: () => add(p.slug, DEFAULT_SIZE, DEFAULT_GRADE, qty),
    buyNow: () => add(p.slug, DEFAULT_SIZE, DEFAULT_GRADE, qty) && router.push("/gio-hang"),
  };
}

export function BuyCard({ p }: { p: Product }) {
  const b = useBuy(p);
  const [justAdded, setJustAdded] = useState(false);
  const badge = b.soldOut ? { label: "Tạm hết hàng", tone: "neutral" as const } : badgeOf(p);
  const href = `/san-pham/${p.slug}`;
  const kws = keywordsOf(p);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (b.soldOut) return;
    b.addToCart();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className="lt-buy-card lt-compact-card">
      <Link href={href} className="lt-buy-photo" aria-label={`Xem chi tiết ${p.name}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo(p.ph)} alt={p.name} loading="lazy" decoding="async" />
        {badge && (
          <span className={`lt-buy-badge lt-buy-badge-${badge.tone ?? "neutral"}`}>
            {badge.label}
          </span>
        )}
        {!b.soldOut && (
          <button
            type="button"
            className={`lt-buy-quick-add ${justAdded ? "is-added" : ""}`}
            onClick={handleQuickAdd}
            aria-label={`Thêm nhanh ${p.name} vào giỏ`}
            title="Thêm nhanh vào giỏ hàng"
          >
            <Icon name={justAdded ? "check" : "shopping-bag"} size={16} />
          </button>
        )}
      </Link>

      <div className="lt-buy-body">
        {/* Tên sản phẩm */}
        <h3 className="lt-buy-name">
          <Link href={href}>{p.name}</Link>
        </h3>

        {/* Từ khóa hương vị & đặc trưng nổi bật */}
        {kws.length > 0 && (
          <div className="lt-compact-keywords" aria-label="Đặc trưng nổi bật">
            {kws.map((k) => (
              <span key={k} className="lt-compact-kw">{k}</span>
            ))}
          </div>
        )}

        {/* Đánh giá sao gọn gàng */}
        {p.rating != null && (
          <div className="lt-compact-rating">
            <span className="lt-compact-star">★</span>
            <strong>{p.rating.toFixed(1)}</strong>
            <span>({p.reviews})</span>
          </div>
        )}

        {/* Giá sản phẩm */}
        <div className="lt-buy-price">
          <strong>{formatVND(priceOf(p))}</strong>
          <span className="lt-buy-unit">/ {unitOf(p)}</span>
          {p.compareAt && <s>{formatVND(p.compareAt)}</s>}
        </div>

        {/* Nút xem chi tiết */}
        <Link href={href} className="lt-buy-detail-link">
          <span>Xem chi tiết</span>
          <Icon name="arrow-right" size={13} />
        </Link>
      </div>
    </article>
  );
}

export function BuyGrid({ products }: { products: Product[] }) {
  return (
    <div className="lt-buy-grid">
      {products.map((p) => <BuyCard key={p.slug} p={p} />)}
    </div>
  );
}

/** Khối sản phẩm nổi bật ở đầu trang Sản phẩm. */
export function FeaturedProduct({ p }: { p: Product }) {
  const b = useBuy(p);
  const href = `/san-pham/${p.slug}`;
  const kws = keywordsOf(p);
  return (
    <section aria-labelledby="sp-noi-bat" className="lt-feature">
      <Link href={href} className="lt-feature-photo" tabIndex={-1} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo(p.ph)} alt="" decoding="async" fetchPriority="high" />
      </Link>
      <div className="lt-feature-info">
        <span className="lt-feature-eyebrow">{p.kind} · Được mua nhiều nhất</span>
        <h2 id="sp-noi-bat" className="lt-feature-name">{p.name}</h2>
        {kws.length > 0 && (
          <div className="lt-compact-keywords">
            {kws.map((k) => (
              <span key={k} className="lt-compact-kw" style={{ fontSize: 12, padding: "3px 8px" }}>{k}</span>
            ))}
          </div>
        )}
        <p className="lt-feature-note">“{p.note}”</p>
        <p className="lt-feature-desc">{p.desc}</p>
        <div className="lt-feature-buy">
          <div className="lt-buy-price lt-feature-price">
            <strong>{formatVND(priceOf(p))}</strong>
            <span>/ {unitOf(p)}</span>
            {p.compareAt && <s>{formatVND(p.compareAt)}</s>}
          </div>
          {!b.soldOut && <Stepper value={b.qty} onChange={b.setQty} max={b.max} label={p.name} />}
        </div>
        <div className="lt-feature-actions">
          <button type="button" className="lt-buy-btn lt-feature-btn-line" disabled={b.soldOut} onClick={b.addToCart}>
            <Icon name="shopping-bag" size={16} />Thêm vào giỏ hàng
          </button>
          <button type="button" className="lt-buy-btn lt-feature-btn-solid" disabled={b.soldOut} onClick={b.buyNow}>
            {b.soldOut ? "Tạm hết hàng" : "Mua ngay"}
          </button>
        </div>
        <Link href={href} className="lt-feature-more">Xem chi tiết sản phẩm →</Link>
      </div>
    </section>
  );
}
