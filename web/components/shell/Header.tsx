"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button, Dialog, Icon, formatVND } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { PRODUCTS, photo, priceOf } from "@/lib/products";
import { NAV } from "@/lib/site";
import { fold } from "@/lib/text";


const roundBtn = {
  width: 44, height: 44, border: 0, borderRadius: 999, background: "transparent", color: "inherit",
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative",
} as const;

function NavLinks({ ink, onNavigate, vertical }: { ink: string; onNavigate?: () => void; vertical?: boolean }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const isActive = (href: string) => {
    const [p, q] = href.split("?");
    if (pathname !== p) return false;
    if (!q) return true;
    const [k, v] = q.split("=");
    return params.get(k) === v;
  };
  return (
    <>
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          onClick={onNavigate}
          aria-current={isActive(n.href) ? "page" : undefined}
          className={vertical ? undefined : "lt-nav-link"}
          style={
            vertical
              ? { fontSize: 16, color: "var(--text-strong)", textDecoration: "none", padding: "15px 0", borderBottom: "1px solid var(--border-hairline)" }
              : { fontSize: 14, color: ink, padding: "6px 0" }
          }
        >
          {n.label}
        </Link>
      ))}
    </>
  );
}

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const results = useMemo(() => {
    const k = fold(q.trim());
    if (!k) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter((p) => fold(`${p.name} ${p.kind} ${p.note}`).includes(k));
  }, [q]);
  useEffect(() => {
    if (open) setQ("");
  }, [open]);
  const submit = () => {
    onClose();
    router.push(`/san-pham${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };
  return (
    <Dialog open={open} onClose={onClose} title="Tìm trà">
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ padding: "16px 20px 8px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, height: 48, padding: "0 14px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-input)", background: "var(--surface-raised)", color: "var(--text-muted)" }}>
          <Icon name="search" size={20} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Móc Câu, trà sen, hộp quà…"
            aria-label="Từ khóa tìm kiếm"
            style={{ flex: 1, border: 0, outline: "none", background: "transparent", fontFamily: "inherit", fontSize: 15, color: "var(--text-strong)" }}
          />
        </label>
      </form>
      <div style={{ padding: "4px 20px 20px" }}>
        <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--text-muted)", padding: "10px 0 6px" }}>
          {q.trim() ? `${results.length} kết quả` : "Gợi ý"}
        </div>
        {results.length === 0 ? (
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--text-body)" }}>Lam Trà chưa có loại trà này. Bạn thử từ khóa khác, hoặc nhắn Zalo để được tư vấn.</p>
        ) : (
          results.map((p) => (
            <Link key={p.slug} href={`/san-pham/${p.slug}`} onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border-hairline)", textDecoration: "none", color: "var(--text-strong)" }}>
              <span style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 4, backgroundImage: `url('${photo(p.ph)}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{p.name}</span>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{p.kind} · {p.note}</span>
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{formatVND(priceOf(p))}</span>
            </Link>
          ))
        )}
      </div>
    </Dialog>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlay = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setMenu(false), [pathname]);

  const solid = !overlay || scrolled || menu;
  const ink = solid ? "var(--text-strong)" : "var(--logo-cream)";

  return (
    <>
      <header
        style={{
          position: overlay ? "fixed" : "sticky", top: 0, left: 0, right: 0, zIndex: 30,
          background: solid ? "rgba(247,240,227,.94)" : "transparent",
          backdropFilter: solid ? "blur(10px)" : "none",
          WebkitBackdropFilter: solid ? "blur(10px)" : "none",
          borderBottom: "1px solid " + (solid ? "var(--border-hairline)" : "transparent"),
          transition: "background 200ms var(--ease-out),border-color 200ms",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", height: 68, padding: "0 clamp(12px,3vw,40px)", display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/" aria-label="Lam Trà – Trang chủ" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: ink, flexShrink: 0 }}>
            <span style={{ width: 42, height: 42, borderRadius: 6, background: "var(--logo-green)", border: "1px solid rgba(188,154,108,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/lam-tra-emblem.svg" alt="" style={{ height: 30 }} />
            </span>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
              <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-.01em" }}>Lam Trà</span>
              <span style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: solid ? "var(--tra-500)" : "var(--tra-300)" }}>Tea &amp; beyond</span>
            </span>
          </Link>

          <nav aria-label="Danh mục chính" className="lt-desktop" style={{ gap: 30, flex: 1, justifyContent: "center" }}>
            <Suspense>
              <NavLinks ink={ink} />
            </Suspense>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "auto", color: ink }}>
            <button type="button" aria-label="Tìm kiếm" className="lt-head-btn" style={roundBtn} onClick={() => setSearch(true)}>
              <Icon name="search" size={22} />
            </button>
            <Link href="/yeu-thich" aria-label="Yêu thích" className="lt-head-btn lt-desktop" style={{ ...roundBtn, color: ink }}>
              <Icon name="heart" size={22} />
            </Link>
            <Link href="/tai-khoan" aria-label="Tài khoản" className="lt-head-btn lt-desktop" style={{ ...roundBtn, color: ink }}>
              <Icon name="user" size={22} />
            </Link>
            <Link href="/gio-hang" aria-label={`Giỏ hàng, ${count} sản phẩm`} className="lt-head-btn" style={{ ...roundBtn, color: ink }}>
              <Icon name="shopping-bag" size={22} />
              {ready && count > 0 && (
                <span style={{ position: "absolute", top: 5, right: 4, minWidth: 17, height: 17, padding: "0 4px", boxSizing: "border-box", borderRadius: 999, background: "var(--tra-400)", color: "var(--logo-green)", fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontVariantNumeric: "tabular-nums" }}>
                  {count}
                </span>
              )}
            </Link>
            <span className="lt-desktop" style={{ marginLeft: 10 }}>
              <Button href="/san-pham" variant="accent" size="sm" iconRight="arrow-right">Mua ngay</Button>
            </span>
            <button type="button" aria-label={menu ? "Đóng danh mục" : "Mở danh mục"} aria-expanded={menu} className="lt-mobile" onClick={() => setMenu((m) => !m)} style={roundBtn}>
              <Icon name={menu ? "x" : "menu"} size={22} />
            </button>
          </div>
        </div>

        {menu && (
          <nav aria-label="Danh mục" className="lt-mobile lt-fade" style={{ flexDirection: "column", padding: "4px 20px 20px", background: "var(--bg-page)", borderTop: "1px solid var(--border-hairline)" }}>
            <Suspense>
              <NavLinks ink="var(--text-strong)" vertical onNavigate={() => setMenu(false)} />
            </Suspense>
            <Button href="/san-pham" size="lg" fullWidth style={{ marginTop: 16 }}>Xem tất cả trà</Button>
          </nav>
        )}
      </header>
      <SearchDialog open={search} onClose={() => setSearch(false)} />
    </>
  );
}
