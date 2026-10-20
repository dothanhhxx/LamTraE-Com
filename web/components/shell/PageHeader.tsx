import Link from "next/link";
import type { ReactNode } from "react";
import { Button, Icon } from "@/components/ds";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
      <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Trang chủ</Link>
      {crumbs.map((c) => (
        <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Icon name="chevron-right" size={14} />
          {c.href ? <Link href={c.href} style={{ color: "inherit", textDecoration: "none" }}>{c.label}</Link> : <span aria-current="page" style={{ color: "var(--text-strong)" }}>{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ title, eyebrow, desc, crumbs = [] }: { title: string; eyebrow?: string; desc?: ReactNode; crumbs?: Crumb[] }) {
  return (
    <div className="lt-container" style={{ paddingTop: 24, paddingBottom: 8 }}>
      <Breadcrumbs crumbs={crumbs} />
      {eyebrow && <div style={{ marginTop: 24, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 500, color: "var(--accent)" }}>{eyebrow}</div>}
      <h1 style={{ margin: eyebrow ? "8px 0 0" : "24px 0 0", fontSize: "clamp(28px,3.4vw,40px)", lineHeight: 1.2, fontWeight: 500, letterSpacing: "-.01em", color: "var(--text-strong)" }}>{title}</h1>
      {desc && <p style={{ margin: "10px 0 0", maxWidth: 640, fontSize: 15, lineHeight: 1.6, color: "var(--text-body)" }}>{desc}</p>}
    </div>
  );
}

/** Khung tạm cho các trang sẽ hoàn thiện ở giai đoạn sau. */
export function ComingSoon({ icon = "leaf", text, cta = { label: "Xem các loại trà", href: "/san-pham" } }: { icon?: string; text: ReactNode; cta?: { label: string; href: string } }) {
  return (
    <div className="lt-container" style={{ padding: "32px 0 80px" }}>
      <div style={{ maxWidth: 560, padding: "32px 28px", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", background: "var(--surface-card)", display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <span style={{ width: 48, height: 48, borderRadius: 999, border: "1px solid var(--border-strong)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={22} />
        </span>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--text-body)" }}>{text}</p>
        <Button href={cta.href} variant="secondary" iconRight="arrow-right">{cta.label}</Button>
      </div>
    </div>
  );
}
