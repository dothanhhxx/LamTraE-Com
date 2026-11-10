import Link from "next/link";
import { Icon } from "@/components/ds";

/** Câu chuyện Lam Trà ở Trang chủ: ảnh đồi chè trong khung vàng xếp lệch, bên cạnh là tiêu đề hai tông màu. */
export default function StoryBox() {
  return (
    <section id="khoi-nguon" className="lt-origin" aria-labelledby="origin-title">
      <div className="lt-container lt-origin-grid">
        <figure className="lt-origin-photo">
          <span className="lt-origin-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/bg/tea-hill-thai-nguyen.webp" alt="Người hái chè trên đồi chè Tân Cương, Thái Nguyên" width={1440} height={810} loading="lazy" decoding="async" />
          </span>
          <figcaption>Tân Cương · Thái Nguyên</figcaption>
        </figure>

        <div className="lt-origin-text">
          <p className="lt-origin-eyebrow">Câu chuyện</p>
          <h2 id="origin-title">
            Vùng đất Tân Cương
            <span>và ba thế hệ làm chè</span>
          </h2>
          <p>
            Nằm bên hồ Núi Cốc, Tân Cương có đất pha cát, sương mù buổi sớm và chênh lệch ngày đêm lớn. Cây chè lớn chậm, búp nhỏ, tích được nhiều vị ngọt, cho trà hương cốm non và hậu ngọt sâu.
          </p>
          <p>
            Gia đình chúng tôi làm chè đã ba thế hệ. Búp chè hái khi còn đọng sương, sao tay trên chảo gang, và mỗi gói trà Lam Trà ghi rõ khối lượng, phân hạng cùng cách pha.
          </p>
          <p className="lt-origin-sign">Lam Trà – Trọn vị trà Việt, trọn tấm lòng trao gửi.</p>
          <Link href="/cau-chuyen" className="lt-follow-btn">
            Khám phá câu chuyện
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
