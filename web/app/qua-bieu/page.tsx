import type { Metadata } from "next";
import Link from "next/link";
import { Icon, SectionTitle } from "@/components/ds";
import { formatVND } from "@/lib/format";
import { TeaGrid } from "@/components/catalog/TeaCard";
import { QuoteForm } from "@/components/info/Forms";
import { PageHeader } from "@/components/shell/PageHeader";
import { GIFT_WRAP_FREE_MIN } from "@/lib/checkout";
import { OCCASIONS, PRODUCTS, priceOf, type Occasion } from "@/lib/products";

export const metadata: Metadata = {
  title: "Quà biếu trà Tân Cương",
  description: "Hộp quà trà Tân Cương cho Tết, Trung thu, 20/10, tân gia. Gói quà, thiệp viết tay, giao tận tay người nhận, báo giá quà doanh nghiệp.",
  openGraph: { images: ["/assets/photos/hopqua.jpg"] },
};

const BUDGETS = [
  { value: "duoi-300", label: "Dưới 300.000₫", test: (n: number) => n < 300000 },
  { value: "300-600", label: "300.000₫ – 600.000₫", test: (n: number) => n >= 300000 && n <= 600000 },
  { value: "tren-600", label: "Trên 600.000₫", test: (n: number) => n > 600000 },
];

type Props = { searchParams: Promise<{ dip?: string; "ngan-sach"?: string }> };

const chip = (on: boolean) => ({
  display: "inline-flex", alignItems: "center", height: 36, padding: "0 14px", borderRadius: 999, fontSize: 13, whiteSpace: "nowrap" as const, textDecoration: "none",
  border: "1px solid " + (on ? "var(--text-strong)" : "var(--border-strong)"), background: on ? "var(--text-strong)" : "transparent", color: on ? "var(--paper-50)" : "var(--text-strong)",
});

export default async function GiftPage({ searchParams }: Props) {
  const sp = await searchParams;
  const dip = OCCASIONS.find((o) => o.value === sp.dip)?.value;
  const budget = BUDGETS.find((b) => b.value === sp["ngan-sach"]);
  const href = (patch: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    const next = { dip, "ngan-sach": budget?.value, ...patch };
    for (const [k, v] of Object.entries(next)) if (v) q.set(k, v);
    const s = q.toString();
    return `/qua-bieu${s ? `?${s}` : ""}#chon-qua`;
  };
  const list = PRODUCTS.filter((p) => p.purposes.includes("bieu-tang") && (!dip || p.occasions.includes(dip as Occasion)) && (!budget || budget.test(priceOf(p))));

  return (
    <>
      <PageHeader title="Quà biếu từ Tân Cương" eyebrow="Trọn tấm lòng trao gửi" crumbs={[{ label: "Quà biếu" }]} desc={`Trà được gói giấy dó, thiệp viết tay theo lời bạn nhắn, giao thẳng tới người nhận. Gói quà miễn phí cho đơn từ ${formatVND(GIFT_WRAP_FREE_MIN)}.`} />
      <div className="lt-container" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {OCCASIONS.map((o) => (
            <Link key={o.value} href={href({ dip: dip === o.value ? undefined : o.value })} aria-current={dip === o.value ? "true" : undefined} className="lt-occasion" style={{ padding: "18px 20px", borderRadius: 6, textDecoration: "none", border: dip === o.value ? "1.5px solid var(--text-strong)" : "1px solid var(--border-hairline)", background: "var(--surface-card)", display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 500, color: "var(--text-strong)" }}>{o.label}</span>
              <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--text-muted)" }}>{o.desc}</span>
            </Link>
          ))}
        </div>

        <section id="chon-qua" style={{ marginTop: 48, scrollMarginTop: 90 }}>
          <SectionTitle title={dip ? `Quà ${OCCASIONS.find((o) => o.value === dip)?.label}` : "Gợi ý quà biếu"} />
          <div role="navigation" aria-label="Lọc theo ngân sách" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            <Link href={href({ "ngan-sach": undefined })} style={chip(!budget)}>Mọi ngân sách</Link>
            {BUDGETS.map((b) => (
              <Link key={b.value} href={href({ "ngan-sach": b.value })} style={chip(budget?.value === b.value)}>{b.label}</Link>
            ))}
          </div>
          {list.length ? (
            <TeaGrid products={list} />
          ) : (
            <p style={{ fontSize: 15, color: "var(--text-body)" }}>Chưa có món quà sẵn trong khoảng này. Lam Trà có thể ghép hộp theo ngân sách của bạn, <Link href="/lien-he">nhắn cho chúng tôi</Link> nhé.</p>
          )}
        </section>

        <section style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {[
            { icon: "gift", t: "Gói quà, thiệp viết tay", d: "Giấy dó, dây lạt, thiệp Lam Trà. Bạn ghi lời nhắn khi đặt hàng." },
            { icon: "truck", t: "Giao tận tay người nhận", d: "Nhập địa chỉ người nhận khác, Lam Trà gọi trước khi giao." },
            { icon: "receipt", t: "Ẩn giá, không kèm hóa đơn", d: "Hóa đơn gửi riêng cho bạn qua Zalo hoặc email." },
          ].map((x) => (
            <div key={x.t} style={{ display: "flex", gap: 14 }}>
              <Icon name={x.icon} size={24} color="var(--accent)" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text-strong)" }}>{x.t}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--text-body)", marginTop: 4 }}>{x.d}</div>
              </div>
            </div>
          ))}
        </section>

        <section id="doanh-nghiep" aria-labelledby="dn" style={{ marginTop: 72, scrollMarginTop: 90, padding: "clamp(24px,4vw,48px)", borderRadius: 10, background: "var(--surface-inverse)", color: "var(--text-on-inverse)", display: "flex", flexWrap: "wrap", gap: 40 }}>
          <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: 14 }}>
            <Icon name="building-2" size={28} color="var(--tra-300)" />
            <h2 id="dn" style={{ margin: 0, color: "var(--text-on-inverse)", fontSize: "clamp(24px,2.6vw,32px)", fontWeight: 500, lineHeight: 1.25 }}>Quà Tết, quà tri ân cho doanh nghiệp</h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--text-on-inverse-muted)" }}>Đặt từ 10 hộp. In logo lên hộp và thiệp, ghép trà theo ngân sách, giao tới nhiều địa chỉ, xuất hóa đơn VAT. Lam Trà gửi báo giá và ảnh mẫu trong một ngày làm việc.</p>
          </div>
          <div className="lt-on-dark" style={{ flex: "1 1 420px", minWidth: 0, padding: 24, borderRadius: 6, background: "var(--surface-card)", color: "var(--text-body)" }}>
            <QuoteForm />
          </div>
        </section>
      </div>
    </>
  );
}
