import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/catalog/ProductDetail";
import { Breadcrumbs } from "@/components/shell/PageHeader";
import { PRODUCTS, getCategory, getProduct, photo } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return { title: p.name, description: p.desc, openGraph: { images: [photo(p.ph)] } };
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const crumbs = [
    { label: "Sản phẩm", href: "/san-pham" },
    ...(cat ? [{ label: cat.name, href: `/san-pham?danh-muc=${cat.slug}` }] : []),
    { label: p.name },
  ];
  return (
    <>
      <div className="lt-container" style={{ paddingTop: 24, paddingBottom: 8 }}>
        <Breadcrumbs crumbs={crumbs} />
      </div>
      <ProductDetail product={p} />
    </>
  );
}
