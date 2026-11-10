import type { Metadata } from "next";
import Link from "next/link";
import { Button, Icon } from "@/components/ds";
import { Chapter, CoreStoryChapters, Framed } from "@/components/info/StoryChapters";
import { Breadcrumbs } from "@/components/shell/PageHeader";
import { STORY_PHOTOS as S } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Câu chuyện Lam Trà",
  description: "Lam Trà bắt đầu từ những đồi chè Tân Cương, Thái Nguyên: hái tay sáng sớm, sao chảo gang, gửi trà đi khắp Việt Nam.",
  openGraph: { images: ["/assets/bg/tea-hills-mist.webp"] },
};

const VALUES = [
  { icon: "leaf", title: "Hái tay, sao tay", text: "Búp chè được hái vào sáng sớm khi còn sương, sao trên chảo gang theo cách các nhà chè Tân Cương vẫn làm." },
  { icon: "scale", title: "Nói rõ từng gói", text: "Mỗi gói ghi khối lượng, phân hạng, vùng trồng và ngày đóng gói. Bạn biết mình đang uống gì." },
  { icon: "gift", title: "Trao tay tử tế", text: "Lời nhắn của bạn được viết tay lên thiệp. Hộp quà được gói như khi chính Lam Trà mang biếu." },
];

export default function StoryPage() {
  return (
    <>
      {/* Mở đầu: dải ảnh đồi chè sương mù toàn chiều rộng */}
      <section className="lt-story-open" aria-labelledby="cau-chuyen-title">
        <div className="lt-container lt-story-open-inner">
          <Breadcrumbs crumbs={[{ label: "Câu chuyện" }]} />
          <span className="lt-story-open-eyebrow">Tân Cương · Thái Nguyên</span>
          <h1 id="cau-chuyen-title">
            Câu chuyện <span>Lam Trà</span>
          </h1>
          <p>Từ một ấm trà mỗi sáng bên đồi chè Tân Cương, đến món quà trao tay khắp mọi miền.</p>
          <a href="#khoi-nguon" className="lt-story-open-down" aria-label="Đọc câu chuyện">
            <Icon name="chevron-down" size={20} />
          </a>
        </div>
      </section>

      <CoreStoryChapters />

      <Chapter
        id="bo-suu-tap"
        no="05"
        eyebrow="Bộ sưu tập"
        title="Bốn dòng trà,"
        accent="bốn sắc thái."
        media={<Framed src={S.boSuuTap.src} alt={S.boSuuTap.alt} ratio="3 / 2" />}
      >
        <p>Vị thanh khiết, hậu ngọt sâu của Trà Đinh; hương dịu nhẹ của Trà Nõn Tôm; nét thanh tao của Trà Nhài; vị đậm đà của Trà Móc Câu.</p>
        <p>Dù bạn thích trà thanh nhẹ hay đậm đà, Lam Trà luôn có một lựa chọn cho khoảnh khắc thưởng trà của bạn.</p>
        <Button href="/san-pham" variant="secondary" iconRight="arrow-right">Xem các loại trà</Button>
      </Chapter>

      <Chapter
        id="nguon-goc"
        no="06"
        eyebrow="Minh bạch"
        title="Nguồn gốc rõ,"
        accent="an tâm chất lượng."
        reverse
        tone="veil"
        media={
          <a href={S.chungNhan.src} target="_blank" rel="noopener" aria-label="Mở ảnh giấy chứng nhận cỡ lớn" className="lt-framed-link">
            <Framed src={S.chungNhan.src} alt={S.chungNhan.alt} caption="Hồ sơ của Hợp tác xã Chè Thanh Huyền Trà" ratio="1254 / 1104" />
          </a>
        }
      >
        <p>Lam Trà hợp tác cùng <strong>Hợp tác xã Chè Thanh Huyền Trà</strong> (Thái Nguyên), đơn vị chế biến và kinh doanh chè có Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm do Phòng Kinh tế thành phố Thái Nguyên cấp.</p>
        <ul className="lt-chapter-list">
          <li><Icon name="circle-check" size={18} />Chứng nhận cơ sở đủ điều kiện an toàn thực phẩm</li>
          <li><Icon name="circle-check" size={18} />Chứng nhận VietGAP cho chè búp tươi</li>
          <li><Icon name="circle-check" size={18} />Chứng nhận đăng ký hợp tác xã</li>
        </ul>
        <Button href="/chung-nhan" variant="secondary" iconRight="arrow-right">Xem hồ sơ chứng nhận</Button>
      </Chapter>

      <section aria-labelledby="gia-tri" className="lt-bg-ink">
        <div className="lt-container" style={{ paddingTop: "clamp(48px,6vw,80px)", paddingBottom: "clamp(48px,6vw,80px)" }}>
          <h2 id="gia-tri" style={{ margin: "0 0 28px", fontSize: "clamp(22px,2.2vw,28px)", lineHeight: 1.25, fontWeight: 500, color: "var(--text-strong)" }}>Điều Lam Trà giữ trong từng gói trà</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 16 }}>
            {VALUES.map((v) => (
              <div key={v.title} style={{ padding: 24, border: "1px solid var(--border-hairline)", borderRadius: 6, background: "var(--surface-card)", display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid var(--border-strong)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={v.icon} size={20} />
                </span>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 500, color: "var(--text-strong)" }}>{v.title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-body)" }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kết: dải ảnh sáng, chữ căn giữa */}
      <section aria-labelledby="ket" className="lt-story-close">
        <div className="lt-container">
          <span className="lt-story-open-eyebrow">Từ câu chuyện đến hương vị</span>
          <h2 id="ket">
            Và câu chuyện
            <br />
            <span>tiếp tục trong từng chén trà.</span>
          </h2>
          <div className="lt-story-close-actions">
            <Button href="/san-pham" variant="accent" iconRight="arrow-right">Khám phá sản phẩm</Button>
            <Link href="/tra-dam" className="lt-story-close-link">Đọc Trà đàm</Link>
          </div>
        </div>
      </section>
    </>
  );
}
