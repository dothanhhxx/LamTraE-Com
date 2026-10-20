"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button, Choice, Dialog, Icon, Select } from "@/components/ds";
import { fold } from "@/lib/text";
import { CATEGORIES, PRODUCTS, PURPOSES, getCategory, priceOf, type Product } from "@/lib/products";
import { TeaGrid } from "./TeaCard";

const chip = (on: boolean) => ({
  display: "inline-flex", alignItems: "center", height: 36, padding: "0 14px", borderRadius: 999, fontSize: 13, whiteSpace: "nowrap" as const,
  textDecoration: "none", border: "1px solid " + (on ? "var(--text-strong)" : "var(--border-strong)"),
  background: on ? "var(--text-strong)" : "transparent", color: on ? "var(--paper-50)" : "var(--text-strong)",
});

const PRICES = [
  { value: "duoi-200", label: "Dưới 200.000₫", test: (n: number) => n < 200000 },
  { value: "200-400", label: "200.000₫ – 400.000₫", test: (n: number) => n >= 200000 && n <= 400000 },
  { value: "tren-400", label: "Trên 400.000₫", test: (n: number) => n > 400000 },
];

const SORTS: { value: string; label: string; cmp: (a: Product, b: Product) => number }[] = [
  { value: "", label: "Nổi bật", cmp: (a, b) => b.rating * b.reviews - a.rating * a.reviews },
  { value: "ban-chay", label: "Bán chạy", cmp: (a, b) => b.sold - a.sold },
  { value: "moi-nhat", label: "Mới nhất", cmp: (a, b) => b.addedAt.localeCompare(a.addedAt) },
  { value: "gia-tang", label: "Giá thấp đến cao", cmp: (a, b) => priceOf(a) - priceOf(b) },
  { value: "gia-giam", label: "Giá cao đến thấp", cmp: (a, b) => priceOf(b) - priceOf(a) },
];

export default function ProductGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const cat = params.get("danh-muc") ?? "";
  const q = params.get("q") ?? "";
  const purpose = params.get("muc-dich") ?? "";
  const price = params.get("gia") ?? "";
  const rating = params.get("sao") ?? "";
  const sort = params.get("sap-xep") ?? "";

  const hrefWith = (patch: Record<string, string>) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) v ? sp.set(k, v) : sp.delete(k);
    const s = sp.toString();
    return s ? `${pathname}?${s}` : pathname;
  };
  const set = (patch: Record<string, string>) => router.replace(hrefWith(patch), { scroll: false });

  const list = useMemo(() => {
    const k = fold(q.trim());
    const pr = PRICES.find((x) => x.value === price);
    const minStars = Number(rating) || 0;
    const cmp = (SORTS.find((s) => s.value === sort) ?? SORTS[0]).cmp;
    return PRODUCTS.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!k || fold(`${p.name} ${p.kind} ${p.note} ${p.desc}`).includes(k)) &&
        (!purpose || p.purposes.includes(purpose as Product["purposes"][number])) &&
        (!pr || pr.test(priceOf(p))) &&
        p.rating >= minStars,
    ).sort(cmp);
  }, [cat, q, purpose, price, rating, sort]);

  const category = getCategory(cat);
  type Active = { label: string; clear: Record<string, string> };
  const active: Active[] = [];
  if (q) active.push({ label: `“${q}”`, clear: { q: "" } });
  if (purpose) active.push({ label: PURPOSES.find((x) => x.value === purpose)?.label ?? purpose, clear: { "muc-dich": "" } });
  if (price) active.push({ label: PRICES.find((x) => x.value === price)?.label ?? price, clear: { gia: "" } });
  if (rating) active.push({ label: `Từ ${rating} sao`, clear: { sao: "" } });

  const filters = (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "20px" }}>
      <fieldset style={{ border: 0, margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <legend style={{ fontSize: 13, fontWeight: 500, color: "var(--text-strong)", marginBottom: 10 }}>Mục đích</legend>
        {PURPOSES.map((x) => (
          <Choice key={x.value} name="muc-dich" checked={purpose === x.value} onChange={() => set({ "muc-dich": purpose === x.value ? "" : x.value })} title={x.label} desc={x.desc} />
        ))}
      </fieldset>
      <fieldset style={{ border: 0, margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <legend style={{ fontSize: 13, fontWeight: 500, color: "var(--text-strong)", marginBottom: 10 }}>Khoảng giá (gói 150g)</legend>
        {PRICES.map((x) => (
          <Choice key={x.value} name="gia" checked={price === x.value} onChange={() => set({ gia: price === x.value ? "" : x.value })} title={x.label} />
        ))}
      </fieldset>
      <fieldset style={{ border: 0, margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <legend style={{ fontSize: 13, fontWeight: 500, color: "var(--text-strong)", marginBottom: 10 }}>Đánh giá</legend>
        {["4.8", "4.5"].map((x) => (
          <Choice key={x} name="sao" checked={rating === x} onChange={() => set({ sao: rating === x ? "" : x })} title={`Từ ${x} sao trở lên`} />
        ))}
      </fieldset>
    </div>
  );

  return (
    <div className="lt-container" style={{ paddingTop: 16, paddingBottom: 80 }}>
      <div role="navigation" aria-label="Lọc theo danh mục" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 0 20px", scrollbarWidth: "none" }}>
        <Link href={hrefWith({ "danh-muc": "" })} style={chip(!cat)}>Tất cả</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={hrefWith({ "danh-muc": c.slug })} style={chip(cat === c.slug)}>{c.name}</Link>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "0 0 16px", borderBottom: "1px solid var(--border-hairline)", marginBottom: 28, fontSize: 14, color: "var(--text-muted)" }}>
        <span style={{ flex: "1 1 260px" }}>
          {category ? category.desc : "Toàn bộ trà và quà tặng của Lam Trà."} <span style={{ whiteSpace: "nowrap" }}>· {list.length} sản phẩm</span>
        </span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Button variant="secondary" size="sm" iconLeft="sliders-horizontal" onClick={() => setOpen(true)}>
            Bộ lọc{active.length ? ` (${active.length})` : ""}
          </Button>
          <div style={{ width: 190 }}>
            <Select aria-label="Sắp xếp" value={sort} onChange={(e) => set({ "sap-xep": e.target.value })} options={SORTS.map((s) => ({ value: s.value, label: s.label }))} style={{ height: 36, fontSize: 13 }} />
          </div>
        </div>
      </div>

      {active.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "-12px 0 24px" }}>
          {active.map((a) => (
            <button key={a.label} type="button" onClick={() => set(a.clear)} style={{ ...chip(false), cursor: "pointer", gap: 6, fontFamily: "inherit", background: "var(--surface-card)" }}>
              {a.label}
              <Icon name="x" size={14} />
            </button>
          ))}
          <button type="button" onClick={() => set({ q: "", "muc-dich": "", gia: "", sao: "" })} style={{ border: 0, background: "transparent", color: "var(--text-link)", fontFamily: "inherit", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
            Xóa bộ lọc
          </button>
        </div>
      )}

      {list.length === 0 ? (
        <div style={{ padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 15, color: "var(--text-body)" }}>Chưa có loại trà phù hợp với lựa chọn của bạn. Bạn thử bỏ bớt bộ lọc, hoặc nhắn Zalo để Lam Trà tư vấn.</p>
          <Button variant="secondary" href="/san-pham">Xem tất cả trà</Button>
        </div>
      ) : (
        <TeaGrid products={list} />
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title="Bộ lọc">
        {filters}
        <div style={{ position: "sticky", bottom: 0, display: "flex", gap: 10, padding: "12px 20px 20px", background: "var(--surface-card)", borderTop: "1px solid var(--border-hairline)" }}>
          <Button variant="ghost" onClick={() => set({ "muc-dich": "", gia: "", sao: "" })}>Xóa</Button>
          <div style={{ flex: 1 }}>
            <Button fullWidth onClick={() => setOpen(false)}>Xem {list.length} sản phẩm</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
