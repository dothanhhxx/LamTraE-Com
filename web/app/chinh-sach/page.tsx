import type { Metadata } from "next";
import { formatVND } from "@/lib/format";
import { PageHeader } from "@/components/shell/PageHeader";
import { EXPRESS_FEE, FREE_SHIP_MIN, GIFT_WRAP_FEE, GIFT_WRAP_FREE_MIN, SHIPPING_DAYS, SHIPPING_FEE } from "@/lib/checkout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chính sách vận chuyển, đổi trả và bảo mật",
  description: "Phí giao hàng theo vùng, đổi trả trong 7 ngày, thanh toán VietQR/COD, chính sách bảo mật và điều khoản mua hàng tại Lam Trà.",
};

const TOC = [
  { id: "van-chuyen", label: "Vận chuyển" },
  { id: "doi-tra", label: "Đổi trả và hoàn tiền" },
  { id: "thanh-toan", label: "Thanh toán" },
  { id: "bao-mat", label: "Bảo mật thông tin" },
  { id: "dieu-khoan", label: "Điều khoản mua hàng" },
];

const REGIONS: [keyof typeof SHIPPING_FEE, string][] = [
  ["noi-tinh", "Thái Nguyên"],
  ["bac", "Các tỉnh miền Bắc"],
  ["trung", "Miền Trung, Tây Nguyên"],
  ["nam", "Miền Nam"],
];

export default function PolicyPage() {
  return (
    <>
      <PageHeader title="Chính sách" crumbs={[{ label: "Chính sách" }]} desc="Những điều Lam Trà cam kết khi bạn mua trà, viết ngắn gọn và rõ ràng." />
      <div className="lt-container" style={{ paddingTop: 24, paddingBottom: 80, display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-start" }}>
        <nav aria-label="Mục lục" style={{ flex: "0 0 220px", position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          {TOC.map((t) => (
            <a key={t.id} href={`#${t.id}`} style={{ padding: "6px 0", color: "var(--text-body)", textDecoration: "none" }}>{t.label}</a>
          ))}
        </nav>

        <div className="lt-prose" style={{ flex: "1 1 480px", margin: 0 }}>
          <section id="van-chuyen">
            <h2>Vận chuyển</h2>
            <p>Lam Trà gửi hàng từ Tân Cương, Thái Nguyên đi 34 tỉnh, thành. Đơn đặt trước 15:00 được đóng gói trong ngày.</p>
            <table>
              <thead>
                <tr><th>Khu vực</th><th>Phí</th><th>Thời gian</th></tr>
              </thead>
              <tbody>
                {REGIONS.map(([k, label]) => (
                  <tr key={k}><td>{label}</td><td>{formatVND(SHIPPING_FEE[k])}</td><td>{SHIPPING_DAYS[k]}</td></tr>
                ))}
              </tbody>
            </table>
            <ul>
              <li>Miễn phí vận chuyển cho đơn từ {formatVND(FREE_SHIP_MIN)}.</li>
              <li>Giao nhanh: thêm {formatVND(EXPRESS_FEE)}, sớm hơn khoảng một ngày.</li>
              <li>Gói quà kèm thiệp viết tay: {formatVND(GIFT_WRAP_FEE)}, miễn phí cho đơn từ {formatVND(GIFT_WRAP_FREE_MIN)}.</li>
              <li>Đơn quà có thể giao tới người nhận khác và không kèm hóa đơn trong gói hàng.</li>
            </ul>
          </section>

          <section id="doi-tra">
            <h2>Đổi trả và hoàn tiền</h2>
            <p>Bạn được đổi sản phẩm mới hoặc hoàn tiền trong <strong>7 ngày</strong> kể từ khi nhận hàng nếu:</p>
            <ul>
              <li>Túi trà bị hở, ẩm, mốc hoặc có mùi lạ.</li>
              <li>Giao sai loại trà, sai khối lượng hoặc phân hạng.</li>
              <li>Hộp quà bị móp, vỡ trong lúc vận chuyển.</li>
            </ul>
            <p>Bạn chụp ảnh gói hàng và nhắn Zalo {SITE.phone}. Lam Trà chịu toàn bộ phí gửi lại. Tiền hoàn về tài khoản của bạn trong 1 – 3 ngày làm việc.</p>
            <p>Với gói trà đầu tiên, nếu bạn không hợp vị, Lam Trà hoàn tiền khi gói còn trên một nửa. Trà đã mở không đổi được vì lý do vệ sinh, trừ trường hợp lỗi kể trên.</p>
          </section>

          <section id="thanh-toan">
            <h2>Thanh toán</h2>
            <ul>
              <li><strong>Chuyển khoản ngân hàng:</strong> quét mã QR hiện ngay ở bước đặt hàng, ghi mã đơn vào nội dung chuyển khoản. Lam Trà đối soát và xác nhận đơn trong vòng {SITE.confirmWithin}. Tài khoản nhận: {SITE.bank.bankName} · {SITE.bank.account} · {SITE.bank.holder}.</li>
              <li><strong>Thanh toán khi nhận hàng (COD):</strong> trả tiền mặt cho người giao hàng.</li>
            </ul>
            <p>Lam Trà không bao giờ hỏi mật khẩu, mã OTP ngân hàng của bạn.</p>
          </section>

          <section id="bao-mat">
            <h2>Bảo mật thông tin</h2>
            <p>Lam Trà chỉ thu thập những thông tin cần để giao hàng và chăm sóc bạn: họ tên, số điện thoại, email (nếu có), địa chỉ nhận hàng và lời nhắn trên thiệp.</p>
            <ul>
              <li>Thông tin được dùng để xác nhận đơn, giao hàng, gửi cập nhật đơn và trả lời câu hỏi của bạn.</li>
              <li>Lam Trà chỉ chia sẻ tên, số điện thoại và địa chỉ người nhận cho đơn vị vận chuyển để giao hàng. Không bán, không cho thuê dữ liệu.</li>
              <li>Giỏ hàng, trà yêu thích và sổ địa chỉ được lưu ngay trên trình duyệt của bạn. Bạn có thể xóa bất cứ lúc nào bằng cách xóa dữ liệu trang web.</li>
              <li>Bạn có quyền yêu cầu xem, sửa hoặc xóa thông tin của mình bằng cách nhắn Zalo hoặc email {SITE.email}.</li>
              <li>Website có thể dùng công cụ đo lường (Google Analytics, Meta Pixel, TikTok Pixel) để hiểu cách khách dùng trang, không thu thập thông tin thanh toán.</li>
            </ul>
          </section>

          <section id="dieu-khoan">
            <h2>Điều khoản mua hàng</h2>
            <ul>
              <li>Giá niêm yết đã gồm thuế, chưa gồm phí vận chuyển và gói quà (nếu có), hiển thị rõ trước khi bạn đặt.</li>
              <li>Đơn hàng được xác lập khi Lam Trà xác nhận qua Zalo, điện thoại hoặc email. Lam Trà có thể hủy đơn khi hết hàng và hoàn lại toàn bộ tiền đã chuyển.</li>
              <li>Mã giảm giá không cộng dồn, mỗi đơn dùng một mã.</li>
              <li>Mọi khiếu nại, bạn liên hệ {SITE.phone} hoặc {SITE.email}. Lam Trà phản hồi trong 24 giờ.</li>
            </ul>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {SITE.legal.company} · MST {SITE.legal.taxCode} · {SITE.legal.license} · {SITE.address}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
