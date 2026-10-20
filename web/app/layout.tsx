import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lam Trà – Trọn vị trà Việt, trọn tấm lòng trao gửi",
  description: "Trà Tân Cương, Thái Nguyên: Móc Câu, Nõn Tôm, Đinh Sen, Đinh Thượng Hạng và hộp quà biếu.",
  icons: { icon: "/assets/lam-tra-emblem.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
