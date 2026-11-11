import { Icon } from "@/components/ds";
import { SITE, telLink, zaloLink } from "@/lib/site";
import { ConsultationForm } from "./ConsultationForm";

const HIGHLIGHT_POINTS = [
  {
    title: "Tư vấn chọn dòng trà",
    desc: "Móc Câu, Nõn Tôm, Đinh Sen",
  },
  {
    title: "Cách pha & bảo quản",
    desc: "Chuẩn nhiệt, trọn hương cốm non",
  },
  {
    title: "Đặt hàng & Quà biếu",
    desc: "Set quà Tết, chiết khấu doanh nghiệp",
  },
  {
    title: "Góp ý & Đề xuất hợp tác",
    desc: "Đại lý phân phối & cùng trà lan tỏa",
  },
];

export function ContactHeroSection() {
  return (
    <section aria-labelledby="gui-loi-nhan-title" className="lt-contact-section">
      <div className="lt-container">
        <div className="lt-contact-grid">
          {/* Left Column: Heading, accent line, description, 2x2 Feature tiles, 2x2 Quick channels */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Section Heading */}
            <h1
              id="gui-loi-nhan-title"
              style={{
                margin: 0,
                fontSize: "clamp(24px, 3.2vw, 36px)",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                color: "#163020",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                textTransform: "uppercase",
              }}
            >
              Gửi lời nhắn cho Lam Trà
            </h1>

            {/* Golden accent bar */}
            <div
              style={{
                width: 60,
                height: 3,
                background: "#BC9A6C",
                borderRadius: 2,
                margin: "12px 0 16px",
              }}
            />

            {/* Description */}
            <p
              style={{
                margin: "0 0 18px",
                fontSize: "clamp(14px, 1.6vw, 15.5px)",
                lineHeight: 1.6,
                color: "#39332A",
                maxWidth: 540,
              }}
            >
              Bạn có thể để lại thông tin để được tư vấn chọn trà, tìm hiểu cách pha, trao đổi nhu cầu đặt hàng hoặc hợp tác. Lam Trà luôn sẵn sàng lắng nghe và cùng bạn tìm hương trà phù hợp.
            </p>

            {/* 4 Feature Points - Dàn ngang dạng lưới 2x2 compact */}
            <ul className="lt-contact-features-grid">
              {HIGHLIGHT_POINTS.map((item, idx) => (
                <li key={idx} className="lt-contact-feature-card">
                  {/* Custom gold circled checkmark icon */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: "1.6px solid #BC9A6C",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#BC9A6C",
                      marginTop: 1,
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#163020",
                        lineHeight: 1.3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: 11.5,
                        color: "#74684F",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* 4 Quick Channels - Dàn ngang 2 cột trên mobile, 4 cột trên desktop */}
            <div style={{ marginTop: 18 }}>
              <div className="lt-contact-channels-grid">
                <a
                  href={zaloLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lt-contact-channel-btn"
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "rgba(188, 154, 108, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#BC9A6C",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="zalo" size={16} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, color: "#74684F" }}>Zalo chat</div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {SITE.phone}
                    </div>
                  </div>
                </a>

                <a
                  href={telLink()}
                  className="lt-contact-channel-btn"
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "rgba(188, 154, 108, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#BC9A6C",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="phone" size={15} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, color: "#74684F" }}>Hotline</div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {SITE.phone}
                    </div>
                  </div>
                </a>

                <a
                  href={`mailto:${SITE.email}`}
                  className="lt-contact-channel-btn"
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "rgba(188, 154, 108, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#BC9A6C",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="mail" size={15} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, color: "#74684F" }}>Hòm thư</div>
                    <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {SITE.email}
                    </div>
                  </div>
                </a>

                <div className="lt-contact-channel-btn" style={{ cursor: "default" }}>
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "rgba(188, 154, 108, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#BC9A6C",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="clock" size={15} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, color: "#74684F" }}>Mở cửa</div>
                    <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      8:00 – 21:00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dark Forest Green Consultation Card */}
          <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
            <ConsultationForm />
          </div>
        </div>
      </div>
    </section>
  );
}
