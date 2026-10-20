import Link from "next/link";
import { Icon } from "@/components/ds";
import { CATEGORIES } from "@/lib/products";
import { SITE, telLink, zaloLink } from "@/lib/site";

const head = {
  fontSize: 11,
  letterSpacing: ".16em",
  textTransform: "uppercase",
  color: "var(--text-on-inverse-accent)",
  margin: "0 0 14px",
  fontWeight: 600,
} as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--surface-inverse)",
        color: "var(--text-on-inverse)",
        fontFamily: "var(--font-ui)",
        marginTop: "auto",
        borderTop: "1px solid rgba(188, 154, 108, 0.18)",
      }}
    >
      <div className="lt-container" style={{ paddingTop: "56px", paddingBottom: "28px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "36px 28px",
          }}
        >
          {/* Cột 1: Nhận diện thương hiệu Lam Trà */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 220 }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/lam-tra-emblem.svg" alt="Lam Trà Emblem" style={{ height: 42 }} />
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>Lam Trà</span>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "var(--tra-300)",
                    fontWeight: 500,
                  }}
                >
                  Đệ nhất danh trà
                </span>
              </span>
            </Link>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--text-on-inverse-muted)",
                maxWidth: 290,
              }}
            >
              Trọn vị trà Việt, <span style={{ color: "var(--tra-300)" }}>trọn tấm lòng trao gửi.</span> Búp
              chè Tân Cương thu hái sáng sớm, sao tay chảo gang, gửi hương vị thanh tao tới mọi miền.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 4, alignItems: "center" }}>
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

          {/* Cột 2: Sản phẩm */}
          <nav aria-label="Sản phẩm">
            <h2 style={head}>Sản phẩm</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/san-pham" className="lt-foot-link">
                Tất cả trà
              </Link>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/san-pham?danh-muc=${c.slug}`} className="lt-foot-link">
                  {c.name}
                </Link>
              ))}
              <Link href="/chinh-sach#bang-gia" className="lt-foot-link" style={{ color: "var(--tra-300)" }}>
                Bảng giá niêm yết
              </Link>
            </div>
          </nav>

          {/* Cột 3: Thông tin / Chính sách (Đúng theo mẫu yêu cầu) */}
          <nav aria-label="Thông tin và Chính sách">
            <h2 style={head}>Thông tin / Chính sách</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/chinh-sach#bang-gia" className="lt-foot-link">
                Bảng giá trà Tân Cương
              </Link>
              <Link href="/tra-cuu-don" className="lt-foot-link">
                Kiểm tra đơn hàng
              </Link>
              <Link href="/chinh-sach#giao-hang-doi-tra" className="lt-foot-link">
                Giao hàng và đổi trả
              </Link>
              <Link href="/chinh-sach#mua-hang-thanh-toan" className="lt-foot-link">
                Mua hàng &amp; Thanh toán
              </Link>
              <Link href="/chinh-sach#uu-dai" className="lt-foot-link">
                Ưu đãi &amp; Tích điểm
              </Link>
              <Link href="/chinh-sach#bao-mat" className="lt-foot-link">
                Chính sách bảo mật thông tin
              </Link>
              <Link href="/chinh-sach#dieu-khoan" className="lt-foot-link">
                Điều khoản sử dụng website
              </Link>
            </div>
          </nav>

          {/* Cột 4: Hỗ trợ & Trải nghiệm */}
          <nav aria-label="Hỗ trợ & Trải nghiệm">
            <h2 style={head}>Hỗ trợ &amp; Trải nghiệm</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/cau-chuyen" className="lt-foot-link">
                Câu chuyện Lam Trà
              </Link>
              <Link href="/qua-bieu" className="lt-foot-link">
                Quà biếu &amp; Doanh nghiệp
              </Link>
              <Link href="/tra-dam" className="lt-foot-link">
                Trà đàm &amp; Tin tức
              </Link>
              <Link href="/hoi-dap" className="lt-foot-link">
                Hỏi đáp thường gặp
              </Link>
              <Link href="/lien-he" className="lt-foot-link">
                Liên hệ &amp; Góp ý
              </Link>
            </div>
          </nav>

          {/* Cột 5: Xưởng trà & Liên hệ */}
          <div>
            <h2 style={head}>Xưởng trà Tân Cương</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 14,
                color: "var(--text-on-inverse-muted)",
              }}
            >
              <span style={{ display: "flex", gap: 10 }}>
                <Icon name="map-pin" size={18} color="var(--tra-300)" />
                {SITE.address}
              </span>
              <a
                href={telLink()}
                className="lt-foot-link"
                style={{ display: "flex", gap: 10, lineHeight: 1.4 }}
              >
                <Icon name="phone" size={18} color="var(--tra-300)" />
                Hotline: {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="lt-foot-link"
                style={{ display: "flex", gap: 10, lineHeight: 1.4 }}
              >
                <Icon name="mail" size={18} color="var(--tra-300)" />
                {SITE.email}
              </a>
              <span style={{ display: "flex", gap: 10 }}>
                <Icon name="clock" size={18} color="var(--tra-300)" />
                {SITE.hours}
              </span>
            </div>
          </div>
        </div>

        {/* Thanh chân trang (Sub-footer) */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginTop: 44,
            paddingTop: 22,
            borderTop: "1px solid rgba(188,154,108,.22)",
            fontSize: 12,
            color: "var(--text-on-inverse-muted)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 5, maxWidth: 660, lineHeight: 1.6 }}>
            <span>
              © {year} {SITE.legal.company} · Mã số thuế {SITE.legal.taxCode}
            </span>
            <span>{SITE.legal.license}</span>
            <span style={{ display: "flex", flexWrap: "wrap", gap: "0 14px", marginTop: 2 }}>
              <Link href="/chinh-sach#bang-gia" className="lt-foot-link" style={{ fontSize: 12 }}>
                Bảng giá
              </Link>
              <Link href="/tra-cuu-don" className="lt-foot-link" style={{ fontSize: 12 }}>
                Kiểm tra đơn
              </Link>
              <Link href="/chinh-sach#giao-hang-doi-tra" className="lt-foot-link" style={{ fontSize: 12 }}>
                Giao hàng &amp; Đổi trả
              </Link>
              <Link href="/chinh-sach#mua-hang-thanh-toan" className="lt-foot-link" style={{ fontSize: 12 }}>
                Mua hàng &amp; Thanh toán
              </Link>
              <Link href="/chinh-sach#uu-dai" className="lt-foot-link" style={{ fontSize: 12 }}>
                Ưu đãi
              </Link>
              <Link href="/chinh-sach#bao-mat" className="lt-foot-link" style={{ fontSize: 12 }}>
                Bảo mật thông tin
              </Link>
              <Link href="/chinh-sach#dieu-khoan" className="lt-foot-link" style={{ fontSize: 12 }}>
                Điều khoản
              </Link>
              <Link href="/quan-tri" className="lt-foot-link" style={{ fontSize: 12, opacity: 0.75 }}>
                ⚙️ Quản trị
              </Link>
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
            <span>Thanh toán VietQR · COD · Đóng gói giấy dó &amp; Giao hàng toàn quốc</span>
            {SITE.legal.moitUrl ? (
              <a
                href={SITE.legal.moitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="lt-foot-link"
                style={{
                  fontSize: 12,
                  padding: "4px 10px",
                  border: "1px solid rgba(188,154,108,.4)",
                  borderRadius: 4,
                }}
              >
                Đã thông báo Bộ Công Thương
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
