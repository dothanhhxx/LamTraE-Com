import Link from "next/link";
import { Button, Icon, ProductImage, Rating, SectionTitle } from "@/components/ds";
import { TeaGrid } from "@/components/catalog/TeaCard";
import { POSTS, formatDate } from "@/lib/posts";
import { CATEGORIES, PRODUCTS, bestSellers, getProduct, photo } from "@/lib/products";
import { TESTIMONIALS } from "@/lib/reviews";

const section = { paddingTop: "clamp(48px,7vw,80px)", paddingBottom: "clamp(48px,7vw,80px)" } as const;

export default function HomeSections() {
  const reviewTotal = PRODUCTS.reduce((s, p) => s + p.reviews, 0);
  const avg = PRODUCTS.reduce((s, p) => s + p.rating * p.reviews, 0) / reviewTotal;
  return (
    <>
      <section aria-labelledby="danh-muc" className="lt-container" style={{ ...section, paddingTop: 0 }}>
        <SectionTitle id="danh-muc" eyebrow="Danh mục" title="Chọn theo gu trà" action={<Link href="/san-pham" style={{ fontSize: 14 }}>Xem tất cả</Link>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 16 }}>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={c.slug === "qua-tang" ? "/qua-bieu" : `/san-pham?danh-muc=${c.slug}`} className="lt-card" style={{ position: "relative", display: "block", borderRadius: 6, overflow: "hidden", textDecoration: "none" }}>
              <span className="lt-card-photo" style={{ display: "block" }}>
                <ProductImage src={photo(c.ph)} alt="" ratio="4 / 3" />
              </span>
              <span style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(25,36,26,.82) 0%, rgba(25,36,26,.1) 60%)" }} />
              <span style={{ position: "absolute", left: 18, right: 18, bottom: 16, display: "flex", flexDirection: "column", gap: 4, color: "var(--logo-cream)" }}>
                <span style={{ fontSize: 19, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>{c.name}<Icon name="arrow-right" size={16} /></span>
                <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--reu-100)" }}>{c.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="ban-chay" className="lt-container" style={section}>
        <SectionTitle id="ban-chay" eyebrow="Được mua nhiều" title="Trà bán chạy" action={<Link href="/san-pham?sap-xep=ban-chay" style={{ fontSize: 14 }}>Xem thêm</Link>} />
        <TeaGrid products={bestSellers(4)} />
      </section>

      <section aria-labelledby="qua-bieu" style={{ background: "var(--surface-inverse)", color: "var(--text-on-inverse)" }}>
        <div className="lt-container" style={{ ...section, display: "flex", flexWrap: "wrap", gap: "32px clamp(32px,5vw,72px)", alignItems: "center" }}>
          <div style={{ flex: "1 1 320px", maxWidth: 520, borderRadius: 6, overflow: "hidden" }}>
            <ProductImage src={photo("hopqua")} alt="Hộp quà Trao Gửi" ratio="4 / 3" />
          </div>
          <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 500, color: "var(--tra-300)" }}>Quà biếu</span>
            <h2 id="qua-bieu" style={{ margin: 0, color: "var(--text-on-inverse)", fontSize: "clamp(26px,3vw,38px)", lineHeight: 1.2, fontWeight: 500 }}>
              Gửi trà thay lời,
              <br />
              <span style={{ color: "var(--tra-300)" }}>Lam Trà viết tay giúp bạn.</span>
            </h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--text-on-inverse-muted)", maxWidth: 460 }}>
              Chọn quà theo dịp Tết, Trung thu, 20/10 hay tân gia. Gói giấy dó, thiệp viết tay, giao thẳng tới người nhận và không kèm hóa đơn nếu bạn muốn.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 24px", alignItems: "center", marginTop: 6 }}>
              <Button href="/qua-bieu" variant="accent" iconRight="arrow-right">Chọn quà biếu</Button>
              <Link href="/qua-bieu#doanh-nghiep" className="lt-gift-link">
                <Icon name="building-2" size={18} />
                Quà doanh nghiệp
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="khach-noi" className="lt-container" style={section}>
        <SectionTitle
          id="khach-noi"
          eyebrow="Khách nói về Lam Trà"
          title={`${avg.toFixed(1)} trên 5 từ ${reviewTotal} đánh giá`}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16 }}>
          {TESTIMONIALS.map((r) => {
            const p = getProduct(r.slug);
            return (
              <figure key={r.name} style={{ margin: 0, padding: 24, border: "1px solid var(--border-hairline)", borderRadius: 6, background: "var(--surface-card)", display: "flex", flexDirection: "column", gap: 14 }}>
                <Rating value={r.stars} />
                <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--text-strong)" }}>“{r.text}”</blockquote>
                <figcaption style={{ marginTop: "auto", fontSize: 13, color: "var(--text-muted)" }}>
                  <strong style={{ fontWeight: 500, color: "var(--text-body)" }}>{r.name}</strong>
                  {r.verified && " · Đã mua hàng"}
                  {p && (
                    <>
                      {" · "}
                      <Link href={`/san-pham/${p.slug}`}>{p.name}</Link>
                    </>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="tra-dam" className="lt-container" style={{ ...section, paddingTop: 0 }}>
        <SectionTitle id="tra-dam" eyebrow="Trà đàm" title="Hiểu trà để thưởng trà" action={<Link href="/tra-dam" style={{ fontSize: 14 }}>Đọc thêm</Link>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 24 }}>
          {POSTS.map((p) => (
            <Link key={p.slug} href={`/tra-dam/${p.slug}`} className="lt-card" style={{ display: "flex", gap: 16, alignItems: "center", textDecoration: "none" }}>
              <span className="lt-card-photo" style={{ flex: "0 0 112px", borderRadius: 6, overflow: "hidden" }}>
                <ProductImage src={photo(p.ph)} alt="" ratio="1 / 1" />
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span className="lt-card-name" style={{ fontSize: 16, lineHeight: 1.35, fontWeight: 500, color: "var(--text-strong)" }}>{p.title}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(p.date)} · {p.readMin} phút đọc</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
