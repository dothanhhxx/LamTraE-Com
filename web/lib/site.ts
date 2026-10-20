// Thông tin cửa hàng dùng chung (footer, liên hệ, nút Zalo, VietQR, pháp lý).
// TODO: thay số điện thoại, Zalo, tài khoản ngân hàng, thông tin doanh nghiệp và link mạng xã hội thật trước khi chạy chính thức.
export const SITE = {
  name: "Lam Trà",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Trọn vị trà Việt, trọn tấm lòng trao gửi.",
  address: "Xã Tân Cương, tỉnh Thái Nguyên",
  phone: "0900 000 000",
  zalo: "0900000000",
  email: "xinchao@lamtra.vn",
  hours: "8:00 – 21:00 · Thứ 2 – Chủ nhật",
  facebook: "https://facebook.com/",
  tiktok: "https://tiktok.com/",
  /** Tài khoản nhận chuyển khoản VietQR. bankId là mã ngân hàng theo danh sách của VietQR (VCB, TCB, MB, ACB…). */
  bank: { bankId: "VCB", bankName: "Vietcombank", account: "0000000000", holder: "LAM TRA" },
  /** Thông tin bắt buộc với website thương mại điện tử tại Việt Nam (Nghị định 52/2013, 85/2021). */
  legal: {
    company: "Hộ kinh doanh Lam Trà",
    taxCode: "0000000000",
    license: "Giấy chứng nhận đăng ký hộ kinh doanh số 00000000 do UBND xã Tân Cương cấp",
    representative: "Người đại diện: (điền tên)",
    /** Link hồ sơ trên online.gov.vn sau khi được duyệt thông báo website */
    moitUrl: "",
  },
};

export const zaloLink = () => `https://zalo.me/${SITE.zalo}`;
export const telLink = () => `tel:${SITE.phone.replace(/\s/g, "")}`;

export const NAV = [
  { label: "Trà xanh", href: "/san-pham?danh-muc=tra-xanh" },
  { label: "Trà sen", href: "/san-pham?danh-muc=tra-sen" },
  { label: "Thượng hạng", href: "/san-pham?danh-muc=thuong-hang" },
  { label: "Quà biếu", href: "/qua-bieu" },
  { label: "Trà đàm", href: "/tra-dam" },
  { label: "Câu chuyện", href: "/cau-chuyen" },
];

export function vietQrImage(amount: number, info: string) {
  const { bankId, account, holder } = SITE.bank;
  const q = new URLSearchParams({ amount: String(amount), addInfo: info, accountName: holder });
  return `https://img.vietqr.io/image/${bankId}-${account}-compact2.png?${q}`;
}
