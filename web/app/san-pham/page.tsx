import type { Metadata } from "next";
import { Suspense } from "react";
import ProductGrid from "@/components/catalog/ProductGrid";
import { PageHeader } from "@/components/shell/PageHeader";

export const metadata: Metadata = {
  title: "Tất cả trà",
  description: "Trà xanh Móc Câu, Nõn Tôm, trà sen Đinh Sen, Đinh Thượng Hạng và hộp quà biếu từ Tân Cương, Thái Nguyên.",
};

export default function CatalogPage() {
  return (
    <>
      <PageHeader title="Trà Lam Trà" eyebrow="Tân Cương · Thái Nguyên" crumbs={[{ label: "Sản phẩm" }]} />
      <Suspense>
        <ProductGrid />
      </Suspense>
    </>
  );
}
