import Link from "next/link";
import { Button, Icon, Rating, SectionTitle } from "@/components/ds";
import { TeaGrid } from "@/components/catalog/TeaCard";
import { POSTS } from "@/lib/posts";
import { PRODUCTS, getProduct, photo, type Product } from "@/lib/products";
import { TESTIMONIALS } from "@/lib/reviews";
import { PhotoBand, TeaSprig } from "@/components/shell/PhotoBand";
import HomeClosing from "@/components/landing/HomeClosing";
import CategoryRail from "@/components/landing/CategoryRail";
import TalkRail from "@/components/landing/TalkRail";

const section = { paddingTop: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)" } as const;

export default function HomeSections({ products }: { products?: Product[] } = {}) {
  const allProducts = products && products.length > 0 ? products : PRODUCTS;
  const reviewTotal = allProducts.reduce((s, p) => s + p.reviews, 0) || 1;
  const avg = allProducts.reduce((s, p) => s + p.rating * p.reviews, 0) / reviewTotal;
  const sellers = [...allProducts].sort((a, b) => b.sold - a.sold).slice(0, 4);

  return (
    <>
      <section aria-labelledby="danh-muc" className="lt-container" style={{ ...section, paddingTop: 0 }}>
        <SectionTitle id="danh-muc" eyebrow="Danh mục" title="Chọn theo gu trà" action={<Link href="/san-pham" style={{ fontSize: 14 }}>Xem tất cả</Link>} />
        <CategoryRail />
      </section>

      <section aria-labelledby="ban-chay" className="lt-bg-veil">
        <div className="lt-container" style={section}>
          <SectionTitle id="ban-chay" eyebrow="Được mua nhiều" title="Trà bán chạy" action={<Link href="/san-pham?sap-xep=ban-chay" style={{ fontSize: 14 }}>Xem thêm</Link>} />
          <TeaGrid products={sellers} />
        </div>
      </section>

      <section aria-labelledby="khach-noi" className="lt-bg-ink">
      <div className="lt-container" style={section}>
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
      </div>
      </section>

      <section aria-labelledby="tra-dam" className="lt-container lt-talk" style={{ ...section, paddingBottom: "clamp(64px,7vw,104px)" }}>
        <header className="lt-talk-head">
          <p className="lt-talk-eyebrow">Trà đàm</p>
          <h2 id="tra-dam">Hiểu trà để thưởng trà</h2>
          <p>Ghé đồi chè, tìm một cách pha vừa vị và giữ trọn hương trà cho những buổi thưởng trà mỗi ngày.</p>
        </header>
        <TalkRail />
        <div className="lt-talk-all">
          <Link href="/tra-dam">Xem tất cả bài Trà đàm</Link>
        </div>
      </section>

      <TeaSprig side="right" />
      <PhotoBand
        id="ve-tan-cuong"
        image="/assets/bg/tea-hills-mist.webp"
        title="Từ đồi chè sương sớm đến chén trà nhà bạn."
        desc="Búp chè Tân Cương hái tay khi còn đọng sương, sao trên chảo gang trong ngày. Lam Trà gửi đi khắp Việt Nam, xác nhận đơn qua Zalo trong 30 phút."
        actions={
          <>
            <Button href="/san-pham" variant="accent" iconRight="arrow-right">Chọn trà</Button>
            <Link href="/cau-chuyen" className="lt-gift-link">Đọc câu chuyện Lam Trà</Link>
          </>
        }
      />
      <HomeClosing />
    </>
  );
}
