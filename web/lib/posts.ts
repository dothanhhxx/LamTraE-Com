// Bài viết "Trà đàm". Tĩnh trong code; sau này có thể chuyển sang CMS.
export type Block = { h?: string; p?: string; list?: string[] };
export type Post = { slug: string; title: string; excerpt: string; date: string; ph: string; readMin: number; related: string[]; body: Block[] };

export const POSTS: Post[] = [
  {
    slug: "cach-pha-tra-thai-nguyen",
    title: "Pha một ấm trà Thái Nguyên cho đúng vị",
    excerpt: "Nhiệt độ nước, lượng trà và thời gian hãm quyết định ấm trà ngọt hậu hay chát gắt. Vài bước nhỏ Lam Trà vẫn làm mỗi sáng.",
    date: "2026-10-05", ph: "moccau", readMin: 4, related: ["tra-moc-cau", "tra-non-tom"],
    body: [
      { p: "Trà xanh Thái Nguyên không khó pha, nhưng dễ pha hỏng. Phần lớn ấm trà bị chát gắt là do nước quá nóng hoặc hãm quá lâu, chứ không phải do trà." },
      { h: "Chuẩn bị", list: ["Ấm sứ hoặc ấm đất nhỏ, khoảng 150ml", "5g trà, tương đương hai thìa cà phê đầy", "Nước lọc hoặc nước suối, đun sôi rồi để nguội còn 80 – 85°C"] },
      { h: "Tráng ấm và đánh thức trà", p: "Rót nước nóng tráng ấm, chén cho ấm đều. Cho trà vào, rót một ít nước rồi chắt ra ngay. Bước này giúp cánh trà nở và rửa bớt bụi trà." },
      { h: "Hãm nước đầu", p: "Rót nước đầy ấm, đậy nắp, hãm 20 – 30 giây rồi rót hết ra chén. Không để nước đọng lại trong ấm, vì trà tiếp tục ngấm sẽ làm nước sau đắng." },
      { h: "Những nước sau", p: "Mỗi nước sau tăng thêm khoảng 10 giây. Trà Móc Câu ngon tới nước thứ tư, thứ năm; Đinh Thượng Hạng có thể tới nước thứ bảy." },
      { h: "Dấu hiệu pha đúng", list: ["Nước xanh vàng, trong, không đục", "Vị chát nhẹ ở đầu lưỡi rồi tan nhanh", "Hậu ngọt đọng lại ở cổ họng sau khi uống"] },
    ],
  },
  {
    slug: "phan-biet-moc-cau-non-tom-dinh",
    title: "Móc Câu, Nõn Tôm, Đinh: khác nhau ở đâu?",
    excerpt: "Cùng một cây chè Tân Cương, cách hái khác nhau cho ra ba loại trà với giá và vị rất khác. Đây là cách phân biệt bằng mắt và bằng vị.",
    date: "2026-09-18", ph: "dinhth", readMin: 5, related: ["tra-moc-cau", "tra-non-tom", "dinh-thuong-hang"],
    body: [
      { p: "Tên gọi của trà Thái Nguyên phần lớn đến từ cách hái: hái phần nào của ngọn chè, và hái lúc nào. Phần càng non, trà càng ít và càng đắt." },
      { h: "Trà Đinh", p: "Chỉ lấy phần búp nhỏ nhất ở đầu ngọn, khi còn cuộn chặt như chiếc đinh. Cánh trà nhỏ, nhọn, phủ lông tơ trắng. Nước xanh ánh vàng nhạt, vị đậm sâu, hậu ngọt rất lâu." },
      { h: "Trà Nõn Tôm", p: "Hái một tôm một lá: búp non và lá non ngay dưới búp. Cánh trà nhỏ, đều, cong nhẹ như con tôm. Nước xanh trong, vị thanh, dễ uống." },
      { h: "Trà Móc Câu", p: "Hái một tôm hai lá. Khi sao, cánh trà xoăn lại như lưỡi câu. Đây là loại phổ biến nhất, vị chát dịu rồi ngọt, hợp uống hằng ngày." },
      { h: "Còn Hạng 1 và Hạng 2?", p: "Ở Lam Trà, cùng một loại trà được chia hạng sau khi sao. Hạng 1 là phần cánh đều, đẹp, hương đậm. Hạng 2 cánh to và không đều hơn, vị nhẹ hơn, giá mềm hơn, hợp pha ấm lớn mỗi ngày." },
      { h: "Phân biệt nhanh", list: ["Nhìn cánh: Đinh nhỏ và thẳng nhất, Móc Câu xoăn nhất", "Nhìn nước: Đinh và Nõn Tôm trong hơn Móc Câu", "Nếm: Đinh đậm, Nõn Tôm thanh, Móc Câu chát dịu"] },
    ],
  },
  {
    slug: "bao-quan-tra-xanh",
    title: "Bảo quản trà xanh để giữ hương suốt năm",
    excerpt: "Trà là thứ hút ẩm và hút mùi rất nhanh. Bảo quản sai một tuần là mất hương cả gói. Năm điều nên và không nên.",
    date: "2026-08-30", ph: "nontom", readMin: 3, related: ["tra-dinh-sen", "tra-non-tom"],
    body: [
      { p: "Trà xanh đã sao khô có độ ẩm rất thấp, nên khi gặp không khí ẩm, trà sẽ hút nước và mất hương. Trà cũng hút mùi của mọi thứ để gần." },
      { h: "Nên", list: ["Để trong túi zip của Lam Trà, ép hết không khí sau mỗi lần dùng", "Chia nhỏ gói lớn ra hũ thủy tinh hoặc hộp thiếc kín", "Để nơi khô mát, tránh nắng, tránh bếp"] },
      { h: "Không nên", list: ["Để chung tủ với cà phê, gia vị, xà phòng", "Dùng thìa ướt xúc trà", "Để ngăn đá tủ lạnh rồi lấy ra lấy vào nhiều lần, vì hơi nước sẽ đọng lại"] },
      { h: "Trà sen cần chú ý thêm", p: "Hương sen dễ bay hơn hương trà. Bạn nên dùng trà sen trong khoảng 6 tháng đầu để giữ được hương đẹp nhất, dù hạn dùng là 12 tháng." },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

export const formatDate = (iso: string) => iso.split("-").reverse().join("/");
