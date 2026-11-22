import type { Metadata } from "next";
import { DigitalTechPage } from "@/components/info/DigitalTechPage";

export const metadata: Metadata = {
  title: "Công nghệ số Lam Trà · Trải nghiệm 360° & Truy xuất minh bạch",
  description:
    "Ứng dụng công nghệ số trong trải nghiệm không gian 360° đồi chè và xưởng chế biến, cẩm nang QR video và Trợ lý AI tư vấn trà Tân Cương 24/7.",
  openGraph: { images: ["/assets/pano/xuong-poster-wide.webp"] },
};

export default function DigitalTechRoute() {
  return <DigitalTechPage />;
}
