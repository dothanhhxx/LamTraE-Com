// Dữ liệu sản phẩm tạm thời (tĩnh). Giai đoạn 3 sẽ chuyển sang database.

export type Category = { slug: string; name: string; desc: string; ph: string };

export const CATEGORIES: Category[] = [
  { slug: "tra-xanh", name: "Trà xanh", desc: "Móc Câu, Nõn Tôm sao tay, hợp uống hằng ngày.", ph: "moccau" },
  { slug: "tra-sen", name: "Trà sen", desc: "Búp trà ướp gạo sen Tây Hồ theo lối xưa.", ph: "sen" },
  { slug: "thuong-hang", name: "Thượng hạng", desc: "Phần búp nhỏ nhất, dành cho người sành trà.", ph: "dinhth" },
  { slug: "tra-thao-moc", name: "Trà thảo mộc", desc: "Trà xanh phối hoa cúc, táo đỏ, quế, gừng, dễ uống.", ph: "/assets/products/tra-thanh-nhiet-duong-tam-1.webp" },
  { slug: "qua-tang", name: "Quà tặng", desc: "Hộp quà gói sẵn, kèm thiệp viết tay.", ph: "hopqua" },
];

export type Purpose = "hang-ngay" | "bieu-tang";
export const PURPOSES: { value: Purpose; label: string; desc: string }[] = [
  { value: "hang-ngay", label: "Uống hằng ngày", desc: "Vị dễ uống, giá vừa phải cho ấm trà mỗi sáng." },
  { value: "bieu-tang", label: "Biếu tặng", desc: "Hương sâu, đóng gói chỉn chu để trao tay." },
];

export type Occasion = "tet" | "trung-thu" | "20-10" | "tan-gia";
export const OCCASIONS: { value: Occasion; label: string; desc: string }[] = [
  { value: "tet", label: "Tết", desc: "Biếu ông bà, cha mẹ, đối tác dịp đầu năm." },
  { value: "trung-thu", label: "Trung thu", desc: "Ấm trà bên bánh nướng, bánh dẻo." },
  { value: "20-10", label: "20/10", desc: "Món quà nhẹ nhàng cho mẹ, cho cô." },
  { value: "tan-gia", label: "Tân gia", desc: "Chúc nhà mới ấm cúng, khách đến có trà ngon." },
];

export type Spec = { label: string; value: string };
export type Brew = { temp: string; amount: string; time: string; infusions: string; tip: string };

export type Product = {
  slug: string;
  name: string;
  category: string;
  kind: string;
  note: string;
  base: number;
  /** Giá trước khuyến mãi cho biến thể mặc định (200g · Premium), nếu có */
  compareAt?: number;
  /** Sản phẩm giá cố định, không chọn khối lượng / phân hạng */
  fixed?: boolean;
  rating: number;
  reviews: number;
  sold: number;
  isNew?: boolean;
  /** Ngày lên kệ, dùng để sắp xếp "Mới nhất" */
  addedAt: string;
  origin: string;
  ph: string;
  /** Ảnh hộp phổ thông, hiện khi khách chọn hạng Tiêu chuẩn */
  standardPh?: string;
  /** Nhãn quy cách cho sản phẩm giá cố định, ví dụ "Hộp 20 túi lọc" */
  unit?: string;
  /** Ảnh phụ (tên file trong /assets/photos) kèm chú thích */
  gallery: { ph: string; alt: string }[];
  desc: string;
  purposes: Purpose[];
  occasions: Occasion[];
  specs: Spec[];
  brew?: Brew;
  /** Tồn kho theo biến thể, khóa `${size}|${grade}` (sản phẩm cố định dùng "-|-"). Không có khóa = còn nhiều. */
  stock?: Record<string, number>;
  active?: boolean;
  deleted?: boolean;
};

const STORE_TIP = "Giữ trong túi zip hoặc hũ kín, để nơi khô mát, tránh nắng và đồ có mùi mạnh.";

export const PRODUCTS: Product[] = [
  {
    slug: "tra-dinh-sen", name: "Trà Đinh Sen", category: "tra-sen", kind: "Trà sen", note: "Hương sen dịu, hậu ngọt kéo dài",
    base: 559000, rating: 4.9, reviews: 88, sold: 410, addedAt: "2026-03-02", origin: "Tân Cương · Thái Nguyên",
    ph: "/assets/products/tra-dinh-sen-1.webp",
    gallery: [
      { ph: "/assets/products/tra-dinh-sen-2.webp", alt: "Hộp Trà Đinh Sen bên đóa sen hồng và chén trà vàng sánh" },
      { ph: "/assets/products/tra-dinh-sen-3.webp", alt: "Hộp Trà Đinh Sen trên bệ đá giữa mặt nước" },
      { ph: "/assets/products/tra-dinh-sen-4.webp", alt: "Hộp Trà Đinh Sen mở nắp, cánh trà và cánh sen tung bay" },
      { ph: "/assets/products/tra-dinh-sen-5.webp", alt: "Hộp thiếc Trà Đinh Sen với hình hoa sen và đồi chè" },
      { ph: "/assets/products/tra-dinh-sen-6.webp", alt: "Túi giấy xanh Trà Đinh Sen giữa đồi chè" },
      { ph: "/assets/products/tra-dinh-sen-7.webp", alt: "Túi giấy kraft Trà Đinh Sen giữa núi đồi" },
      { ph: "/assets/products/tra-dinh-sen-8.webp", alt: "Hộp túi lọc Trà Đinh Sen cùng ấm thủy tinh và chén sứ" },
    ],
    desc: "Búp Đinh non ướp cùng gạo sen Tây Hồ theo lối xưa, mỗi cân trà cần hơn nghìn bông sen. Nước vàng sánh, thơm thanh, hợp tiếp khách và biếu tặng.",
    purposes: ["bieu-tang"], occasions: ["tet", "trung-thu", "tan-gia"],
    specs: [
      { label: "Vùng trồng", value: "Tân Cương, Thái Nguyên" },
      { label: "Mùa hái", value: "Vụ xuân, tháng 3 – 5" },
      { label: "Chế biến", value: "Sao tay chảo gang, ướp gạo sen Tây Hồ nhiều lượt" },
      { label: "Hương vị", value: "Hương sen dịu, vị chát nhẹ, hậu ngọt kéo dài" },
      { label: "Màu nước", value: "Vàng sánh" },
      { label: "Hạn dùng", value: "12 tháng kể từ ngày đóng gói" },
      { label: "Bảo quản", value: STORE_TIP },
    ],
    brew: { temp: "85°C", amount: "5g cho ấm 150ml", time: "Tráng trà, hãm 25 giây", infusions: "4 – 5 nước", tip: "Không dùng nước sôi già để giữ hương sen." },
  },
  {
    slug: "tra-moc-cau", name: "Trà Móc Câu", category: "tra-xanh", kind: "Trà xanh", note: "Hương cốm non, chát dịu",
    base: 219000, rating: 4.7, reviews: 142, sold: 980, addedAt: "2025-11-10", origin: "Tân Cương · Thái Nguyên",
    ph: "/assets/products/tra-moc-cau-1.webp", standardPh: "/assets/products/tra-moc-cau-pho-thong.webp",
    gallery: [
      { ph: "/assets/products/tra-moc-cau-2.webp", alt: "Hộp Trà Móc Câu trên bệ đá giữa núi đồi" },
      { ph: "/assets/products/tra-moc-cau-3.webp", alt: "Hộp Trà Móc Câu mở nắp, cánh trà xoăn tung bay" },
    ],
    desc: "Cánh trà xoăn nhỏ như móc câu, sao tay trên chảo gang. Nước xanh vàng, vị chát dịu rồi ngọt, hợp uống hằng ngày.",
    purposes: ["hang-ngay"], occasions: [],
    specs: [
      { label: "Vùng trồng", value: "Tân Cương, Thái Nguyên" },
      { label: "Mùa hái", value: "Quanh năm, ngon nhất vụ xuân và thu" },
      { label: "Chế biến", value: "Vò và sao tay trên chảo gang" },
      { label: "Hương vị", value: "Hương cốm non, chát dịu, hậu ngọt" },
      { label: "Màu nước", value: "Xanh vàng" },
      { label: "Hạng Tiêu chuẩn", value: "Hộp giấy dòng trà hằng ngày. Trà xanh truyền thống, hương trà đậm, vị hơi chát, hậu ngọt dễ chịu." },
      { label: "Hạn dùng", value: "12 tháng kể từ ngày đóng gói" },
      { label: "Bảo quản", value: STORE_TIP },
    ],
    brew: { temp: "80 – 85°C", amount: "5g cho ấm 150ml", time: "Tráng trà, hãm 20 – 30 giây", infusions: "4 – 5 nước", tip: "Nước sau tăng thêm 10 giây hãm." },
  },
  {
    slug: "tra-non-tom", name: "Trà Nõn Tôm", category: "tra-xanh", kind: "Trà xanh", note: "Nước xanh trong, vị thanh",
    base: 249000, rating: 4.8, reviews: 64, sold: 520, addedAt: "2026-01-15", origin: "Tân Cương · Thái Nguyên",
    ph: "/assets/products/tra-non-tom-1.webp", standardPh: "/assets/products/tra-non-tom-pho-thong.webp",
    gallery: [
      { ph: "/assets/products/tra-non-tom-2.webp", alt: "Hộp Trà Nõn Tôm mở nắp, búp trà và hoa trà bay lên" },
      { ph: "/assets/products/tra-non-tom-3.webp", alt: "Hộp Trà Nõn Tôm mở nắp, cánh trà tung bay" },
      { ph: "/assets/products/tra-non-tom-4.webp", alt: "Hộp túi lọc Trà Nõn Tôm cùng ấm thủy tinh và chén sứ" },
    ],
    desc: "Chỉ hái một tôm một lá vào sáng sớm. Cánh trà nhỏ, đều, nước xanh trong và hậu ngọt rõ.",
    purposes: ["hang-ngay", "bieu-tang"], occasions: ["20-10"],
    specs: [
      { label: "Vùng trồng", value: "Tân Cương, Thái Nguyên" },
      { label: "Mùa hái", value: "Vụ xuân và vụ thu" },
      { label: "Chế biến", value: "Hái một tôm một lá, sao tay hai lửa" },
      { label: "Hương vị", value: "Thanh, chát nhẹ, hậu ngọt rõ" },
      { label: "Màu nước", value: "Xanh trong" },
      { label: "Hạng Tiêu chuẩn", value: "Hộp giấy dòng trà hằng ngày. Làm từ búp và lá non, hương tươi, chát dịu, hậu ngọt nhẹ." },
      { label: "Hạn dùng", value: "12 tháng kể từ ngày đóng gói" },
      { label: "Bảo quản", value: STORE_TIP },
    ],
    brew: { temp: "80°C", amount: "5g cho ấm 150ml", time: "Tráng trà, hãm 20 giây", infusions: "5 nước", tip: "Búp non dễ nẫu, nên để nước nguội bớt sau khi sôi." },
  },
  {
    slug: "dinh-thuong-hang", name: "Đinh Thượng Hạng", category: "thuong-hang", kind: "Thượng hạng", note: "Búp nhỏ nhất, vị sâu",
    base: 480000, rating: 5.0, reviews: 31, sold: 140, isNew: true, addedAt: "2026-09-20", origin: "Đồi chè Tân Cương", ph: "dinhth", standardPh: "/assets/products/tra-dinh-pho-thong.webp",
    gallery: [{ ph: "hero", alt: "Đồi chè Tân Cương lúc sáng sớm" }],
    desc: "Phần búp nhỏ nhất của cây chè, cánh nhọn như đinh. Dành cho người sành trà và những dịp đặc biệt.",
    purposes: ["bieu-tang"], occasions: ["tet", "20-10"],
    specs: [
      { label: "Vùng trồng", value: "Đồi chè Tân Cương, Thái Nguyên" },
      { label: "Mùa hái", value: "Đầu vụ xuân, tháng 2 – 3" },
      { label: "Chế biến", value: "Chỉ hái phần đinh, sao tay nhiều lửa nhỏ" },
      { label: "Hương vị", value: "Hương cốm sâu, vị đậm, hậu ngọt rất lâu" },
      { label: "Màu nước", value: "Xanh ánh vàng nhạt" },
      { label: "Hạng Tiêu chuẩn", value: "Hộp giấy dòng trà hằng ngày. Làm từ búp non, hương dịu, chát nhẹ, hậu ngọt thanh." },
      { label: "Hạn dùng", value: "12 tháng kể từ ngày đóng gói" },
      { label: "Bảo quản", value: STORE_TIP },
    ],
    brew: { temp: "75 – 80°C", amount: "4g cho ấm 150ml", time: "Tráng trà, hãm 20 giây", infusions: "6 – 7 nước", tip: "Dùng ấm nhỏ, chén mỏng để cảm rõ hậu vị." },
    stock: { "500|1": 0, "300|1": 3 },
  },
  {
    slug: "tra-nhai", name: "Trà Nhài", category: "tra-xanh", kind: "Trà ướp hoa", note: "Thơm hoa nhài, vị thanh mát",
    base: 289000, rating: 5.0, reviews: 0, sold: 0, isNew: true, addedAt: "2026-11-11", origin: "Tân Cương · Thái Nguyên",
    ph: "/assets/products/tra-nhai-1.webp", standardPh: "/assets/products/tra-nhai-pho-thong.webp",
    gallery: [
      { ph: "/assets/products/tra-nhai-2.webp", alt: "Hộp Trà Nhài mở nắp, búp trà và hoa nhài bay lên" },
      { ph: "/assets/products/tra-nhai-3.webp", alt: "Hộp Trà Nhài trên bệ đá giữa đồi chè" },
      { ph: "/assets/products/tra-nhai-4.webp", alt: "Hộp túi lọc Trà Nhài cùng ấm thủy tinh và chén sứ" },
    ],
    desc: "Búp trà xanh Tân Cương ướp cùng hoa nhài tươi hái lúc chớm nở. Nước vàng xanh, hương nhài thoang thoảng, vị chát nhẹ rồi ngọt, hợp uống hằng ngày và mời khách.",
    purposes: ["hang-ngay", "bieu-tang"], occasions: ["20-10", "tan-gia"],
    specs: [
      { label: "Vùng trồng", value: "Tân Cương, Thái Nguyên" },
      { label: "Mùa hái", value: "Vụ xuân và vụ hè" },
      { label: "Chế biến", value: "Sao tay chảo gang, ướp hoa nhài tươi nhiều lượt" },
      { label: "Hương vị", value: "Hương nhài dịu, chát nhẹ, hậu ngọt" },
      { label: "Màu nước", value: "Vàng xanh trong" },
      { label: "Hạng Tiêu chuẩn", value: "Hộp giấy dòng trà hằng ngày. Trà xanh thơm rõ hương hoa nhài, vị trà nhẹ, hậu tươi mát và ngọt." },
      { label: "Hạn dùng", value: "12 tháng kể từ ngày đóng gói" },
      { label: "Bảo quản", value: STORE_TIP },
    ],
    brew: { temp: "80 – 85°C", amount: "5g cho ấm 150ml", time: "Tráng trà, hãm 20 – 25 giây", infusions: "4 nước", tip: "Đậy nắp ấm khi hãm để giữ hương nhài." },
  },
  {
    slug: "tra-thanh-nhiet-duong-tam", name: "Trà Thanh Nhiệt Dưỡng Tâm", category: "tra-thao-moc", kind: "Trà thảo mộc", note: "Hoa cúc, táo đỏ, quế, gừng",
    base: 180000, rating: 5.0, reviews: 0, sold: 0, isNew: true, addedAt: "2026-11-11", origin: "Thảo mộc Việt · Thái Nguyên",
    ph: "/assets/products/tra-thanh-nhiet-duong-tam-1.webp",
    gallery: [],
    desc: "Trà xanh Thái Nguyên phối cùng hoa cúc, táo đỏ, kỷ tử, quế và gừng, 100% nguyên liệu tự nhiên. Vị thanh, ấm nhẹ, ngọt dịu tự nhiên, hợp uống buổi chiều hoặc sau bữa ăn.",
    purposes: ["hang-ngay"], occasions: ["tet", "tan-gia"],
    specs: [
      { label: "Thành phần", value: "Trà xanh, hoa cúc, táo đỏ, kỷ tử, quế, gừng" },
      { label: "Nguồn gốc", value: "Trà xanh Thái Nguyên, thảo mộc Việt" },
      { label: "Hương vị", value: "Thơm hoa cúc, ấm quế gừng, ngọt dịu từ táo đỏ" },
      { label: "Màu nước", value: "Vàng hổ phách" },
      { label: "Hạn dùng", value: "12 tháng kể từ ngày đóng gói" },
      { label: "Bảo quản", value: STORE_TIP },
    ],
    brew: { temp: "90 – 95°C", amount: "5g cho ấm 300ml", time: "Hãm 3 – 5 phút", infusions: "2 – 3 nước", tip: "Có thể thêm chút mật ong khi nước nguội bớt." },
  },
  {
    slug: "hop-qua-trao-gui", name: "Hộp quà Trao Gửi", category: "qua-tang", kind: "Quà tặng", note: "Gói sẵn, kèm thiệp viết tay",
    base: 650000, fixed: true, rating: 4.9, reviews: 53, sold: 260, addedAt: "2026-08-01", origin: "Bộ quà tặng", ph: "hopqua",
    gallery: [{ ph: "sen", alt: "Trà Đinh Sen trong hộp quà" }, { ph: "nontom", alt: "Trà Nõn Tôm trong hộp quà" }],
    desc: "Đinh Sen 150g, Nõn Tôm 150g và kẹo lạc trà xanh trong hộp sơn mài. Miễn phí gói quà cho đơn từ 500.000₫.",
    purposes: ["bieu-tang"], occasions: ["tet", "trung-thu", "20-10", "tan-gia"],
    specs: [
      { label: "Thành phần", value: "Trà Đinh Sen 150g · Trà Nõn Tôm 150g · Kẹo lạc trà xanh 200g" },
      { label: "Hộp", value: "Hộp sơn mài, khoảng 32 × 24 × 9 cm, kèm túi giấy" },
      { label: "Thiệp", value: "Lam Trà viết tay lời nhắn của bạn" },
      { label: "Hạn dùng", value: "Trà 12 tháng · Kẹo 6 tháng" },
      { label: "Bảo quản", value: STORE_TIP },
    ],
    stock: { "-|-": 12 },
  },
  {
    slug: "tra-shan-tuyet-co-thu",
    name: "Trà Shan Tuyết Cổ Thụ",
    category: "thuong-hang",
    kind: "Thượng hạng",
    note: "Vị ngọt tuyết trà núi cao, bền nước",
    base: 390000,
    compareAt: 420000,
    fixed: false,
    rating: 5,
    reviews: 0,
    sold: 0,
    isNew: true,
    addedAt: "2026-10-20",
    origin: "Tân Cương · Thái Nguyên",
    ph: "moccau",
    gallery: [],
    desc: "Búp trà Shan tuyết cổ thụ phủ lớp tuyết trắng mịn màng, nước vàng óng ả thơm ngát.",
    purposes: ["hang-ngay", "bieu-tang"],
    occasions: ["tet", "tan-gia"],
    specs: [
      { label: "Vùng trồng", value: "Tân Cương, Thái Nguyên" },
      { label: "Mùa hái", value: "Vụ xuân, tháng 3 – 5" },
      { label: "Chế biến", value: "Sao tay chảo gang truyền thống" },
      { label: "Hương vị", value: "Hương cốm non dịu, tiền chát hậu ngọt sâu" },
      { label: "Màu nước", value: "Xanh vàng trong, sánh" },
      { label: "Hạn dùng", value: "12 tháng kể từ ngày đóng gói" },
      { label: "Bảo quản", value: STORE_TIP },
    ],
    brew: {
      temp: "80 – 85°C",
      amount: "5g cho ấm 150ml",
      time: "Tráng trà, hãm 25 giây",
      infusions: "4 – 5 nước",
      tip: "Nước sau tăng thêm 10 giây hãm.",
    },
    stock: {},
    active: true,
    deleted: false,
  },
  {
    slug: "tra-tui-loc-tan-cuong", name: "Trà Túi Lọc Tân Cương", category: "tra-xanh", kind: "Trà túi lọc", note: "Hương dịu tự nhiên, pha nhanh",
    base: 95000, fixed: true, unit: "Hộp 20 túi lọc", rating: 5.0, reviews: 0, sold: 0, isNew: true, addedAt: "2026-11-11", origin: "Tân Cương · Thái Nguyên",
    ph: "/assets/products/tra-tui-loc-tan-cuong-1.webp",
    gallery: [],
    desc: "Trà xanh Tân Cương đóng túi lọc, hương tự nhiên dịu nhẹ, vị chát nhẹ và hậu ngọt êm. Chỉ cần thả túi vào cốc nước nóng, tiện cho giờ làm việc và những chuyến đi.",
    purposes: ["hang-ngay"], occasions: [],
    specs: [
      { label: "Vùng trồng", value: "Tân Cương, Thái Nguyên" },
      { label: "Quy cách", value: "Hộp 20 túi lọc" },
      { label: "Hương vị", value: "Hương tự nhiên dịu nhẹ, chát nhẹ, hậu ngọt êm" },
      { label: "Điểm mạnh", value: "Pha nhanh, gọn, dễ mang theo" },
      { label: "Bảo quản", value: "Đóng kín hộp sau khi mở, để nơi khô mát, tránh nắng và đồ có mùi mạnh." },
    ],
    brew: { temp: "85 – 90°C", amount: "1 túi cho cốc 150 – 200ml", time: "Ngâm 2 – 3 phút", infusions: "1 – 2 lần", tip: "Nhấc túi ra khi vừa vị để nước trà không bị chát gắt." },
  },
  {
    slug: "matcha-bot-tra-xanh", name: "Matcha Bột Trà Xanh", category: "tra-xanh", kind: "Bột trà xanh", note: "Vị trà xanh đậm, bột mịn",
    base: 220000, fixed: true, unit: "Hộp giấy tròn", rating: 5.0, reviews: 0, sold: 0, isNew: true, addedAt: "2026-11-11", origin: "Lam Trà · Thái Nguyên",
    ph: "/assets/products/matcha-1.webp",
    gallery: [],
    desc: "Bột trà xanh xay mịn, vị trà xanh đậm, chát nhẹ, khi đánh lên cho lớp nước mượt. Dùng để pha matcha nóng, matcha latte hoặc làm bánh.",
    purposes: ["hang-ngay"], occasions: [],
    specs: [
      { label: "Dạng", value: "Bột trà xanh xay mịn" },
      { label: "Hương vị", value: "Vị trà xanh đậm, chát nhẹ" },
      { label: "Kết cấu", value: "Mịn, mượt khi pha" },
      { label: "Cách dùng", value: "Pha matcha nóng, latte, đá xay hoặc làm bánh" },
      { label: "Đóng gói", value: "Hộp giấy tròn có nắp" },
      { label: "Bảo quản", value: "Đậy kín nắp sau khi dùng, để nơi khô mát, tránh ánh nắng." },
    ],
    brew: { temp: "75 – 80°C", amount: "2g (khoảng 1 thìa nhỏ) cho 70ml nước", time: "Đánh 15 – 20 giây theo hình chữ W", infusions: "1 lần", tip: "Rây bột qua lưới trước khi pha để không bị vón cục." },
  },
  {
    slug: "hop-qua-lam-tra", name: "Hộp quà Lam Trà", category: "qua-tang", kind: "Quà tặng", note: "Hai loại trà hằng ngày, kèm thiệp",
    base: 450000, fixed: true, unit: "Hộp quà", rating: 5.0, reviews: 0, sold: 0, isNew: true, addedAt: "2026-11-11", origin: "Bộ quà tặng",
    ph: "/assets/products/hop-qua-lam-tra-1.webp",
    gallery: [],
    desc: "Hộp quà gồm hai loại trà thuộc dòng trà hằng ngày của Lam Trà, đặt trong hộp giấy cứng có họa tiết lấy cảm hứng từ văn hóa trà Thái Nguyên. Kèm thiệp chúc và mã QR kể câu chuyện văn hóa trà, hợp để biếu tặng.",
    purposes: ["bieu-tang"], occasions: ["tet", "trung-thu", "20-10", "tan-gia"],
    specs: [
      { label: "Thành phần", value: "Hai loại trà thuộc dòng trà hằng ngày của Lam Trà" },
      { label: "Mã QR và thiệp", value: "Mã QR kể câu chuyện văn hóa trà, kèm thiệp chúc" },
      { label: "Hộp", value: "Hộp giấy bìa cứng, họa tiết lấy cảm hứng từ văn hóa trà Thái Nguyên, sang trọng để làm quà" },
      { label: "Bảo quản", value: STORE_TIP },
    ],
  },
];

export const photo = (ph: string) => {
  if (!ph) return "/assets/photos/moccau.jpg";
  if (ph.startsWith("http://") || ph.startsWith("https://") || ph.startsWith("/") || ph.startsWith("data:")) {
    return ph;
  }
  return `/assets/photos/${ph}.jpg`;
};

// Giá niêm yết (base) là hộp 200g Premium, đúng hộp thật đang bán. 100g đắt hơn 10% tính theo gam, 500g rẻ hơn 8%.
export const SIZE_FACTOR: Record<string, number> = { "100": 0.55, "200": 1, "500": 2.3 };
export const GRADE_FACTOR: Record<string, number> = { "1": 1, "2": 0.75 };
export const GRADE_LABEL: Record<string, string> = { "1": "Premium", "2": "Tiêu chuẩn" };
export const SIZE_OPTIONS = ["100", "200", "500"].map((s) => ({ value: s, label: s + "g" }));
export const GRADE_OPTIONS = [
  { value: "1", label: GRADE_LABEL["1"], sub: "Hương đậm" },
  { value: "2", label: GRADE_LABEL["2"], sub: "Hằng ngày" },
];
export const DEFAULT_SIZE = "200";
export const DEFAULT_GRADE = "1";
export const LOW_STOCK = 5;
export const MAX_QTY = 99;

export function priceOf(p: Product, size = DEFAULT_SIZE, grade = DEFAULT_GRADE) {
  if (p.fixed) return p.base;
  return Math.round((p.base * (SIZE_FACTOR[size] ?? 1) * (GRADE_FACTOR[grade] ?? 1)) / 1000) * 1000;
}

export function variantLabel(p: Product, size = DEFAULT_SIZE, grade = DEFAULT_GRADE) {
  return p.fixed ? p.unit ?? "Hộp 3 món" : `${size}g · ${GRADE_LABEL[grade] ?? "Hạng " + grade}`;
}

export const variantKey = (p: Product, size: string, grade: string) => (p.fixed ? "-|-" : `${size}|${grade}`);

/** Số lượng còn lại, hoặc undefined nếu còn nhiều. */
export const stockOf = (p: Product, size = DEFAULT_SIZE, grade = DEFAULT_GRADE) => p.stock?.[variantKey(p, size, grade)];

/** Số lượng tối đa được đặt cho một biến thể. */
export const maxQtyOf = (p: Product, size = DEFAULT_SIZE, grade = DEFAULT_GRADE) => Math.min(MAX_QTY, stockOf(p, size, grade) ?? MAX_QTY);

export const isValidVariant = (p: Product, size: string, grade: string) =>
  p.fixed ? size === "-" && grade === "-" : size in SIZE_FACTOR && grade in GRADE_FACTOR;

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getCategory = (slug?: string) => CATEGORIES.find((c) => c.slug === slug);

export const bestSellers = (n = 4) => [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, n);

export function related(p: Product, n = 4) {
  const score = (o: Product) => (o.category === p.category ? 2 : 0) + o.purposes.filter((x) => p.purposes.includes(x)).length;
  return PRODUCTS.filter((o) => o.slug !== p.slug).sort((a, b) => score(b) - score(a) || b.sold - a.sold).slice(0, n);
}

export function badgeOf(p: Product): { label: string; tone: "sale" | "new" | "accent" } | undefined {
  if (p.compareAt) return { label: "Ưu đãi", tone: "sale" };
  if (p.isNew) return { label: "Mới", tone: "new" };
  if (p.sold > 500) return { label: "Bán chạy", tone: "accent" };
  return undefined;
}

/** Trích xuất 1-2 từ khóa nổi bật (hương vị, tiêu chuẩn, điểm nhấn) cho thẻ sản phẩm nhỏ gọn */
export function keywordsOf(p: Product): string[] {
  const kw: string[] = [];
  if (p.category === "qua-tang") {
    return ["Hộp quà sang trọng", "Thiệp viết tay"];
  }
  if (p.note) {
    const parts = p.note.split(/[,;·–—]/).map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.length <= 22 && !kw.includes(part)) kw.push(part);
      if (kw.length >= 2) break;
    }
  }
  if (kw.length === 0 && p.kind) {
    kw.push(p.kind);
  }
  if (kw.length < 2 && p.origin) {
    kw.push(p.origin.split("·")[0].split(",")[0].trim());
  }
  return kw.slice(0, 2);
}
