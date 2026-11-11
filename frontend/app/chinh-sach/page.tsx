import type { Metadata } from "next";
import Link from "next/link";
import { Button, Icon } from "@/components/ds";
import { PageHeader } from "@/components/shell/PageHeader";
import { PolicyToc } from "@/components/info/PolicyToc";
import { formatVND } from "@/lib/format";
import {
  EXPRESS_FEE,
  FREE_SHIP_MIN,
  GIFT_WRAP_FEE,
  GIFT_WRAP_FREE_MIN,
  SHIPPING_DAYS,
  SHIPPING_FEE,
} from "@/lib/checkout";
import { priceOf, variantLabel } from "@/lib/products";
import { SITE, telLink, zaloLink } from "@/lib/site";
import { ProductApiService } from "@/services/products.api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thông tin & Chính sách bán hàng · Lam Trà",
  description:
    "Bảng giá niêm yết trà Tân Cương xuất xưởng, hướng dẫn kiểm tra đơn hàng, giao hàng - đổi trả trong 7 ngày, thanh toán VietQR/COD và chính sách bảo mật thông tin tại Lam Trà.",
};

const TOC = [
  { id: "bang-gia", label: "Bảng giá trà Tân Cương", icon: "file-text" },
  { id: "kiem-tra-don", label: "Kiểm tra đơn hàng", icon: "search" },
  { id: "giao-hang-doi-tra", label: "Giao hàng và đổi trả", icon: "truck" },
  { id: "mua-hang-thanh-toan", label: "Mua hàng & Thanh toán", icon: "credit-card" },
  { id: "uu-dai", label: "Ưu đãi & Khách hàng thân thiết", icon: "gift" },
  { id: "bao-mat", label: "Bảo vệ dữ liệu cá nhân", icon: "shield-check" },
  { id: "dieu-khoan", label: "Điều khoản sử dụng website", icon: "info" },
  { id: "khieu-nai", label: "Giải quyết khiếu nại & tranh chấp", icon: "scale" },
];

const REGIONS: [keyof typeof SHIPPING_FEE, string][] = [
  ["noi-tinh", "Thái Nguyên (Nội tỉnh)"],
  ["bac", "Các tỉnh Miền Bắc & Hà Nội"],
  ["trung", "Miền Trung & Tây Nguyên"],
  ["nam", "TP. Hồ Chí Minh & Miền Nam"],
];

export default async function PolicyPage() {
  const products = await ProductApiService.getAllProducts(false);

  return (
    <>
      <PageHeader
        title="Thông tin & Chính sách"
        eyebrow="Minh bạch & Trọn vẹn niềm tin"
        crumbs={[{ label: "Chính sách & Thông tin" }]}
        desc="Bảng giá niêm yết tại xưởng, quy trình giao hàng, đổi trả linh hoạt trong 7 ngày và cam kết bảo mật tuyệt đối cho mọi khách hàng của Lam Trà."
      />

      <div
        className="lt-container lt-policy-container"
        style={{
          paddingTop: 32,
          paddingBottom: 96,
        }}
      >
        {/* Mục lục chính sách: Tự động dạng Sticky Sidebar trên Desktop và Tab trượt cạnh trái trên Mobile */}
        <PolicyToc items={TOC} />

        {/* Nội dung chi tiết các chính sách */}
        <div className="lt-prose" style={{ flex: "1 1 540px", margin: 0, maxWidth: 840 }}>
          {/* 1. BẢNG GIÁ TRÀ TÂN CƯƠNG */}
          <section id="bang-gia" style={{ scrollMarginTop: 110, marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span
                style={{
                  display: "inline-flex",
                  padding: "4px 8px",
                  background: "var(--tra-100)",
                  color: "var(--tra-800)",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Giá niêm yết xuất xưởng
              </span>
            </div>
            <h2 style={{ marginTop: 0 }}>Bảng Giá Trà Tân Cương (Niêm yết)</h2>
            <p>
              Toàn bộ sản phẩm trà tại Lam Trà được thu hái thủ công tại vùng chè đặc sản Tân Cương (Thái
              Nguyên), sao tay bằng chảo gang truyền thống và đóng gói trực tiếp tại xưởng. Giá niêm yết dưới
              đây đã bao gồm thuế, cam kết chuẩn trọng lượng và không phát sinh chi phí ẩn.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12.5,
                color: "var(--tra-800)",
                background: "rgba(188, 154, 108, 0.12)",
                padding: "6px 12px",
                borderRadius: 6,
                marginBottom: 10,
                width: "fit-content",
              }}
            >
              <span>👆 <em>Gợi ý trên điện thoại: Vuốt ngang bảng để xem đủ các gói 100g, 200g, 500g</em></span>
            </div>

            <div
              style={{
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                background: "var(--surface-card)",
                borderRadius: 8,
                border: "1px solid var(--border-hairline)",
                marginBottom: 20,
              }}
            >
              <table style={{ margin: 0, width: "100%", minWidth: 620, fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "rgba(22, 60, 42, 0.04)" }}>
                    <th style={{ padding: "12px 14px", textAlign: "left" }}>Tên sản phẩm</th>
                    <th style={{ padding: "12px 14px", textAlign: "left" }}>Loại trà &amp; Hương vị</th>
                    <th style={{ padding: "12px 14px", textAlign: "right" }}>Gói 100g</th>
                    <th style={{ padding: "12px 14px", textAlign: "right" }}>Hộp 200g (Premium)</th>
                    <th style={{ padding: "12px 14px", textAlign: "right" }}>Gói 500g (Giá tốt nhất)</th>
                    <th style={{ padding: "12px 14px", textAlign: "center" }}>Xem chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const price100 = p.fixed ? p.base : priceOf(p, "100", "1");
                    const price200 = p.fixed ? null : priceOf(p, "200", "1");
                    const price500 = p.fixed ? null : priceOf(p, "500", "1");

                    return (
                      <tr key={p.slug} style={{ borderTop: "1px solid var(--border-hairline)" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--text-strong)" }}>
                          <Link
                            href={`/san-pham/${p.slug}`}
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            {p.name}
                          </Link>
                          {p.compareAt ? (
                            <span
                              style={{
                                display: "block",
                                fontSize: 11,
                                color: "#b91c1c",
                                fontWeight: 500,
                              }}
                            >
                              Đang ưu đãi
                            </span>
                          ) : null}
                        </td>
                        <td style={{ padding: "12px 14px", color: "var(--text-muted)" }}>
                          <span style={{ fontWeight: 500, color: "var(--text-body)" }}>{p.kind}</span>
                          <span style={{ display: "block", fontSize: 12 }}>{p.note}</span>
                        </td>
                        <td
                          style={{
                            padding: "12px 14px",
                            textAlign: "right",
                            fontWeight: 600,
                            color: "var(--text-strong)",
                          }}
                        >
                          {formatVND(price100)}
                          {p.fixed ? (
                            <span style={{ display: "block", fontSize: 11, color: "var(--text-muted)" }}>
                              (Bộ 3 món)
                            </span>
                          ) : (
                            <span style={{ display: "block", fontSize: 11, color: "var(--text-muted)" }}>
                              Tiêu chuẩn: {formatVND(priceOf(p, "100", "2"))}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", color: "var(--text-body)" }}>
                          {price200 ? (
                            <>
                              <span style={{ fontWeight: 600 }}>{formatVND(price200)}</span>
                              <span
                                style={{
                                  display: "block",
                                  fontSize: 11,
                                  color: "var(--tra-700)",
                                }}
                              >
                                Giá niêm yết
                              </span>
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", color: "var(--text-body)" }}>
                          {price500 ? (
                            <>
                              <span style={{ fontWeight: 600, color: "var(--tra-800)" }}>
                                {formatVND(price500)}
                              </span>
                              <span
                                style={{
                                  display: "block",
                                  fontSize: 11,
                                  color: "var(--tra-700)",
                                }}
                              >
                                Tiết kiệm 8%
                              </span>
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          <Link
                            href={`/san-pham/${p.slug}`}
                            style={{
                              display: "inline-flex",
                              padding: "4px 10px",
                              borderRadius: 4,
                              background: "var(--surface-inverse)",
                              color: "var(--text-on-inverse)",
                              textDecoration: "none",
                              fontSize: 12,
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Đặt mua
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                background: "rgba(188, 154, 108, 0.08)",
                padding: "14px 18px",
                borderRadius: 6,
                borderLeft: "3px solid var(--tra-600)",
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--text-body)",
              }}
            >
              <strong>Lưu ý về quy cách &amp; đóng gói:</strong> Toàn bộ trà được đóng trong túi tráng bạc
              hút chân không 2 lớp giúp giữ nguyên hương cốm và màu nước xanh vàng. Đối với phân hạng 2
              (dành cho uống hằng ngày ấm lớn), giá tiết kiệm hơn 25% so với phân hạng 1.
            </div>
          </section>

          {/* 2. KIỂM TRA ĐƠN HÀNG */}
          <section id="kiem-tra-don" style={{ scrollMarginTop: 110, marginBottom: 56 }}>
            <h2>Kiểm tra &amp; Tra cứu đơn hàng</h2>
            <p>
              Tại Lam Trà, bạn có thể chủ động kiểm tra trạng thái tiến trình đơn hàng của mình bất cứ lúc nào
              ngay trên website mà không cần phải gọi điện chờ đợi.
            </p>

            <div
              style={{
                background: "var(--surface-card)",
                padding: "24px",
                borderRadius: 8,
                border: "1px solid var(--border-hairline)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "var(--tra-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--tra-800)",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="search" size={20} />
                </div>
                <div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600 }}>
                    Cách tra cứu đơn hàng nhanh nhất:
                  </h3>
                  <ol style={{ margin: "0 0 12px", paddingLeft: 18, fontSize: 14, lineHeight: 1.6 }}>
                    <li>
                      Lấy <strong>Mã đơn hàng</strong> (có dạng <code>LTXXXXXX</code> đã hiển thị khi bạn đặt
                      hàng thành công hoặc trong tin nhắn Zalo xác nhận).
                    </li>
                    <li>
                      Nhập mã đơn và <strong>Số điện thoại</strong> của bạn vào cổng tra cứu.
                    </li>
                    <li>
                      Xem ngay trạng thái đơn hàng (Đã đặt hàng → Đã xác nhận / duyệt tiền → Đang vận chuyển
                      → Hoàn thành) và chi tiết các món trà.
                    </li>
                  </ol>
                  <Link
                    href="/tra-cuu-don"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 16px",
                      background: "var(--tra-800)",
                      color: "#fff",
                      borderRadius: 6,
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <Icon name="search" size={16} />
                    Đến trang tra cứu đơn hàng ngay
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 3. GIAO HÀNG VÀ ĐỔI TRẢ */}
          <section
            id="giao-hang-doi-tra"
            style={{ scrollMarginTop: 110, marginBottom: 56 }}
          >
            {/* Hỗ trợ anchor cũ */}
            <span id="van-chuyen" style={{ display: "block", position: "relative", top: -110 }} />
            <span id="doi-tra" style={{ display: "block", position: "relative", top: -110 }} />

            <h2>Giao hàng và đổi trả</h2>

            <h3 style={{ fontSize: 18, marginTop: 24, marginBottom: 12 }}>1. Chính sách giao hàng</h3>
            <p>
              Lam Trà đóng gói và gửi trà trực tiếp từ kho Tân Cương (Thái Nguyên) đi khắp 34 tỉnh, thành trên
              toàn quốc. Mọi đơn hàng đặt trước <strong>15:00</strong> hằng ngày được đóng gói và bàn giao bưu
              cục ngay trong ngày.
            </p>

            <table style={{ width: "100%", fontSize: 13, marginBottom: 18 }}>
              <thead>
                <tr style={{ background: "rgba(22, 60, 42, 0.04)" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left" }}>Khu vực nhận hàng</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Cước phí tiêu chuẩn</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Thời gian giao dự kiến</th>
                </tr>
              </thead>
              <tbody>
                {REGIONS.map(([k, label]) => (
                  <tr key={k} style={{ borderTop: "1px solid var(--border-hairline)" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 500 }}>{label}</td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600 }}>
                      {formatVND(SHIPPING_FEE[k])}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right", color: "var(--text-muted)" }}>
                      {SHIPPING_DAYS[k]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul style={{ lineHeight: 1.7, fontSize: 14 }}>
              <li>
                <strong>Miễn phí vận chuyển:</strong> Áp dụng cho mọi đơn hàng có giá trị từ{" "}
                <span style={{ color: "var(--tra-800)", fontWeight: 600 }}>
                  {formatVND(FREE_SHIP_MIN)}
                </span>
                .
              </li>
              <li>
                <strong>Giao nhanh hỏa tốc:</strong> Phụ thu thêm {formatVND(EXPRESS_FEE)}, ưu tiên kết nối
                chuyến xe bưu kiện sớm nhất để giao nhanh hơn từ 1 – 2 ngày.
              </li>
              <li>
                <strong>Dịch vụ quà biếu &amp; thiệp tay:</strong> Gói hộp quà giấy dó và viết thiệp tay theo
                lời chúc của bạn với phí {formatVND(GIFT_WRAP_FEE)} (hoàn toàn miễn phí cho đơn từ{" "}
                {formatVND(GIFT_WRAP_FREE_MIN)}).
              </li>
              <li>
                <strong>Gửi tặng người thân / đối tác:</strong> Bạn có thể chọn giao thẳng tới địa chỉ người
                nhận và tùy chọn <em>không in hóa đơn giá tiền</em> trong bưu kiện.
              </li>
            </ul>

            <h3 style={{ fontSize: 18, marginTop: 28, marginBottom: 12 }}>
              2. Chính sách kiểm hàng (Đồng kiểm khi nhận hàng)
            </h3>
            <p>
              Nhằm đảm bảo quyền lợi tối đa cho quý khách hàng theo quy định pháp luật thương mại điện tử Việt Nam:
            </p>
            <ul style={{ lineHeight: 1.7, fontSize: 14 }}>
              <li>
                <strong>Quyền đồng kiểm:</strong> Quý khách được quyền mở kiện hàng bên ngoài để kiểm tra số lượng,
                chủng loại sản phẩm và tem niêm phong trước sự chứng kiến của nhân viên giao hàng (bưu tá).
              </li>
              <li>
                <strong>Lưu ý an toàn thực phẩm:</strong> Do trà được đóng gói vô trùng hút chân không để bảo quản
                hương cốm non, quý khách vui lòng không cắt mở túi tráng bạc bên trong trước khi thanh toán nhận hàng.
              </li>
              <li>
                <strong>Trường hợp phát sinh sự cố:</strong> Nếu phát hiện bưu kiện bị biến dạng, rách ướt hoặc thiếu
                món so với đơn đặt, quý khách có quyền từ chối nhận hoặc chụp ảnh biên bản đồng kiểm và liên hệ hotline{" "}
                <strong>{SITE.phone}</strong> để Lam Trà gửi bù ngay lập tức.
              </li>
            </ul>

            <h3 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>
              3. Chính sách đổi trả &amp; hoàn tiền trong 7 ngày
            </h3>
            <p>
              Với tôn chỉ <em>“Trọn vị trà Việt, trọn tấm lòng trao gửi”</em>, Lam Trà cam kết bảo vệ 100%
              quyền lợi của quý trà hữu. Bạn được quyền đổi sang sản phẩm mới hoặc yêu cầu hoàn tiền trong vòng{" "}
              <strong>7 ngày</strong> kể từ khi nhận hàng trong các trường hợp:
            </p>

            <ul style={{ lineHeight: 1.7, fontSize: 14 }}>
              <li>Túi trà bị rách, xì chân không, trà bị ẩm hoặc có mùi lạ khác thường.</li>
              <li>Sản phẩm giao không đúng loại trà, sai khối lượng hoặc sai phân hạng đã đặt.</li>
              <li>Hộp quà biếu bị cấn móp, trầy xước, vỡ nát trong quá trình vận chuyển.</li>
              <li>
                <strong>Đặc biệt:</strong> Với gói trà đầu tiên, nếu bạn pha thử mà cảm thấy chưa hợp khẩu vị
                riêng, Lam Trà sẵn sàng nhận lại và hoàn tiền khi gói còn từ 50% trọng lượng trở lên.
              </li>
            </ul>

            <div
              style={{
                background: "var(--surface-card)",
                padding: "16px 20px",
                borderRadius: 6,
                border: "1px solid var(--border-hairline)",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              <strong>Quy trình đổi trả siêu đơn giản:</strong> Bạn chỉ cần chụp ảnh tình trạng gói hàng và
              nhắn tin qua Zalo số <strong>{SITE.phone}</strong>. Đội ngũ Lam Trà sẽ gửi ngay gói trà mới tới
              tận nhà bạn mà <strong>bạn không phải trả thêm bất kỳ chi phí vận chuyển nào</strong>. Tiền hoàn
              (nếu có) được chuyển khoản lại trong vòng 1 – 2 ngày làm việc.
            </div>
          </section>

          {/* 4. MUA HÀNG & THANH TOÁN */}
          <section
            id="mua-hang-thanh-toan"
            style={{ scrollMarginTop: 110, marginBottom: 56 }}
          >
            {/* Hỗ trợ anchor cũ */}
            <span id="thanh-toan" style={{ display: "block", position: "relative", top: -110 }} />

            <h2>Mua hàng &amp; Thanh toán</h2>

            <h3 style={{ fontSize: 18, marginTop: 24, marginBottom: 12 }}>
              1. Quy trình mua hàng tinh gọn (Không cần đăng ký tài khoản)
            </h3>
            <p>
              Nhằm mang đến trải nghiệm thuận tiện và nhanh chóng nhất, bạn có thể đặt hàng trực tiếp mà không
              bắt buộc phải qua các bước tạo tài khoản hay ghi nhớ mật khẩu rườm rà:
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  padding: "16px",
                  borderRadius: 6,
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--tra-800)", marginBottom: 6 }}>
                  Bước 1: Chọn trà
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Xem thông tin phẩm trà, chọn khối lượng (100g, 200g, 500g) và bấm <em>Thêm vào giỏ</em>.
                </div>
              </div>
              <div
                style={{
                  padding: "16px",
                  borderRadius: 6,
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--tra-800)", marginBottom: 6 }}>
                  Bước 2: Điền thông tin
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Nhập họ tên, số điện thoại và địa chỉ nhận hàng. Tùy chọn viết thiệp nếu là quà tặng.
                </div>
              </div>
              <div
                style={{
                  padding: "16px",
                  borderRadius: 6,
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--tra-800)", marginBottom: 6 }}>
                  Bước 3: Chọn thanh toán
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Chọn quét mã VietQR tự động hoặc thanh toán tiền mặt (COD) khi nhận hàng.
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: 18, marginTop: 28, marginBottom: 12 }}>
              2. Các phương thức thanh toán hỗ trợ
            </h3>
            <ul style={{ lineHeight: 1.7, fontSize: 14 }}>
              <li>
                <strong>Chuyển khoản VietQR tự động (Khuyên dùng):</strong> Sau khi hoàn tất đặt hàng, màn
                hình sẽ hiển thị mã VietQR tiêu chuẩn kèm chính xác số tiền và mã đơn hàng của bạn. Bạn chỉ
                cần mở bất kỳ ứng dụng ngân hàng nào (Vietcombank, MB, Techcombank, BIDV, VPBank,...) hoặc ví
                điện tử để quét mã. Đơn hàng được tự động ghi nhận và xác nhận trong vòng 30 phút.
                <br />
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Thông tin thụ hưởng chính thức: Ngân hàng {SITE.bank.bankName} · STK:{" "}
                  <strong>{SITE.bank.account}</strong> · Chủ tài khoản: <strong>{SITE.bank.holder}</strong>.
                </span>
              </li>
              <li>
                <strong>Thanh toán khi nhận hàng (COD):</strong> Bạn thanh toán tiền mặt trực tiếp cho nhân
                viên giao vận khi bưu tá mang trà đến tận nhà. Được phép kiểm tra bên ngoài kiện hàng trước
                khi thanh toán.
              </li>
            </ul>

            <div
              style={{
                background: "rgba(234, 88, 12, 0.08)",
                padding: "12px 16px",
                borderRadius: 6,
                borderLeft: "3px solid #ea580c",
                fontSize: 13,
                color: "var(--text-strong)",
              }}
            >
              🔒 <strong>Cảnh báo an toàn:</strong> Nhân viên Lam Trà tuyệt đối không bao giờ yêu cầu bạn cung
              cấp mã OTP, mật khẩu Internet Banking hay thông tin thẻ tín dụng cá nhân dưới bất kỳ hình thức
              nào.
            </div>
          </section>

          {/* 5. ƯU ĐÃI & KHÁCH HÀNG THÂN THIẾT */}
          <section id="uu-dai" style={{ scrollMarginTop: 110, marginBottom: 56 }}>
            <h2>Ưu đãi &amp; Khách hàng thân thiết</h2>
            <p>
              Lam Trà luôn tri ân những người yêu trà đã đồng hành cùng thương hiệu. Dưới đây là các chính
              sách ưu đãi đang được áp dụng trực tiếp tại hệ thống:
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  background: "var(--surface-card)",
                  border: "1.5px dashed var(--tra-500)",
                  padding: "18px",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "3px 8px",
                    background: "var(--tra-800)",
                    color: "#fff",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".06em",
                    marginBottom: 8,
                  }}
                >
                  MÃ: LAMTRA10
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Giảm 10% đơn đầu tiên</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Dành riêng cho quý khách lần đầu đặt trà tại Lam Trà để trải nghiệm hương vị Tân Cương sao
                  tay.
                </div>
              </div>

              <div
                style={{
                  background: "var(--surface-card)",
                  border: "1.5px dashed var(--tra-500)",
                  padding: "18px",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "3px 8px",
                    background: "var(--tra-800)",
                    color: "#fff",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".06em",
                    marginBottom: 8,
                  }}
                >
                  MÃ: CHAOBAN50
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Giảm ngay 50.000₫</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Áp dụng cho mọi đơn hàng có giá trị từ 400.000₫ trở lên khi thanh toán trực tuyến.
                </div>
              </div>

              <div
                style={{
                  background: "var(--surface-card)",
                  border: "1.5px dashed var(--tra-500)",
                  padding: "18px",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "3px 8px",
                    background: "var(--tra-800)",
                    color: "#fff",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".06em",
                    marginBottom: 8,
                  }}
                >
                  MÃ: MIENPHISHIP
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Miễn phí vận chuyển</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Freeship toàn quốc cho các đơn hàng từ 250.000₫ trở lên trong các chương trình ưu đãi mùa vụ.
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: 18, marginTop: 24, marginBottom: 12 }}>
              Chính sách chiết khấu quà biếu Doanh Nghiệp
            </h3>
            <p>
              Đối với cơ quan, doanh nghiệp và đoàn thể có nhu cầu đặt hộp quà trà Tân Cương cho dịp Tết,
              Trung Thu, ngày thành lập hoặc sự kiện ngoại giao:
            </p>
            <ul style={{ lineHeight: 1.7, fontSize: 14 }}>
              <li>Chiết khấu bậc thang hấp dẫn từ 10 hộp quà trở lên.</li>
              <li>Hỗ trợ khắc laser logo thương hiệu lên hộp gỗ sơn mài hoặc in thiệp thương hiệu riêng.</li>
              <li>Xuất đầy đủ hóa đơn VAT điện tử hợp lệ theo quy định nhà nước.</li>
            </ul>
            <p>
              Quý doanh nghiệp có thể gửi thông tin nhận báo giá nhanh qua trang{" "}
              <Link href="/lien-he" style={{ fontWeight: 600 }}>
                Liên hệ
              </Link>
              .
            </p>
          </section>

          {/* 6. CHÍNH SÁCH BẢO VỆ DỮ LIỆU CÁ NHÂN */}
          <section id="bao-mat" style={{ scrollMarginTop: 110, marginBottom: 56 }}>
            <h2>Chính sách bảo vệ dữ liệu cá nhân</h2>
            <p>
              Lam Trà cam kết bảo vệ dữ liệu cá nhân của quý khách hàng theo quy định của <strong>Luật Bảo vệ dữ liệu
              cá nhân số 91/2025/QH15</strong>, <strong>Nghị định số 356/2025/NĐ-CP</strong> và các quy định pháp luật
              Việt Nam hiện hành.
            </p>

            <h3 style={{ fontSize: 16, marginTop: 20, marginBottom: 10 }}>1. Mục đích và phạm vi thu thập dữ liệu</h3>
            <p>
              Chúng tôi chỉ thu thập các dữ liệu cá nhân cơ bản thực sự cần thiết nhằm phục vụ xác lập đơn hàng,
              vận chuyển bưu kiện và giải quyết hậu mãi:
            </p>
            <ul style={{ lineHeight: 1.7, fontSize: 14 }}>
              <li><strong>Họ và tên:</strong> Nhận diện người mua hàng và người nhận quà biếu.</li>
              <li><strong>Số điện thoại:</strong> Liên hệ bưu tá giao hàng, gửi mã tra cứu đơn hàng và hỗ trợ kỹ thuật pha trà.</li>
              <li><strong>Địa chỉ nhận hàng:</strong> Phục vụ giao hàng tận nơi qua đơn vị bưu chính ủy quyền.</li>
              <li><strong>Địa chỉ Email (không bắt buộc):</strong> Gửi hóa đơn điện tử hoặc xác nhận đơn hàng khi khách có nhu cầu.</li>
              <li><strong>Ghi chú đơn hàng:</strong> Lời chúc thiệp tay hoặc dặn dò thời gian giao nhận.</li>
            </ul>

            <h3 style={{ fontSize: 16, marginTop: 20, marginBottom: 10 }}>2. Nguyên tắc xử lý &amp; Chia sẻ dữ liệu</h3>
            <ul style={{ lineHeight: 1.7, fontSize: 14 }}>
              <li>
                <strong>Chỉ phục vụ mục đích đã thỏa thuận:</strong> Dữ liệu chỉ được chia sẻ cho đối tác giao vận bưu chính
                (Viettel Post, GHTK, EMS) phục vụ duy nhất công tác giao phát bưu kiện tới địa chỉ của quý khách.
              </li>
              <li>
                <strong>Không mua bán hoặc thương mại hóa dữ liệu:</strong> Lam Trà tuyệt đối không bán, cho thuê hoặc cung cấp
                thông tin khách hàng cho bất kỳ bên thứ ba nào vì mục đích quảng cáo rác, tiếp thị liên kết hay telesale.
              </li>
              <li>
                <strong>Lưu trữ an toàn:</strong> Dữ liệu được mã hóa truyền tải (HTTPS/TLS) và lưu trữ nội bộ tại hệ thống máy chủ
                có phân quyền bảo mật chặt chẽ.
              </li>
            </ul>

            <h3 style={{ fontSize: 16, marginTop: 20, marginBottom: 10 }}>3. Quyền của chủ thể dữ liệu &amp; Thời hạn xử lý</h3>
            <p>
              Căn cứ <strong>Điều 4 Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15</strong> và <strong>Điều 5 Nghị định
              356/2025/NĐ-CP</strong>, quý khách có các quyền hợp pháp sau:
            </p>
            <ul style={{ lineHeight: 1.7, fontSize: 14 }}>
              <li><strong>Quyền được biết &amp; Quyền đồng ý:</strong> Được thông báo minh bạch về việc thu thập và tự nguyện quyết định cung cấp thông tin.</li>
              <li><strong>Quyền xem &amp; chỉnh sửa:</strong> Yêu cầu tra cứu hoặc đính chính dữ liệu cá nhân của mình.</li>
              <li><strong>Quyền yêu cầu xóa hoặc rút lại sự đồng ý:</strong> Quý khách có quyền yêu cầu xóa vĩnh viễn thông tin hoặc rút lại sự đồng ý xử lý dữ liệu.</li>
            </ul>
            <div
              style={{
                background: "rgba(188, 154, 108, 0.08)",
                padding: "14px 18px",
                borderRadius: 6,
                borderLeft: "3px solid var(--tra-600)",
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--text-body)",
                marginTop: 12,
              }}
            >
              <strong>Thời hạn giải quyết yêu cầu:</strong> Khi quý khách gửi yêu cầu qua email <strong>{SITE.email}</strong>{" "}
              hoặc hotline <strong>{SITE.phone}</strong>, Lam Trà sẽ phản hồi hướng dẫn thủ tục trong vòng <strong>02 ngày làm việc</strong>{" "}
              và hoàn tất xử lý yêu cầu xóa/sửa dữ liệu trong vòng <strong>10 – 20 ngày làm việc</strong> theo đúng quy định tại Điều 5 Nghị định 356/2025/NĐ-CP.
            </div>
          </section>

          {/* 7. ĐIỀU KHOẢN SỬ DỤNG WEBSITE */}
          <section id="dieu-khoan" style={{ scrollMarginTop: 110, marginBottom: 56 }}>
            <h2>Điều khoản sử dụng website</h2>
            <p>
              Khi truy cập và đặt hàng trên website Lam Trà (<strong>{SITE.url}</strong>), quý khách xác nhận
              đã đồng ý với các điều khoản giao kết hoạt động sau:
            </p>

            <ul style={{ lineHeight: 1.7, fontSize: 14 }}>
              <li>
                <strong>Xác lập đơn hàng &amp; Giao kết hợp đồng:</strong> Hợp đồng mua bán điện tử được xác lập kể từ thời điểm
                hệ thống gửi xác nhận đơn hàng thành công kèm mã đơn <code>LTXXXXXX</code> qua website, tin nhắn Zalo hoặc cuộc gọi xác nhận.
              </li>
              <li>
                <strong>Chính sách giá &amp; Minh bạch chi phí:</strong> Toàn bộ giá bán hiển thị trên website là giá niêm yết chính thức
                đã bao gồm thuế giá trị gia tăng (VAT). Phí vận chuyển và chi phí dịch vụ đóng gói (nếu có) được hiển thị rõ ràng trước khi quý khách bấm đặt mua.
              </li>
              <li>
                <strong>Trường hợp bất khả kháng &amp; Hủy đơn:</strong> Lam Trà bảo lưu quyền liên hệ trao đổi hủy hoặc đổi ngày giao hàng
                nếu thời tiết sương muối/mưa bão khiến búp chè tươi không đạt tiêu chuẩn sao tay cổ truyền. Mọi khoản thanh toán trước sẽ được hoàn trả 100% trong 24 giờ.
              </li>
              <li>
                <strong>Quyền sở hữu trí tuệ:</strong> Toàn bộ nhãn hiệu, hình ảnh đồi chè, quy trình sao tay và nội dung bài viết Trà đàm
                thuộc quyền sở hữu của Lam Trà và Hợp tác xã đối tác. Nghiêm cấm sao chép cho mục đích thương mại khi chưa có sự chấp thuận bằng văn bản.
              </li>
            </ul>

            <div
              style={{
                marginTop: 28,
                padding: "20px 24px",
                background: "var(--surface-card)",
                borderRadius: 8,
                border: "1px solid var(--border-hairline)",
                fontSize: 13,
                lineHeight: 1.7,
                color: "var(--text-body)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-strong)", marginBottom: 6 }}>
                Thông tin chủ sở hữu &amp; Đơn vị vận hành website:
              </div>
              <div><strong>Tên đơn vị:</strong> {SITE.legal.company}</div>
              <div><strong>Mã số HTX / Mã số thuế:</strong> {SITE.legal.taxCode} do UBND thành phố Thái Nguyên cấp ngày 13/07/2023</div>
              <div><strong>Người đại diện theo pháp luật:</strong> {SITE.legal.representative}</div>
              <div><strong>Địa chỉ cơ sở chế biến:</strong> {SITE.address}</div>
              <div><strong>Hotline / Zalo:</strong> {SITE.phone} · <strong>Email:</strong> {SITE.email}</div>
              <div><strong>Tiêu chuẩn chất lượng:</strong> Chứng nhận VietGAP số DVCL-VG-TT-24-19-22 · Giấy chứng nhận ATTP số 19/2023/NNPTNT-TNg</div>
            </div>
          </section>

          {/* 8. CƠ CHẾ TIẾP NHẬN & GIẢI QUYẾT KHIẾU NẠI */}
          <section id="khieu-nai" style={{ scrollMarginTop: 110, marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span
                style={{
                  display: "inline-flex",
                  padding: "4px 8px",
                  background: "var(--tra-100)",
                  color: "var(--tra-800)",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Quy định Điều 31 Luật BVQLNTD
              </span>
            </div>
            <h2>Cơ chế tiếp nhận &amp; Giải quyết khiếu nại, tranh chấp</h2>
            <p>
              Căn cứ <strong>Điều 31 Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15</strong> và{" "}
              <strong>Điều 11 Luật Thương mại điện tử số 122/2025/QH15</strong>, Lam Trà cam kết tiếp nhận và giải quyết
              mọi phản hồi, khiếu nại của khách hàng theo quy trình 3 bước rõ ràng:
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  padding: "18px",
                  borderRadius: 8,
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--tra-800)", marginBottom: 6 }}>
                  Bước 1: Tiếp nhận phản ánh
                </div>
                <div style={{ fontSize: 13, color: "var(--text-body)", lineHeight: 1.6 }}>
                  Khách hàng gửi khiếu nại qua Hotline/Zalo <strong>{SITE.phone}</strong> hoặc email{" "}
                  <strong>{SITE.email}</strong>, cung cấp mã đơn hàng <code>LTXXXXXX</code> cùng hình ảnh/video phản ánh tình trạng sản phẩm.
                </div>
              </div>

              <div
                style={{
                  padding: "18px",
                  borderRadius: 8,
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--tra-800)", marginBottom: 6 }}>
                  Bước 2: Xác minh &amp; Phản hồi
                </div>
                <div style={{ fontSize: 13, color: "var(--text-body)", lineHeight: 1.6 }}>
                  Lam Trà có trách nhiệm thông báo đã tiếp nhận và đưa ra phương án xử lý thỏa đáng cho quý khách trong thời hạn{" "}
                  <strong>tối đa 03 ngày làm việc</strong> kể từ thời điểm nhận đủ thông tin.
                </div>
              </div>

              <div
                style={{
                  padding: "18px",
                  borderRadius: 8,
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--tra-800)", marginBottom: 6 }}>
                  Bước 3: Giải quyết &amp; Đền bù
                </div>
                <div style={{ fontSize: 13, color: "var(--text-body)", lineHeight: 1.6 }}>
                  Đổi ngay sản phẩm mới giao tận tay hoặc hoàn tiền 100% qua tài khoản ngân hàng trong vòng 24 – 48 giờ làm việc.
                  Toàn bộ chi phí vận chuyển phát sinh do Lam Trà chi trả 100%.
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.65 }}>
              Lam Trà luôn ưu tiên giải quyết khiếu nại trên tinh thần thương lượng, hòa giải và lắng nghe người thưởng trà.
              Trong trường hợp không thể thống nhất qua hòa giải, tranh chấp sẽ được đưa ra cơ quan Nhà nước có thẩm quyền hoặc
              Tòa án nhân dân có thẩm quyền tại tỉnh Thái Nguyên để giải quyết theo đúng quy định pháp luật Việt Nam.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
