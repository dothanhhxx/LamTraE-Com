"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProductCard } from "@/components/ds";
import { fold } from "@/components/shell/Header";
import { useCart } from "@/lib/cart";
import { CATEGORIES, PRODUCTS, getCategory, photo, priceOf } from "@/lib/products";

const chip = (on: boolean) => ({
  display: "inline-flex", alignItems: "center", height: 36, padding: "0 14px", borderRadius: 999, fontSize: 13, whiteSpace: "nowrap" as const,
  textDecoration: "none", border: "1px solid " + (on ? "var(--text-strong)" : "var(--border-strong)"),
  background: on ? "var(--text-strong)" : "transparent", color: on ? "var(--paper-50)" : "var(--text-strong)",
});

export default function ProductGrid() {
  const params = useSearchParams();
  const cat = params.get("danh-muc") ?? undefined;
  const q = params.get("q") ?? "";
  const { add } = useCart();

  const list = useMemo(() => {
    const k = fold(q.trim());
    return PRODUCTS.filter((p) => (!cat || p.category === cat) && (!k || fold(`${p.name} ${p.kind} ${p.note}`).includes(k)));
  }, [cat, q]);
  const category = getCategory(cat);

  return (
    <div className="lt-container" style={{ paddingTop: 16, paddingBottom: 80 }}>
      <div role="navigation" aria-label="Lọc theo danh mục" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 0 20px", scrollbarWidth: "none" }}>
        <Link href="/san-pham" style={chip(!cat)}>Tất cả</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/san-pham?danh-muc=${c.slug}`} style={chip(cat === c.slug)}>{c.name}</Link>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, padding: "0 0 20px", borderBottom: "1px solid var(--border-hairline)", marginBottom: 28, fontSize: 14, color: "var(--text-muted)" }}>
        <span>
          {q ? <>Kết quả cho “<strong style={{ color: "var(--text-strong)", fontWeight: 500 }}>{q}</strong>”</> : category ? category.desc : "Toàn bộ trà và quà tặng của Lam Trà."}
        </span>
        <span style={{ whiteSpace: "nowrap" }}>{list.length} sản phẩm</span>
      </div>

      {list.length === 0 ? (
        <p style={{ fontSize: 15, color: "var(--text-body)" }}>
          Chưa có sản phẩm phù hợp. <Link href="/san-pham">Xem tất cả trà</Link>
        </p>
      ) : (
        <div className="lt-grid lt-grid-4">
          {list.map((p) => (
            <ProductCard
              key={p.slug}
              href={`/san-pham/${p.slug}`}
              name={p.name}
              note={p.note}
              image={photo(p.ph)}
              price={priceOf(p)}
              compareAt={p.compareAt}
              rating={p.rating}
              reviews={p.reviews}
              badge={p.compareAt ? { label: "Ưu đãi", tone: "sale" } : p.isNew ? { label: "Mới", tone: "new" } : p.sold > 500 ? { label: "Bán chạy", tone: "accent" } : undefined}
              onQuickAdd={() => add(p.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
