import { Icon } from "@/components/ds";
import { SITE, telLink } from "@/lib/site";

export function VisitTeaRegionSection() {
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=T%C3%A2n+C%C6%B0%C6%A1ng%2C+Th%C3%A1i+Nguy%C3%AAn%2C+Vi%E1%BB%87t+Nam";

  return (
    <section
      aria-labelledby="ghe-tham-title"
      style={{
        paddingTop: "clamp(16px, 2.5vw, 28px)",
        paddingBottom: "clamp(48px, 6vw, 80px)",
      }}
    >
      <div className="lt-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
            gap: "clamp(20px, 3.5vw, 36px)",
            alignItems: "stretch",
          }}
        >
          {/* Left Card: Map Preview with Location Badge & Action */}
          <div
            style={{
              background: "#FAF8F5",
              border: "1.5px solid rgba(188, 154, 108, 0.25)",
              borderRadius: 20,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              boxShadow: "0 8px 24px -6px rgba(36, 52, 31, 0.08)",
            }}
          >
            {/* Map Frame / Iframe Preview */}
            <div style={{ position: "relative", height: "clamp(180px, 28vw, 240px)", width: "100%", background: "#E8EFE8" }}>
              <iframe
                title="Bản đồ Tân Cương, Thái Nguyên"
                src="https://maps.google.com/maps?q=T%C3%A2n+C%C6%B0%C6%A1ng%2C+Th%C3%A1i+Nguy%C3%AAn&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "contrast(0.95) saturate(0.9)" }}
                loading="lazy"
              />

              {/* Location Badge Overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(6px)",
                  padding: "8px 12px",
                  borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  maxWidth: "calc(100% - 20px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon name="map-pin" size={15} color="#4A5E3A" />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#163020" }}>
                    Tân Cương, Thái Nguyên
                  </span>
                </div>

                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: "#FFFFFF",
                    background: "#2463EB",
                    padding: "4px 8px",
                    borderRadius: 5,
                    textDecoration: "none",
                  }}
                >
                  <Icon name="external-link" size={11} />
                  Mở Maps
                </a>
              </div>
            </div>

            {/* Bottom info strip of map card */}
            <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#163020" }}>
                Địa chỉ xưởng & Vườn trà Lam Trà
              </span>
              <span style={{ fontSize: 12.5, color: "#74684F", lineHeight: 1.5 }}>
                {SITE.address} · Cách trung tâm TP. Thái Nguyên ~12km. Đường nhựa thuận tiện cả xe máy và ô tô.
              </span>
            </div>
          </div>

          {/* Right Card: "GHÉ THĂM VÙNG TRÀ" */}
          <div
            style={{
              background: "#FAF8F5",
              border: "1.5px solid rgba(188, 154, 108, 0.25)",
              borderRadius: 20,
              padding: "clamp(20px, 3.2vw, 32px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 8px 24px -6px rgba(36, 52, 31, 0.08)",
            }}
          >
            <div>
              <h2
                id="ghe-tham-title"
                style={{
                  margin: 0,
                  fontSize: "clamp(20px, 2.6vw, 26px)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  color: "#163020",
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  lineHeight: 1.25,
                }}
              >
                Ghé thăm vùng trà
              </h2>

              <div
                style={{
                  width: 50,
                  height: 3,
                  background: "#BC9A6C",
                  borderRadius: 2,
                  margin: "10px 0 14px",
                }}
              />

              <p style={{ margin: "0 0 14px", fontSize: 14.5, lineHeight: 1.65, color: "#39332A" }}>
                Đến với đồi chè Tân Cương, bạn sẽ được tận mắt ngắm nhìn những nương chè xanh mướt, tự tay hái búp chè sớm mai và thưởng thức chén trà mới sao ấm nóng cùng các nghệ nhân lão làng.
              </p>

              {/* Dàn ngang 3 badge thông tin thay vì gộp dọc */}
              <div className="lt-visit-badges-grid">
                <div className="lt-visit-badge">
                  <Icon name="clock" size={15} color="#BC9A6C" />
                  <span><strong>8:00 – 18:00</strong> đón khách</span>
                </div>
                <div className="lt-visit-badge">
                  <Icon name="leaf" size={15} color="#BC9A6C" />
                  <span><strong>Thưởng trà</strong> &amp; thăm vườn</span>
                </div>
                <a
                  href={telLink()}
                  className="lt-visit-badge"
                  style={{ textDecoration: "none", color: "#163020" }}
                >
                  <Icon name="phone" size={15} color="#BC9A6C" />
                  <span><strong>Hẹn trước:</strong> {SITE.phone}</span>
                </a>
              </div>
            </div>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(188, 154, 108, 0.2)" }}>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 18px",
                  borderRadius: 8,
                  background: "#163020",
                  color: "#FDEDD8",
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "background 0.2s ease",
                }}
              >
                <span>Xem đường đi trên Google Maps</span>
                <Icon name="arrow-right" size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
