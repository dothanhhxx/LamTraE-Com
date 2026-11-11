import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shell/PageHeader";
import { ContactHeroSection } from "@/components/info/ContactHeroSection";
import { VisitTeaRegionSection } from "@/components/info/VisitTeaRegionSection";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên hệ & Tư vấn chọn trà",
  description: `Gửi lời nhắn cho Lam Trà hoặc đăng ký tư vấn chọn trà: Hotline/Zalo ${SITE.phone}, email ${SITE.email}. Địa chỉ xưởng ${SITE.address}.`,
};

export default function ContactPage() {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Top Breadcrumb Navigation */}
      <div className="lt-container" style={{ paddingTop: "clamp(16px, 2.5vw, 24px)", paddingBottom: 8 }}>
        <Breadcrumbs crumbs={[{ label: "Liên hệ" }]} />
      </div>

      {/* Main Contact & Consultation Section matching Image 1 */}
      <ContactHeroSection />

      {/* Tea Hill Visit & Map Section matching bottom of Image 1 */}
      <VisitTeaRegionSection />
    </div>
  );
}
