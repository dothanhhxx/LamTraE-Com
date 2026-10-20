import type { Metadata } from "next";
import { Suspense } from "react";
import ProductGrid from "@/components/catalog/ProductGrid";
import { PageHeader } from "@/components/shell/PageHeader";
import { ProductApiService } from "@/services/products.api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tất cả trà",
  description: "Trà xanh Móc Câu, Nõn Tôm, trà sen Đinh Sen, Đinh Thượng Hạng và hộp quà biếu từ Tân Cương, Thái Nguyên.",
};

export default async function CatalogPage() {
  const products = await ProductApiService.getAllProducts(false);

  return (
    <>
      <PageHeader title="Trà Lam Trà" eyebrow="Tân Cương · Thái Nguyên" crumbs={[{ label: "Sản phẩm" }]} />
      <Suspense>
        <ProductGrid initialProducts={products} />
      </Suspense>
    </>
  );
}
