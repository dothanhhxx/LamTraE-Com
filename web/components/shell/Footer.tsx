import Link from "next/link";
import { Icon } from "@/components/ds";
import { CATEGORIES } from "@/lib/products";
import { SITE } from "@/lib/site";

const head = { fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--text-on-inverse-accent)", margin: "0 0 12px", fontWeight: 500 } as const;

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "var(--surface-inverse)", color: "var(--text-on-inverse)", fontFamily: "var(--font-ui)", marginTop: "auto" }}>
      <div className="lt-container" style={{ padding: "56px 0 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 36 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, gridColumn: "span 1", minWidth: 220 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/lam-tra-emblem.svg" alt="" style={{ height: 40 }} />
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                <span style={{ fontSize: 18, fontWeight: 500 }}>Lam Trà</span>
                <span style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--tra-300)" }}>Tea &amp; beyond</span>
              </span>
            </Link>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-on-inverse-muted)", maxWidth: 280 }}>
              Trọn vị trà Việt, <span style={{ color: "var(--tra-300)" }}>trọn tấm lòng trao gửi.</span> Trà Tân Cương hái tay, sao chảo gang, gửi đi khắp Việt Nam.
            </p>
          </div>

          <nav aria-label="Sản phẩm">
            <h2 style={head}>Sản phẩm</h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Link href="/san-pham" className="lt-foot-link">Tất cả trà</Link>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/san-pham?danh-muc=${c.slug}`} className="lt-foot-link">{c.name}</Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Hỗ trợ">
            <h2 style={head}>Hỗ trợ</h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Link href="/cau-chuyen" className="lt-foot-link">Câu chuyện Lam Trà</Link>
              <Link href="/chinh-sach" className="lt-foot-link">Vận chuyển &amp; đổi trả</Link>
              <Link href="/lien-he" className="lt-foot-link">Liên hệ</Link>
              <Link href="/tai-khoan" className="lt-foot-link">Tra cứu đơn hàng</Link>
            </div>
          </nav>

          <div>
            <h2 style={head}>Liên hệ</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--text-on-inverse-muted)" }}>
              <span style={{ display: "flex", gap: 10 }}><Icon name="map-pin" size={18} color="var(--tra-300)" />{SITE.address}</span>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="lt-foot-link" style={{ display: "flex", gap: 10, lineHeight: 1.4 }}><Icon name="phone" size={18} color="var(--tra-300)" />{SITE.phone}</a>
              <span style={{ display: "flex", gap: 10 }}><Icon name="clock" size={18} color="var(--tra-300)" />{SITE.hours}</span>
              <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="lt-foot-link" style={{ display: "flex", gap: 6, alignItems: "center" }}><Icon name="facebook" size={18} />Facebook</a>
                <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer" className="lt-foot-link">TikTok</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, marginTop: 44, paddingTop: 20, borderTop: "1px solid rgba(188,154,108,.25)", fontSize: 12, color: "var(--text-on-inverse-muted)" }}>
          <span>© {year} Lam Trà · Tân Cương, Thái Nguyên</span>
          <span>Thanh toán VietQR · COD · Giao hàng toàn quốc</span>
        </div>
      </div>
    </footer>
  );
}
