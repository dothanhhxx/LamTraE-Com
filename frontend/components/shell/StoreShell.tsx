"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Toast } from "@/components/ds";
import { CartProvider, useCart } from "@/lib/cart";
import { zaloLink } from "@/lib/site";
import ChatWidget from "./ChatWidget";
import Footer from "./Footer";
import Header from "./Header";

function ShellToast() {
  const { toast, dismissToast } = useCart();
  return <Toast message={toast?.message ?? null} onClose={dismissToast} action={toast?.action} />;
}

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Trang quản trị có layout AdminShell riêng biệt, không hiển thị header/footer của khách
  if (pathname.startsWith("/quan-tri")) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FFFFFF", color: "var(--text-body)", fontFamily: "var(--font-ui)" }}>
        <Header />
        <main className="lt-page-bg" style={{ flex: 1 }}>{children}</main>
        <Footer />
      </div>
      <div className="lt-fab">
        <a href={zaloLink()} target="_blank" rel="noopener noreferrer" className="lt-fab-btn lt-zalo" aria-label="Chat Zalo với Lam Trà" title="Chat Zalo">
          <Icon name="zalo-mark" size={30} />
        </a>
        <ChatWidget />
      </div>
      <ShellToast />
    </CartProvider>
  );
}
