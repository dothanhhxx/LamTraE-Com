import Link from "next/link";
import { Icon } from "@/components/ds";
import { CATEGORIES } from "@/lib/products";
import { SITE, telLink, zaloLink } from "@/lib/site";

const head = { fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--text-on-inverse-accent)", margin: "0 0 12px", fontWeight: 500 } as const;

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "var(--surface-inverse)", color: "var(--text-on-inverse)", fontFamily: "var(--font-ui)", marginTop: "auto" }}>
      <div className="lt-container" style={{ paddingTop: "56px", paddingBottom: "28px" }}>
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
            <div style={{ display: "flex", gap: 12, marginTop: 4, alignItems: "center" }}>
              <a
                href={SITE.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="lt-social-btn"
                aria-label="TikTok Lam Trà"
                title="TikTok"
              >
                <Icon name="tiktok" size={18} />
              </a>
              <a
                href={zaloLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="lt-social-btn"
                aria-label="Zalo Lam Trà"
                title="Zalo"
              >
                <Icon name="zalo" size={20} />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="lt-social-btn"
                aria-label="Gửi email cho Lam Trà"
                title="Email"
              >
                <Icon name="mail" size={18} />
              </a>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="lt-social-btn"
                aria-label="Facebook Lam Trà"
                title="Facebook"
              >
                <Icon name="facebook" size={18} />
              </a>
            </div>
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
              <Link href="/qua-bieu" className="lt-foot-link">Quà biếu &amp; doanh nghiệp</Link>
              <Link href="/tra-dam" className="lt-foot-link">Trà đàm</Link>
              <Link href="/hoi-dap" className="lt-foot-link">Hỏi đáp</Link>
              <Link href="/tra-cuu-don" className="lt-foot-link">Tra cứu đơn hàng</Link>
              <Link href="/lien-he" className="lt-foot-link">Liên hệ</Link>
            </div>
          </nav>

          <div>
            <h2 style={head}>Liên hệ</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--text-on-inverse-muted)" }}>
              <span style={{ display: "flex", gap: 10 }}><Icon name="map-pin" size={18} color="var(--tra-300)" />{SITE.address}</span>
              <a href={telLink()} className="lt-foot-link" style={{ display: "flex", gap: 10, lineHeight: 1.4 }}><Icon name="phone" size={18} color="var(--tra-300)" />{SITE.phone}</a>
              <a href={`mailto:${SITE.email}`} className="lt-foot-link" style={{ display: "flex", gap: 10, lineHeight: 1.4 }}><Icon name="mail" size={18} color="var(--tra-300)" />{SITE.email}</a>
              <span style={{ display: "flex", gap: 10 }}><Icon name="clock" size={18} color="var(--tra-300)" />{SITE.hours}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, marginTop: 44, paddingTop: 20, borderTop: "1px solid rgba(188,154,108,.25)", fontSize: 12, color: "var(--text-on-inverse-muted)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 640, lineHeight: 1.6 }}>
            <span>© {year} {SITE.legal.company} · MST {SITE.legal.taxCode}</span>
            <span>{SITE.legal.license}</span>
            <span>{SITE.address} · {SITE.email}</span>
            <span style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
              <Link href="/chinh-sach#van-chuyen" className="lt-foot-link" style={{ fontSize: 12 }}>Vận chuyển</Link>
              <Link href="/chinh-sach#doi-tra" className="lt-foot-link" style={{ fontSize: 12 }}>Đổi trả</Link>
              <Link href="/chinh-sach#bao-mat" className="lt-foot-link" style={{ fontSize: 12 }}>Bảo mật</Link>
              <Link href="/chinh-sach#dieu-khoan" className="lt-foot-link" style={{ fontSize: 12 }}>Điều khoản</Link>
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <span>Thanh toán VietQR · COD · Giao hàng toàn quốc</span>
            {/* Sau khi Bộ Công Thương duyệt, đặt SITE.legal.moitUrl và thay khung chữ bằng logo chính thức từ online.gov.vn */}
            {SITE.legal.moitUrl ? (
              <a href={SITE.legal.moitUrl} target="_blank" rel="noopener noreferrer" className="lt-foot-link" style={{ fontSize: 12, padding: "4px 10px", border: "1px solid rgba(188,154,108,.4)", borderRadius: 4 }}>Đã thông báo Bộ Công Thương</a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
