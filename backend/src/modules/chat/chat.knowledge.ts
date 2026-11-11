// Kho tri thức cho Trợ lý Lam Trà.
// - FAQ: 15 câu gốc (Bộ câu hỏi Chatbot Lam Trà) + các câu bổ sung dựa trên dữ liệu thật của hệ thống.
// - Phí ship, mã giảm giá, hệ số giá đọc thẳng từ shared/checkout.ts nên đổi ở đó là bot tự cập nhật.
// - Danh mục sản phẩm (giá, tồn kho) lấy trực tiếp từ ProductService ở mỗi lượt hỏi.
import {
  COUPONS,
  EXPRESS_FEE,
  FREE_SHIP_MIN,
  GIFT_WRAP_FEE,
  GIFT_WRAP_FREE_MIN,
  GRADE_FACTOR,
  SHIPPING_FEE,
  SIZE_FACTOR,
  formatVND,
  priceOf,
  stockOf,
} from "../../shared/checkout.js";
import type { Product } from "../../shared/types/product.types.js";

/** Thông tin cửa hàng: giữ khớp với frontend/lib/site.ts */
export const STORE = {
  name: "Lam Trà",
  address: "Xã Tân Cương, tỉnh Thái Nguyên",
  phone: "0949 992 493",
  zalo: "https://zalo.me/0949992493",
  email: "Lamtra.tea@gmail.com",
  hours: "8:00 – 21:00, Thứ 2 – Chủ nhật",
  confirmWithin: "30 phút",
};

export type Faq = { q: string; a: string; keys?: string[] };

const couponLines = Object.entries(COUPONS)
  .map(([code, c]) => `${code}: ${c.label}`)
  .join("; ");

export const FAQS: Faq[] = [
  // ---------- 15 câu gốc ----------
  {
    q: "Trà Tân Cương Thái Nguyên là gì?",
    a: "Trà Tân Cương là loại trà xanh truyền thống nổi tiếng của vùng Tân Cương, tỉnh Thái Nguyên. Trà được chế biến từ những búp chè tươi, có hương thơm tự nhiên, vị chát nhẹ và hậu ngọt đặc trưng.",
    keys: ["tan cuong", "la gi"],
  },
  {
    q: "Tại sao trà Tân Cương Thái Nguyên lại nổi tiếng?",
    a: "Trà Tân Cương nổi tiếng nhờ khí hậu, thổ nhưỡng phù hợp với cây chè và kỹ thuật chế biến truyền thống. Trà có hương thơm đặc trưng, vị chát dịu và hậu ngọt kéo dài, được nhiều người yêu trà Việt Nam ưa chuộng.",
    keys: ["noi tieng", "tai sao"],
  },
  {
    q: "Trà Tân Cương có hương vị đặc trưng như thế nào?",
    a: "Trà Tân Cương thường có hương thơm tự nhiên gợi nhớ cốm non, vị chát nhẹ ban đầu và hậu ngọt thanh sau khi uống. Pha đúng cách, nước trà có màu vàng xanh trong, hương vị hài hòa, dễ thưởng thức.",
    keys: ["huong vi", "dac trung", "vi"],
  },
  {
    q: "Trà Tân Cương khác gì so với các loại trà xanh thông thường?",
    a: "Trà Tân Cương nổi bật với hương cốm đặc trưng, vị chát dịu và hậu ngọt sâu, nhờ vùng trồng, giống chè và cách chế biến. Hương vị cụ thể còn phụ thuộc vào chất lượng từng loại trà.",
    keys: ["khac", "thong thuong", "so sanh"],
  },
  {
    q: "Trà Đinh, trà Nõn Tôm và trà Móc Câu khác nhau như thế nào?",
    a: "Trà Đinh làm từ phần búp nhỏ nhất, chất lượng và giá cao nhất. Trà Nõn Tôm hái một tôm một lá, hương thanh, vị đậm đà. Trà Móc Câu có cánh cong như móc câu, hương cốm, chát dịu, hợp uống hằng ngày.",
    keys: ["dinh", "non tom", "moc cau", "khac nhau"],
  },
  {
    q: "Làm thế nào để nhận biết trà Tân Cương chất lượng tốt?",
    a: "Trà tốt có cánh khô tương đối đồng đều, ít vụn, hương tự nhiên, không mùi lạ. Khi pha, nước trong, thơm dễ chịu, chát hài hòa và có hậu ngọt. Nên chọn sản phẩm có nguồn gốc rõ ràng; Lam Trà có hồ sơ lô trà và chứng nhận tại trang /chung-nhan.",
    keys: ["nhan biet", "chat luong", "that gia", "tot"],
  },
  {
    q: "Người mới bắt đầu uống trà nên chọn loại nào?",
    a: "Người mới nên bắt đầu với Trà Móc Câu (dễ uống, giá mềm) hoặc Trà Nõn Tôm (tinh tế hơn). Pha lượng vừa phải để làm quen. Nếu thích hương hoa, Trà Nhài cũng rất dễ uống.",
    keys: ["moi bat dau", "nguoi moi", "chon loai", "tu van"],
  },
  {
    q: "Cách pha trà Tân Cương để giữ được hương vị?",
    a: "Dùng khoảng 5g trà cho 150–200ml nước 80–85°C. Tráng ấm bằng nước nóng, cho trà vào, tráng trà nhanh rồi hãm 20–60 giây tùy khẩu vị. Không ngâm quá lâu vì nước sẽ chát. Mỗi sản phẩm có hướng dẫn pha riêng trên trang sản phẩm.",
    keys: ["cach pha", "pha tra", "huong dan pha"],
  },
  {
    q: "Nên dùng nước bao nhiêu độ để pha trà Tân Cương?",
    a: "Khoảng 80–85°C. Nước quá nóng làm trà ra nhiều chất chát. Trà búp non như Nõn Tôm, Đinh Thượng Hạng hợp 75–80°C; trà thảo mộc thì cần 90–95°C.",
    keys: ["nhiet do", "bao nhieu do", "nuoc soi"],
  },
  {
    q: "Tại sao trà pha bị đắng hoặc chát?",
    a: "Thường do cho quá nhiều trà, nước quá nóng hoặc hãm quá lâu. Bạn giảm lượng trà, dùng nước 80–85°C và rút ngắn thời gian hãm là sẽ dịu hơn.",
    keys: ["dang", "chat qua", "bi chat"],
  },
  {
    q: "Bảo quản trà thế nào để không mất hương?",
    a: "Để trà trong túi zip hoặc hũ kín, ép hết không khí sau mỗi lần dùng, đặt nơi khô mát, tránh nắng và độ ẩm. Không để gần đồ có mùi mạnh như cà phê, gia vị vì trà rất dễ hút mùi. Gói lớn nên chia ra hũ nhỏ.",
    keys: ["bao quan", "mat huong", "giu"],
  },
  {
    q: "Trà để được bao lâu?",
    a: "Hạn dùng 12 tháng kể từ ngày đóng gói (in trên túi); kẹo trong hộp quà là 6 tháng. Trà ngon nhất trong 6 tháng đầu, riêng trà sen nên dùng sớm. Sau khi mở, đậy kín và dùng sớm.",
    keys: ["han dung", "bao lau", "het han"],
  },
  {
    q: "Uống trà Tân Cương mỗi ngày có tốt không?",
    a: "Trà xanh chứa chất chống oxy hóa tự nhiên như polyphenol, catechin; uống lượng vừa phải có thể là một phần của chế độ ăn lành mạnh. Trà có caffeine nên người nhạy cảm cần hạn chế trà đậm, nhất là buổi tối.",
    keys: ["moi ngay", "suc khoe", "tot khong"],
  },
  {
    q: "Trà Tân Cương có hợp làm quà biếu không?",
    a: "Rất hợp. Trà mang nét văn hóa truyền thống, phù hợp tặng người thân, đối tác dịp lễ, Tết. Lam Trà có Hộp quà Trao Gửi gói sẵn, kèm thiệp viết tay, và Trà Đinh Sen, Đinh Thượng Hạng cho dịp trang trọng.",
    keys: ["qua bieu", "qua tang", "bieu", "tang"],
  },
  {
    q: "Trà Tân Cương có ý nghĩa gì trong văn hóa thưởng trà của người Việt?",
    a: "Chén trà không chỉ là thức uống mà còn thể hiện sự hiếu khách, lòng kính trọng và sự gắn kết. Thưởng trà là dịp để thư giãn, trò chuyện và gìn giữ giá trị truyền thống. Bạn có thể đọc thêm ở mục Trà đàm (/tra-dam).",
    keys: ["van hoa", "y nghia", "thuong tra"],
  },

  // ---------- Bổ sung từ dữ liệu hệ thống ----------
  {
    q: "Giá trà tính thế nào? Có những gói nào?",
    a: `Mỗi loại trà có hộp 200g (bản Premium, là giá niêm yết), gói 100g và gói 500g, cùng 2 phẩm: Premium và Tiêu chuẩn. Gói 100g bằng ${SIZE_FACTOR["100"]} lần, 500g bằng ${SIZE_FACTOR["500"]} lần giá hộp 200g (500g rẻ hơn tính theo gam). Tiêu chuẩn bằng ${GRADE_FACTOR["2"] * 100}% giá Premium. Hộp quà Trao Gửi có giá cố định.`,
    keys: ["gia", "bao nhieu tien", "goi", "100g", "200g", "500g", "premium"],
  },
  {
    q: "Premium và Tiêu chuẩn khác nhau thế nào?",
    a: "Cùng một loại trà, sau khi sao được chia phẩm. Premium cánh nhỏ, đều, hương đậm, đóng hộp thiếc 200g, hợp biếu tặng và thưởng trà. Tiêu chuẩn cánh to, không đều bằng, vị nhẹ hơn, giá mềm hơn, hợp pha ấm lớn uống hằng ngày.",
    keys: ["premium", "tieu chuan", "phan hang", "hang 1", "hang 2"],
  },
  {
    q: "Nên mua gói 100g, 200g hay 500g?",
    a: "Một người uống mỗi sáng dùng khoảng 150–200g mỗi tháng, hộp 200g là vừa. Gói 500g có giá mỗi gam tốt hơn, nhưng nên chia ra hũ kín nhỏ để giữ hương. Mua lần đầu để thử thì chọn 100g.",
    keys: ["mua goi nao", "100g hay", "200g hay", "dung bao lau"],
  },
  {
    q: "Phí giao hàng bao nhiêu?",
    a: `Thái Nguyên ${formatVND(SHIPPING_FEE["noi-tinh"])}, miền Bắc ${formatVND(SHIPPING_FEE.bac)}, miền Trung ${formatVND(SHIPPING_FEE.trung)}, miền Nam ${formatVND(SHIPPING_FEE.nam)}. Miễn phí giao hàng cho đơn từ ${formatVND(FREE_SHIP_MIN)}. Giao hỏa tốc cộng thêm ${formatVND(EXPRESS_FEE)}.`,
    keys: ["phi ship", "phi giao", "van chuyen", "freeship", "mien phi"],
  },
  {
    q: "Bao lâu thì nhận được hàng?",
    a: "Thái Nguyên 1 ngày, miền Bắc 1–2 ngày, miền Trung 2–4 ngày, miền Nam 3–5 ngày. Đơn đặt trước 15:00 được gửi đi trong ngày. Lam Trà giao toàn quốc.",
    keys: ["bao lau nhan", "giao mat", "thoi gian giao", "may ngay"],
  },
  {
    q: "Có mã giảm giá không?",
    a: `Hiện có các mã: ${couponLines}. Bạn nhập mã ở bước thanh toán, mỗi đơn dùng một mã.`,
    keys: ["ma giam", "khuyen mai", "voucher", "coupon", "giam gia", "uu dai"],
  },
  {
    q: "Thanh toán bằng cách nào?",
    a: `Có 2 cách: chuyển khoản VietQR (khuyên dùng) và thanh toán khi nhận hàng (COD). Với VietQR, mã QR và mã đơn hiện ngay ở bước đặt hàng; bạn quét bằng app ngân hàng, ghi mã đơn vào nội dung. Lam Trà đối soát và xác nhận qua Zalo trong khoảng ${STORE.confirmWithin}.`,
    keys: ["thanh toan", "chuyen khoan", "cod", "vietqr", "tra tien"],
  },
  {
    q: "Chuyển khoản rồi mà chưa thấy xác nhận?",
    a: `Lam Trà đối soát trong giờ làm việc (${STORE.hours}), thường dưới ${STORE.confirmWithin}. Nếu lâu hơn, bạn nhắn Zalo kèm ảnh giao dịch và mã đơn nhé.`,
    keys: ["chua xac nhan", "da chuyen khoan", "chua thay"],
  },
  {
    q: "Đặt hàng như thế nào? Có cần tài khoản không?",
    a: "Không cần tài khoản. Bạn vào trang sản phẩm, chọn gói và hạng, bấm thêm vào giỏ, rồi vào Giỏ hàng (/gio-hang) để thanh toán: điền tên, số điện thoại, địa chỉ và chọn VietQR hoặc COD. Lam Trà xác nhận đơn qua Zalo.",
    keys: ["dat hang", "mua", "tai khoan", "cach mua", "order"],
  },
  {
    q: "Làm sao tra cứu đơn hàng?",
    a: "Vào trang Tra cứu đơn (/tra-cuu-don), nhập mã đơn (dạng LT + 6 ký tự, ví dụ LTAB12CD) và số điện thoại đặt hàng để xem trạng thái: Mới đặt, Đã xác nhận, Đang giao, Hoàn thành.",
    keys: ["tra cuu", "don hang", "trang thai", "kiem tra don", "ma don"],
  },
  {
    q: "Tôi muốn gửi quà tới người khác thì làm sao?",
    a: `Ở bước đặt hàng, chọn "Gửi tặng", nhập tên và số điện thoại người nhận, viết lời nhắn trên thiệp (tối đa 300 ký tự) và có thể chọn không kèm hóa đơn. Gói quà ${formatVND(GIFT_WRAP_FEE)}, miễn phí cho đơn từ ${formatVND(GIFT_WRAP_FREE_MIN)}.`,
    keys: ["gui tang", "nguoi nhan", "goi qua", "thiep", "loi nhan"],
  },
  {
    q: "Hộp quà Trao Gửi gồm những gì?",
    a: "Trà Đinh Sen 150g, Trà Nõn Tôm 150g và kẹo lạc trà xanh 200g trong hộp sơn mài (khoảng 32 × 24 × 9 cm), kèm túi giấy và thiệp Lam Trà viết tay lời nhắn của bạn.",
    keys: ["hop qua", "trao gui", "set qua"],
  },
  {
    q: "Đặt số lượng lớn hoặc quà doanh nghiệp được không?",
    a: "Được. Bạn gửi yêu cầu ở trang Liên hệ (/lien-he), Lam Trà báo giá trong một ngày làm việc. Có chiết khấu bậc thang từ 10 hộp quà, hỗ trợ khắc logo lên hộp sơn mài hoặc in thiệp riêng, và xuất hóa đơn VAT điện tử.",
    keys: ["doanh nghiep", "so luong lon", "cong ty", "si", "bao gia", "vat"],
  },
  {
    q: "Chính sách đổi trả thế nào?",
    a: "Trong 7 ngày kể từ khi nhận, nếu túi trà rách, xì chân không, trà bị ẩm hoặc có mùi lạ, giao sai loại, sai khối lượng, sai hạng, hoặc hộp quà móp vỡ khi vận chuyển, bạn chụp ảnh và nhắn Zalo. Lam Trà đổi gói mới hoặc hoàn tiền và chịu toàn bộ phí gửi lại. Chi tiết tại /chinh-sach.",
    keys: ["doi tra", "hoan tien", "loi", "hong", "sai hang", "bao hanh"],
  },
  {
    q: "Muốn hủy hoặc sửa đơn thì sao?",
    a: `Bạn nhắn Zalo hoặc gọi ${STORE.phone} càng sớm càng tốt, kèm mã đơn. Đơn chưa giao cho bưu cục thì Lam Trà sửa hoặc hủy được ngay.`,
    keys: ["huy don", "sua don", "doi dia chi"],
  },
  {
    q: "Trà có hương liệu hay phẩm màu không?",
    a: "Không. Trà xanh chỉ có búp chè sao tay. Trà sen ướp bằng gạo sen tươi, trà nhài ướp hoa nhài tươi, không dùng tinh dầu hay hương tổng hợp.",
    keys: ["huong lieu", "pham mau", "hoa chat", "tu nhien", "sach"],
  },
  {
    q: "Trà Đinh Sen được ướp thế nào?",
    a: "Búp Đinh non được ướp cùng gạo sen Tây Hồ theo lối xưa, nhiều lượt; mỗi cân trà cần hơn nghìn bông sen. Nước vàng sánh, hương sen dịu, hậu ngọt kéo dài. Pha 85°C, không dùng nước sôi già để giữ hương sen.",
    keys: ["tra sen", "dinh sen", "uop sen"],
  },
  {
    q: "Trà thảo mộc Thanh Nhiệt Dưỡng Tâm pha thế nào?",
    a: "Dùng 5g cho ấm 300ml, nước 90–95°C, hãm 3–5 phút, pha được 2–3 nước. Có thể thêm chút mật ong khi nước nguội bớt. Thành phần: trà xanh, hoa cúc, táo đỏ, kỷ tử, quế, gừng.",
    keys: ["thao moc", "thanh nhiet", "duong tam", "hoa cuc"],
  },
  {
    q: "Một lần trà pha được mấy nước?",
    a: "Trà xanh thường pha được 4–5 nước, Đinh Thượng Hạng 6–7 nước, trà thảo mộc 2–3 nước. Mỗi nước sau tăng thêm khoảng 10 giây hãm.",
    keys: ["may nuoc", "pha lai", "bao nhieu lan"],
  },
  {
    q: "Uống trà buổi tối có mất ngủ không?",
    a: "Trà xanh có caffeine nên người nhạy cảm có thể khó ngủ nếu uống đậm vào buổi tối. Buổi tối bạn nên pha loãng, hoặc chọn Trà Thanh Nhiệt Dưỡng Tâm vị nhẹ hơn.",
    keys: ["mat ngu", "buoi toi", "caffeine", "cafein"],
  },
  {
    q: "Phụ nữ mang thai, người có bệnh lý có uống trà được không?",
    a: "Trà là thực phẩm, không phải thuốc. Phụ nữ mang thai, cho con bú hoặc người đang điều trị bệnh nên hỏi ý kiến bác sĩ về lượng caffeine phù hợp trước khi uống thường xuyên.",
    keys: ["mang thai", "bau", "benh", "da day", "huyet ap", "cho con bu"],
  },
  {
    q: "Sản phẩm hết hàng thì sao?",
    a: "Trang sản phẩm hiển thị gói nào còn, gói nào hết. Gói hết hàng tạm thời không đặt được; bạn chọn gói khác hoặc nhắn Zalo để Lam Trà báo khi có hàng.",
    keys: ["het hang", "con hang", "ton kho"],
  },
  {
    q: "Trà của Lam Trà có nguồn gốc ở đâu?",
    a: "Trà được trồng và sao tay tại vùng chè Tân Cương, Thái Nguyên. Mỗi lô có hồ sơ nguồn gốc và chứng nhận tại trang /chung-nhan; mã QR trên bao bì dẫn tới hồ sơ lô trà.",
    keys: ["nguon goc", "xuat xu", "chung nhan", "qr", "lo tra"],
  },
  {
    q: "Liên hệ Lam Trà bằng cách nào?",
    a: `Zalo/điện thoại ${STORE.phone} (${STORE.zalo}), email ${STORE.email}. Giờ làm việc ${STORE.hours}. Địa chỉ: ${STORE.address}.`,
    keys: ["lien he", "hotline", "so dien thoai", "zalo", "email", "dia chi"],
  },
  {
    q: "Trà nào hợp làm quà Tết, Trung thu, 20/10, tân gia?",
    a: "Tết: Trà Đinh Sen, Đinh Thượng Hạng, Shan Tuyết Cổ Thụ, Hộp quà Trao Gửi. Trung thu: Trà Đinh Sen, Hộp quà Trao Gửi. 20/10: Trà Nõn Tôm, Trà Nhài, Đinh Thượng Hạng. Tân gia: Trà Đinh Sen, Trà Nhài, Hộp quà Trao Gửi.",
    keys: ["tet", "trung thu", "20/10", "tan gia", "dip"],
  },
];

const OCCASION_LABEL: Record<string, string> = { tet: "Tết", "trung-thu": "Trung thu", "20-10": "20/10", "tan-gia": "Tân gia" };
const PURPOSE_LABEL: Record<string, string> = { "hang-ngay": "uống hằng ngày", "bieu-tang": "biếu tặng" };

function variantLines(p: Product): string {
  if (p.fixed) {
    const s = stockOf(p, "-", "-");
    return `Giá ${formatVND(p.base)}${s === 0 ? " (HẾT HÀNG)" : ""}`;
  }
  return ["100", "200", "500"]
    .map((size) => {
      const g1 = priceOf(p, size, "1");
      const g2 = priceOf(p, size, "2");
      const out1 = stockOf(p, size, "1") === 0 ? " hết hàng" : "";
      const out2 = stockOf(p, size, "2") === 0 ? " hết hàng" : "";
      return `${size}g: Premium ${formatVND(g1)}${out1}, Tiêu chuẩn ${formatVND(g2)}${out2}`;
    })
    .join("; ");
}

/** Mô tả danh mục đang bán, dùng làm ngữ cảnh cho AI. */
export function catalogText(products: Product[]): string {
  return products
    .map((p) => {
      const lines = [
        `## ${p.name} (${p.kind}) - link: /san-pham/${p.slug}`,
        `Đặc điểm: ${p.note}. ${p.desc}`,
        `Giá: ${variantLines(p)}${p.compareAt ? ` (giá gốc ${formatVND(p.compareAt)})` : ""}`,
        `Hợp: ${p.purposes.map((x) => PURPOSE_LABEL[x] ?? x).join(", ")}${p.occasions.length ? `; dịp ${p.occasions.map((x) => OCCASION_LABEL[x] ?? x).join(", ")}` : ""}`,
        `Đánh giá ${p.rating}/5 (${p.reviews} lượt), đã bán ${p.sold}${p.isNew ? ", hàng mới" : ""}`,
        ...p.specs.map((s) => `${s.label}: ${s.value}`),
      ];
      if (p.brew) {
        lines.push(`Cách pha: ${p.brew.amount}, nước ${p.brew.temp}, ${p.brew.time}, pha ${p.brew.infusions}. Mẹo: ${p.brew.tip}`);
      }
      return lines.join("\n");
    })
    .join("\n\n");
}

export function faqText(): string {
  return FAQS.map((f) => `H: ${f.q}\nĐ: ${f.a}`).join("\n\n");
}
