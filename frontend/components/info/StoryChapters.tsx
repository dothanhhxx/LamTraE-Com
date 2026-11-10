import type { ReactNode } from "react";
import { Button, Icon } from "@/components/ds";
import { JOURNEY_PHOTOS as J, type Figure } from "@/lib/posts";

export const JOURNEY: { title: string; text: string; img?: Figure }[] = [
  { title: "Vùng trồng", img: J.vungTrong, text: "Tân Cương, vùng đất trồng và chế biến chè lâu đời, cho trà hương thơm tự nhiên, vị chát dịu và hậu ngọt." },
  { title: "Thu hái", img: J.thuHai, text: "Khi búp đạt độ non thích hợp, người làm chè chọn hái từng búp để giữ độ tươi." },
  { title: "Chế biến", img: J.cheBien, text: "Làm héo, diệt men, vò và sấy khô. Nhiệt độ, thời gian và tay nghề quyết định màu nước, hương vị." },
  { title: "Đóng gói", img: J.rotTra, text: "Đóng kín tránh ẩm, ánh sáng và mùi lạ; bao bì ghi rõ vùng trồng, phân hạng và cách pha." },
  { title: "Thưởng trà", img: J.thuongTra, text: "Lá trà khô được đánh thức bằng nước nóng, gắn với những lúc sum họp và tiếp bạn." },
];

export const LEAF_TO_CUP = [
  { src: "/assets/journey/hai-bup.webp", label: "Búp trà tươi" },
  { src: J.voChe.src, label: "Sao, vò thành trà khô" },
  { src: J.rotTra.src, label: "Chén trà thơm" },
];

/** Một chương của câu chuyện: số thứ tự lớn, tiêu đề hai tông màu, nội dung và ảnh đặt so le. */
export function Chapter({
  no,
  eyebrow,
  title,
  accent,
  media,
  reverse,
  tone,
  children,
  id,
}: {
  no: string;
  eyebrow: string;
  title: string;
  accent: string;
  media: ReactNode;
  reverse?: boolean;
  tone?: "veil" | "plain";
  children: ReactNode;
  id: string;
}) {
  return (
    <section aria-labelledby={id} className={`lt-chapter${tone === "veil" ? " lt-chapter-veil" : ""}`}>
      <span className="lt-chapter-water" aria-hidden="true">{no}</span>
      <div className={`lt-container lt-chapter-grid${reverse ? " lt-chapter-reverse" : ""}`}>
        <div className="lt-chapter-text">
          <div className="lt-chapter-kicker">
            <span className="lt-chapter-no">{no}</span>
            <span className="lt-chapter-eyebrow">{eyebrow}</span>
            <span className="lt-chapter-rule" aria-hidden="true" />
          </div>
          <h2 id={id} className="lt-chapter-title">
            {title} <span>{accent}</span>
          </h2>
          {children}
        </div>
        <div className="lt-chapter-media">{media}</div>
      </div>
    </section>
  );
}

export function Framed({
  src,
  alt,
  caption,
  ratio = "4 / 3",
  sprig,
}: {
  src: string;
  alt: string;
  caption?: string;
  ratio?: string;
  sprig?: boolean;
}) {
  return (
    <figure className="lt-framed">
      <span className="lt-framed-photo" style={{ aspectRatio: ratio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </span>
      {caption && <figcaption>{caption}</figcaption>}
      {sprig && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="lt-framed-sprig" src="/assets/bg/tea-sprig.webp" alt="" aria-hidden="true" width={661} height={1000} loading="lazy" />
      )}
    </figure>
  );
}

/** 4 chương cốt lõi của Câu chuyện Lam Trà hiển thị mở đầu Trang chủ và Trang Câu chuyện. */
export function CoreStoryChapters({ showFullLink = false }: { showFullLink?: boolean }) {
  return (
    <>
      <Chapter
        id="khoi-nguon"
        no="01"
        eyebrow="Khởi nguồn"
        title="Bắt đầu từ"
        accent="một ấm trà."
        media={<Framed src="/assets/photos/hero.jpg" alt="Rót trà nóng từ ấm men lam" caption="Ấm trà mỗi sáng của gia đình Lam Trà" ratio="4 / 4.6" />}
      >
        <p className="lt-chapter-lead">
          Lam Trà bắt đầu từ một ấm trà mỗi sáng ở Tân Cương, nơi những đồi chè chạy dài bên hồ Núi Cốc và sương sớm còn đọng trên búp non.
        </p>
        <p>
          Gia đình chúng tôi làm chè đã ba thế hệ. Trước đây, trà được bán cho khách quen, cho người dưới xuôi lên mua làm quà, rồi qua Facebook, TikTok. Càng bán, chúng tôi càng nhận ra: người mua trà cần biết rõ hơn mình đang mua gì. Bao nhiêu gam, hạng nào, hái lúc nào, pha ra sao.
        </p>
        <p>
          Lam Trà ra đời để trả lời những câu hỏi đó. Mỗi gói trà ghi rõ khối lượng và phân hạng, mỗi loại trà có hướng dẫn pha riêng, và lời nhắn của bạn được viết tay khi gửi trà làm quà.
        </p>
      </Chapter>

      <Chapter
        id="vung-dat"
        no="02"
        eyebrow="Vùng đất"
        title="Vì sao là"
        accent="Tân Cương?"
        reverse
        tone="veil"
        media={<Framed src="/assets/bg/tea-hill-thai-nguyen.webp" alt="Đồi chè Tân Cương, Thái Nguyên" caption="Đồi chè Tân Cương, Thái Nguyên" ratio="16 / 11" sprig />}
      >
        <p>
          Đất Tân Cương pha cát, khí hậu có sương mù buổi sớm và chênh lệch ngày đêm lớn. Cây chè lớn chậm, búp nhỏ, tích được nhiều vị ngọt.
        </p>
        <p>Đó là lý do trà Tân Cương có hương cốm non và hậu ngọt sâu mà ít vùng nào có được.</p>
        <blockquote className="lt-chapter-quote">
          “Sương sớm, đất cát và đôi tay người làm chè: ba thứ làm nên hậu ngọt của trà Tân Cương.”
        </blockquote>
      </Chapter>

      <Chapter
        id="hanh-trinh"
        no="03"
        eyebrow="Hành trình"
        title="Từ búp non đến"
        accent="một chén trà."
        media={
          <ol className="lt-leafcup" aria-label="Từ búp trà đến chén trà">
            {LEAF_TO_CUP.map((s, i) => (
              <li key={s.label}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt="" loading="lazy" decoding="async" />
                <span>{s.label}</span>
                {i < LEAF_TO_CUP.length - 1 && (
                  <span className="lt-leafcup-arrow" aria-hidden="true">
                    <Icon name="chevron-right" size={22} />
                  </span>
                )}
              </li>
            ))}
          </ol>
        }
      >
        <p>
          Búp chè được hái khi còn đọng sương, rồi qua làm héo, diệt men, vò và sao trên chảo gang. Mỗi công đoạn giữ lại một phần hương đất và tay nghề người làm trà.
        </p>
        <Button href="/tra-dam/hanh-trinh-tu-doi-che-den-tach-tra" variant="secondary" iconRight="arrow-right">
          Đọc trọn hành trình
        </Button>
      </Chapter>

      <section aria-label="Năm công đoạn" className="lt-chapter lt-chapter-steps">
        <div className="lt-container">
          <ol className="lt-steps">
            {JOURNEY.map((s, i) => (
              <li key={s.title}>
                {s.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.img.src} alt={s.img.alt} loading="lazy" decoding="async" />
                )}
                <span className="lt-steps-no">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Chapter
        id="cai-ten"
        no="04"
        eyebrow="Cái tên"
        title="Vì sao gọi là"
        accent="Lam Trà?"
        reverse
        tone="veil"
        media={<Framed src="/assets/photos/moccau.jpg" alt="Trà Móc Câu khô bên ấm và chén trà" caption="Trọn vị trà Việt, trọn tấm lòng trao gửi" ratio="4 / 4.4" />}
      >
        <p>
          “Lam” là màu xanh của đồi chè lúc sương tan, cũng là chữ “làm” bớt đi một dấu: làm trà bằng tay, bằng thời gian và bằng sự tỉ mỉ.
        </p>
        <blockquote className="lt-chapter-quote">“Trọn vị trà Việt, trọn tấm lòng trao gửi.”</blockquote>
        <p>Câu chúng tôi vẫn nói với nhau mỗi khi đóng một hộp trà gửi đi.</p>
        {showFullLink && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
            <Button href="/cau-chuyen" variant="secondary" iconRight="arrow-right">
              Xem trọn câu chuyện &amp; Chứng nhận
            </Button>
            <Button href="/chung-nhan" variant="ghost" iconLeft="shield-check">
              Hồ sơ chứng nhận VietGAP
            </Button>
          </div>
        )}
      </Chapter>
    </>
  );
}

