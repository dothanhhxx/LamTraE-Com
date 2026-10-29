import type { Metadata } from "next";
import Link from "next/link";
import { Button, Icon } from "@/components/ds";
import { PageHeader } from "@/components/shell/PageHeader";
import { PhotoBand, TeaSprig } from "@/components/shell/PhotoBand";
import { JOURNEY_PHOTOS as J, type Figure } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Câu chuyện Lam Trà",
  description: "Lam Trà bắt đầu từ những đồi chè Tân Cương, Thái Nguyên: hái tay sáng sớm, sao chảo gang, gửi trà đi khắp Việt Nam.",
  openGraph: { images: ["/assets/photos/hero.jpg"] },
};

const VALUES = [
  { icon: "leaf", title: "Hái tay, sao tay", text: "Búp chè được hái vào sáng sớm khi còn sương, sao trên chảo gang theo cách các nhà chè Tân Cương vẫn làm." },
  { icon: "scale", title: "Nói rõ từng gói", text: "Mỗi gói ghi khối lượng, phân hạng, vùng trồng và ngày đóng gói. Bạn biết mình đang uống gì." },
  { icon: "gift", title: "Trao tay tử tế", text: "Lời nhắn của bạn được viết tay lên thiệp. Hộp quà được gói như khi chính Lam Trà mang biếu." },
];

const JOURNEY: { title: string; text: string; img?: Figure }[] = [
  { title: "Vùng trồng", img: J.vungTrong, text: "Hành trình bắt đầu ở Tân Cương, vùng đất trồng và chế biến chè lâu đời. Điều kiện tự nhiên cùng kinh nghiệm canh tác qua nhiều thế hệ cho trà hương thơm tự nhiên, vị chát dịu và hậu ngọt đặc trưng." },
  { title: "Thu hái", img: J.thuHai, text: "Khi búp chè đạt độ non thích hợp, người làm chè chọn hái từng búp để giữ độ tươi. Sự khéo léo trong từng thao tác giữ lại hương vị tự nhiên của lá chè." },
  { title: "Chế biến", img: J.cheBien, text: "Búp chè qua làm héo, diệt men, vò và sấy khô tùy từng loại trà. Nhiệt độ, thời gian và tay nghề quyết định màu nước, hương thơm và vị trà." },
  { title: "Đóng gói", text: "Trà được đóng gói kín để tránh ẩm, ánh sáng và mùi lạ. Bao bì ghi rõ vùng trồng, phân hạng, cách pha, và mang câu chuyện văn hóa trà Việt đến tay bạn." },
  { title: "Thưởng trà", img: J.thuongTra, text: "Lá trà khô được đánh thức bằng nước nóng, hương thơm lan tỏa, sắc nước hiện ra. Chén trà gắn với những lúc sum họp gia đình, tiếp bạn hay nghỉ tay sau một ngày làm việc." },
];

export default function StoryPage() {
  return (
    <>
      <PageHeader title="Câu chuyện Lam Trà" eyebrow="Tân Cương · Thái Nguyên" crumbs={[{ label: "Câu chuyện" }]} />
      <div className="lt-container" style={{ paddingTop: 24, paddingBottom: "clamp(56px,8vw,96px)" }}>
        <div className="lt-story-hero" style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: "var(--surface-photo)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/photos/hero.jpg" alt="Đồi chè Tân Cương lúc sáng sớm" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* TODO: nội dung mẫu, chủ shop thay bằng câu chuyện thật (số thế hệ làm chè, ý nghĩa tên Lam Trà). */}
        <div className="lt-prose" style={{ margin: "48px auto 0" }}>
          <p className="lt-lead">Lam Trà bắt đầu từ một ấm trà mỗi sáng ở Tân Cương, nơi những đồi chè chạy dài bên hồ Núi Cốc và sương sớm còn đọng trên búp non.</p>
          <p>Gia đình chúng tôi làm chè đã ba thế hệ. Trước đây, trà được bán cho khách quen, cho người dưới xuôi lên mua làm quà, rồi qua Facebook, TikTok. Càng bán, chúng tôi càng nhận ra: người mua trà cần biết rõ hơn mình đang mua gì. Bao nhiêu gam, hạng nào, hái lúc nào, pha ra sao.</p>
          <p>Lam Trà ra đời để trả lời những câu hỏi đó. Mỗi gói trà ghi rõ khối lượng và phân hạng. Mỗi loại trà có hướng dẫn pha riêng. Và khi bạn gửi trà làm quà, lời nhắn của bạn được viết tay, hộp được gói cẩn thận như khi chính chúng tôi mang biếu.</p>
          <h2>Vì sao là Tân Cương?</h2>
          <p>Đất Tân Cương pha cát, khí hậu có sương mù buổi sớm và chênh lệch ngày đêm lớn. Cây chè lớn chậm, búp nhỏ, tích được nhiều vị ngọt. Đó là lý do trà Tân Cương có hương cốm non và hậu ngọt sâu mà ít vùng nào có được.</p>
          <h2>Cái tên Lam Trà</h2>
          <p>“Lam” là màu xanh của đồi chè lúc sương tan, cũng là chữ “làm” bớt đi một dấu: làm trà bằng tay, bằng thời gian và bằng sự tỉ mỉ. Câu chúng tôi vẫn nói với nhau: trọn vị trà Việt, trọn tấm lòng trao gửi.</p>
        </div>

        <section aria-labelledby="hanh-trinh" style={{ maxWidth: "var(--reading-max)", margin: "clamp(56px,8vw,88px) auto 0" }}>
          <span style={{ fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--accent)" }}>Năm công đoạn</span>
          <h2 id="hanh-trinh" style={{ margin: "8px 0 32px", fontSize: "clamp(24px,2.6vw,32px)", lineHeight: 1.25, fontWeight: 500, color: "var(--text-strong)" }}>Hành trình từ đồi chè đến chén trà</h2>
          <ol className="lt-journey">
            {JOURNEY.map((s, i) => (
              <li key={s.title} className="lt-journey-step">
                <span className="lt-journey-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="lt-journey-body">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {s.img && <img src={s.img.src} alt={s.img.alt} width={s.img.w} height={s.img.h} loading="lazy" decoding="async" />}
                </div>
              </li>
            ))}
          </ol>
          <div style={{ marginTop: 32 }}>
            <Button href="/tra-dam/hanh-trinh-tu-doi-che-den-tach-tra" variant="secondary" iconRight="arrow-right">Đọc trọn hành trình</Button>
          </div>
        </section>
      </div>

      <TeaSprig side="right" />
      <section aria-labelledby="gia-tri" className="lt-bg-ink">
        <div className="lt-container" style={{ paddingTop: "clamp(56px,8vw,96px)", paddingBottom: "clamp(56px,8vw,96px)" }}>
        <h2 id="gia-tri" style={{ margin: "0 0 28px", fontSize: "clamp(24px,2.6vw,32px)", lineHeight: 1.25, fontWeight: 500, color: "var(--text-strong)" }}>Điều Lam Trà giữ trong từng gói trà</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
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

      <PhotoBand
        id="moi-tra"
        image="/assets/bg/tea-hill-thai-nguyen.webp"
        title="Mời bạn một ấm trà Tân Cương."
        desc="Chọn loại trà hợp vị, hoặc đọc thêm cách pha và bảo quản trong Trà đàm."
        actions={
          <>
            <Button href="/san-pham" variant="accent" iconRight="arrow-right">Xem các loại trà</Button>
            <Link href="/tra-dam" className="lt-gift-link">Đọc Trà đàm</Link>
          </>
        }
      />
    </>
  );
}
