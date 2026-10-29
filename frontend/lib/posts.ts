// Bài viết "Trà đàm". Tĩnh trong code; sau này có thể chuyển sang CMS.
export type Figure = { src: string; alt: string; w: number; h: number };
export type Block = { h?: string; img?: Figure; p?: string; list?: string[] };

// Ảnh hành trình (đã cắt bỏ khung, logo, chữ trong ảnh gốc)
export const JOURNEY_PHOTOS = {
  vungTrong: { src: "/assets/journey/vung-trong.webp", alt: "Đồi chè Tân Cương xanh mướt dưới nắng sớm", w: 562, h: 180 },
  thuHai: { src: "/assets/journey/thu-hai.webp", alt: "Người dân đội nón lá hái chè trên đồi", w: 569, h: 174 },
  cheBien: { src: "/assets/journey/che-bien.webp", alt: "Thợ chè đảo búp chè trong lồng sao", w: 572, h: 164 },
  thuongTra: { src: "/assets/journey/thuong-tra.webp", alt: "Rót trà từ ấm đất ra những chén nhỏ", w: 392, h: 194 },
  rotTra: { src: "/assets/journey/rot-tra.webp", alt: "Rót trà xanh vào chén gốm, bên cạnh trà khô", w: 556, h: 215 },
  voChe: { src: "/assets/journey/vo-che.webp", alt: "Búp chè non quay trong lồng sao", w: 526, h: 348 },
};
const J = JOURNEY_PHOTOS;
export type Post = { slug: string; title: string; excerpt: string; date: string; ph: string; readMin: number; related: string[]; body: Block[] };

export const POSTS: Post[] = [
  {
    slug: "nhung-ban-tay-lam-nen-chen-tra",
    title: "Từ những búp trà non: những bàn tay làm nên chén trà",
    excerpt: "Đằng sau mỗi chén trà thơm ngon không chỉ là những búp chè xanh mướt, mà còn là câu chuyện về những con người dành bao tâm huyết cho nghề làm trà.",
    date: "2026-10-28", ph: "/assets/journey/hai-bup.webp", readMin: 3, related: ["tra-non-tom", "dinh-thuong-hang"],
    body: [
      { p: "Trên những đồi chè Tân Cương, Thái Nguyên, khi sương sớm vẫn còn vương trên từng tán lá, người nông dân đã bắt đầu một ngày làm việc quen thuộc. Đôi bàn tay thoăn thoắt lựa chọn từng búp chè non, cẩn thận hái đúng độ để giữ trọn chất lượng của nguyên liệu." },
      { h: "Một nghề được gìn giữ qua nhiều thế hệ", p: "Với người dân nơi đây, làm trà không chỉ là công việc mưu sinh mà còn là một nghề truyền thống. Từ khâu chăm sóc, thu hái đến sao chè, vò chè, mỗi công đoạn đều đòi hỏi sự khéo léo, kiên nhẫn và kinh nghiệm của người làm nghề." },
      { h: "Để có một chén trà ngon", img: J.voChe, p: "Không chỉ cần những búp chè chất lượng, mà còn là cả một quá trình đầy tâm huyết:", list: ["Sự tỉ mỉ trong từng công đoạn chế biến", "Kinh nghiệm làm trà được gìn giữ qua nhiều thế hệ", "Tình yêu và sự trân trọng dành cho vùng đất chè Thái Nguyên"] },
      { p: "Để rồi khi chén trà được rót ra, hương thơm dịu nhẹ lan tỏa, vị chát thanh nơi đầu lưỡi dần nhường chỗ cho hậu ngọt sâu lắng. Nâng chén trà trên tay, ta không chỉ thưởng thức hương vị của thiên nhiên mà còn cảm nhận được câu chuyện về những con người đứng sau mỗi sản phẩm." },
      { p: "Trân trọng từng búp trà, nâng niu công sức người làm trà. Đó cũng là cách Lam Trà gìn giữ giá trị của trà Thái Nguyên." },
    ],
  },
  {
    slug: "hanh-trinh-tu-doi-che-den-tach-tra",
    title: "Hành trình từ đồi chè đến tách trà thơm ngon",
    excerpt: "Theo chân những búp chè Tân Cương, Thái Nguyên qua năm công đoạn, nơi hương vị truyền thống được gìn giữ để tạo nên những tách trà đậm đà bản sắc Việt.",
    date: "2026-10-24", ph: "/assets/journey/binh-minh.webp", readMin: 5, related: ["tra-moc-cau", "tra-non-tom", "dinh-thuong-hang"],
    body: [
      { p: "Đằng sau mỗi tách trà không chỉ là hương vị thanh dịu, đậm đà mà còn là cả một hành trình được tạo nên từ thiên nhiên, bàn tay con người và những giá trị truyền thống. Từ những đồi chè xanh mướt tại Tân Cương đến từng công đoạn thu hái, chế biến và đóng gói, mỗi bước đều góp phần tạo nên nét đặc trưng của trà Việt." },
      { h: "01. Vùng trồng: nơi khởi nguồn hương vị", img: J.vungTrong, p: "Hành trình bắt đầu tại Tân Cương, Thái Nguyên, vùng đất nổi tiếng với truyền thống trồng và chế biến chè lâu đời. Những đồi chè trải dài trên các sườn đồi là nơi nuôi dưỡng những búp chè chất lượng. Nhờ điều kiện tự nhiên phù hợp cùng kinh nghiệm canh tác tích lũy qua nhiều thế hệ, trà Tân Cương được biết đến với hương thơm tự nhiên, vị chát dịu và hậu ngọt đặc trưng." },
      { h: "02. Thu hái: sự tỉ mỉ của người làm trà", img: J.thuHai, p: "Khi búp chè đạt độ non thích hợp, người dân bắt đầu thu hái. Từng búp được lựa chọn cẩn thận để đảm bảo độ tươi trước khi đưa vào chế biến. Thu hái không đơn thuần là một hoạt động sản xuất mà còn thể hiện sự khéo léo và kinh nghiệm của người dân địa phương, góp phần giữ hương vị tự nhiên của lá chè." },
      { h: "03. Chế biến: gìn giữ hương vị truyền thống", img: J.cheBien, p: "Búp chè tươi trải qua các công đoạn làm héo, diệt men, vò và sấy khô tùy theo từng loại trà. Đây là giai đoạn đòi hỏi kiểm soát chặt nhiệt độ, thời gian và kỹ thuật để giữ được màu nước, hương thơm và vị trà. Kinh nghiệm làm trà truyền thống kết hợp với thiết bị chế biến hiện đại giúp chất lượng trà ổn định giữa các mẻ." },
      { h: "04. Đóng gói: khi truyền thống gặp hiện đại", p: "Sau khi chế biến, trà được bảo quản và đóng gói để hạn chế tác động của độ ẩm, ánh sáng và các yếu tố bên ngoài. Với Lam Trà, bao bì không chỉ bảo vệ trà mà còn là nơi kể câu chuyện thương hiệu, với thiết kế lấy cảm hứng từ thiên nhiên và văn hóa Việt Nam. Lam Trà dự kiến gắn mã QR trên bao bì, giúp bạn tìm hiểu về vùng trà, cách pha và những câu chuyện văn hóa gắn với sản phẩm." },
      { h: "05. Thưởng trà: khi hành trình trở thành trải nghiệm", img: J.thuongTra, p: "Hành trình khép lại khi lá trà khô được đánh thức bằng dòng nước nóng, lan tỏa hương thơm và tạo nên sắc nước đặc trưng. Trong văn hóa Việt, thưởng trà gắn với những lúc sum họp gia đình, tiếp đón bạn bè hay phút thư giãn sau một ngày làm việc. Một tách trà ấm có thể trở thành cầu nối giữa các thế hệ." },
      { p: "Từ Tân Cương đến khoảnh khắc thưởng thức, mỗi công đoạn đều mang dấu ấn của thiên nhiên, con người và sự tận tâm. Lam Trà mong góp phần gìn giữ giá trị trà truyền thống, đồng thời đưa trà Việt đến gần hơn với nhịp sống hiện đại." },
    ],
  },
  {
    slug: "uong-tra-hay-thuong-tra",
    title: "Uống trà hay thưởng trà?",
    excerpt: "Một ly trà mát lạnh giúp bạn giải khát trong ngày nắng. Nhưng nếu dành thêm một chút thời gian, thức uống quen thuộc này còn mở ra nhiều điều hơn.",
    date: "2026-10-19", ph: "/assets/journey/uong-tra.webp", readMin: 2, related: ["tra-moc-cau", "tra-non-tom"],
    body: [
      { h: "Uống trà", p: "Là cảm nhận hương vị theo cách gần gũi nhất, khi bạn cần một thức uống yêu thích trong cuộc sống hằng ngày." },
      { h: "Thưởng trà", img: J.rotTra, p: "Là khi bạn bắt đầu quan tâm đến hương thơm, vị trà, nguồn gốc của những búp trà và câu chuyện của những người làm nên sản phẩm." },
      { p: "Đằng sau mỗi sản phẩm trà Việt không chỉ có hương vị, mà còn có vùng đất, con người và những giá trị văn hóa được gìn giữ qua thời gian." },
      { p: "Với Lam Trà, mỗi chén trà có thể mở ra một hành trình khám phá, từ hương vị trên đầu lưỡi đến câu chuyện phía sau sản phẩm. Bởi đôi khi, hiểu thêm về trà cũng là cách để trân trọng hơn những giá trị quen thuộc của Việt Nam." },
      { p: "Còn bạn, lần gần nhất uống trà, bạn chỉ thưởng thức hương vị hay đã từng tò mò về câu chuyện phía sau chén trà ấy?" },
    ],
  },
  {
    slug: "thai-nguyen-noi-huong-tra-ke-chuyen",
    title: "Thái Nguyên: nơi hương trà kể chuyện đất Việt",
    excerpt: "Nhắc đến trà Việt Nam, Thái Nguyên là một trong những vùng đất gắn liền với truyền thống trồng chè và nghệ thuật thưởng trà lâu đời.",
    date: "2026-10-12", ph: "/assets/bg/tea-hill-thai-nguyen.webp", readMin: 3, related: ["tra-moc-cau", "dinh-thuong-hang"],
    body: [
      { p: "Nơi đây không chỉ được biết đến bởi những đồi chè xanh mướt, mà còn bởi hương vị trà mang nét riêng, được tạo nên từ điều kiện tự nhiên và kinh nghiệm của những người làm trà." },
      { h: "Điều gì tạo nên nét riêng của trà Thái Nguyên?", img: J.vungTrong, p: "Từ thổ nhưỡng, khí hậu đến giống chè và cách chăm sóc, thu hái, chế biến, mỗi yếu tố đều góp phần hình thành đặc điểm của trà. Đặc biệt, quá trình chế biến đòi hỏi sự tỉ mỉ và kinh nghiệm để giữ được đặc tính riêng của lá chè, tạo nên hương thơm, màu nước và vị trà đặc trưng." },
      { img: J.thuHai, p: "Đằng sau mỗi mẻ trà là sự cần mẫn của người trồng chè, những người gắn bó với từng luống chè, chăm chút cây chè qua từng mùa vụ và góp phần gìn giữ nghề làm trà truyền thống." },
      { h: "Với Lam Trà, trà Thái Nguyên không chỉ là một thức uống", p: "Đó còn là câu chuyện về vùng đất, con người và những giá trị văn hóa được lưu giữ qua nhiều thế hệ. Vì vậy, Lam Trà chọn trà Thái Nguyên làm dòng sản phẩm chủ lực, mang những sản phẩm có nguồn gốc rõ ràng đến gần hơn với người tiêu dùng hiện đại, đồng thời giúp câu chuyện phía sau mỗi sản phẩm được biết đến rộng rãi hơn." },
      { p: "Khi hiểu thêm về nguồn gốc và cách làm nên một sản phẩm trà, mỗi tách trà không chỉ mang đến phút giây thưởng thức mà còn mở ra cơ hội khám phá những giá trị của trà Việt." },
    ],
  },
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
