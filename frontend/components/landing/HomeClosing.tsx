import { Icon } from "@/components/ds";
import { SITE, zaloLink } from "@/lib/site";

const SERVICES = [
  { icon: "truck", title: "Giao hàng toàn quốc", text: "Lam Trà gửi trà đi khắp Việt Nam, từ đồi chè Tân Cương đến tận tay bạn." },
  { icon: "package", title: "Đóng gói cẩn thận", text: "Đóng kín tránh ẩm, ánh sáng và mùi lạ, giữ trà khô và thơm suốt đường đi." },
  { icon: "qr-code", title: "VietQR hoặc COD", text: "Quét mã VietQR để chuyển khoản nhanh, hoặc trả tiền mặt khi nhận trà." },
  { icon: "message-circle", title: "Tư vấn qua Zalo", text: `Xác nhận đơn trong ${SITE.confirmWithin}, trả lời từ ${SITE.hours.split(" · ")[0]} mỗi ngày.` },
];

/** Hai phần cuối Trang chủ: theo dõi Lam Trà trên mạng xã hội và cam kết vận chuyển, hỗ trợ. */
export default function HomeClosing() {
  return (
    <>
      <section aria-labelledby="viet-tiep" className="lt-follow">
        <div className="lt-container lt-follow-grid">
          <div className="lt-follow-text">
            <h2 id="viet-tiep">
              Câu chuyện về trà
              <span>vẫn đang được viết tiếp</span>
            </h2>
            <p>
              Theo dõi hành trình từ những nương chè Tân Cương, câu chuyện người làm trà đến những khoảnh khắc thưởng trà cùng Lam Trà.
            </p>
            <div className="lt-follow-actions">
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="lt-follow-btn">
                <Icon name="facebook" size={18} />
                <span>Theo dõi Lam Trà trên Fanpage Facebook</span>
                <Icon name="external-link" size={16} />
              </a>
            </div>
          </div>
          <figure className="lt-follow-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/journey/binh-minh.webp" alt="Bình minh trên đồi chè Tân Cương, chén trà nóng và đôi tay hái búp chè" width={526} height={262} loading="lazy" decoding="async" />
          </figure>
        </div>
      </section>

      <section aria-labelledby="dat-tra-de-dang" className="lt-service">
        <div className="lt-container">
          <div className="lt-service-grid">
            <div className="lt-service-head">
              <p className="lt-service-eyebrow">Vận chuyển &amp; hỗ trợ</p>
              <h2 id="dat-tra-de-dang">Đặt trà dễ dàng</h2>
            </div>
            <ul className="lt-service-list">
              {SERVICES.map((s) => (
                <li key={s.title}>
                  <Icon name={s.icon} size={28} />
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="lt-service-note">
            <span className="lt-service-note-icon" aria-hidden="true">
              <Icon name="message-circle" size={16} />
            </span>
            <span className="lt-service-note-text">
              Bạn đang tìm trà cho mình hay một món quà?{" "}
              <a href={zaloLink()} target="_blank" rel="noopener noreferrer" className="lt-service-note-link">
                Nhắn Zalo để Lam Trà cùng chọn nhé <Icon name="arrow-right" size={13} />
              </a>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
