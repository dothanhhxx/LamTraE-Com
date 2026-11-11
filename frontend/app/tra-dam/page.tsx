import type { Metadata } from "next";
import Link from "next/link";
import { ProductImage, SectionTitle } from "@/components/ds";
import { PageHeader } from "@/components/shell/PageHeader";
import TalkRail from "@/components/landing/TalkRail";
import { POSTS, formatDate } from "@/lib/posts";
import { photo } from "@/lib/products";

export const metadata: Metadata = { title: "Trà đàm", description: "Kiến thức trà Việt từ Lam Trà: cách pha, phân biệt các loại trà Thái Nguyên, bảo quản trà." };

export default function BlogPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader title="Trà đàm" eyebrow="Chuyện trà" crumbs={[{ label: "Trà đàm" }]} desc="Những điều Lam Trà học được sau nhiều năm làm trà: pha sao cho ngon, chọn sao cho đúng, giữ sao cho lâu." />
      <div className="lt-container" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <section style={{ marginBottom: 56 }}>
          <SectionTitle eyebrow="Nổi bật" title="Chủ đề đáng chú ý" />
          <TalkRail />
        </section>

        <SectionTitle eyebrow="Kho lưu trữ" title="Tất cả bài viết" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "36px 24px" }}>
          {posts.map((p) => (
            <article key={p.slug} className="lt-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href={`/tra-dam/${p.slug}`} className="lt-card-photo" style={{ display: "block", borderRadius: 8, overflow: "hidden" }} aria-label={p.title}>
                <ProductImage src={photo(p.ph)} alt="" ratio="16 / 10" />
              </Link>
              <span style={{ fontSize: 12.5, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                {formatDate(p.date)} · {p.readMin} phút đọc
              </span>
              <h2 style={{ margin: 0, fontSize: 19, lineHeight: 1.35, fontWeight: 600 }}>
                <Link href={`/tra-dam/${p.slug}`} className="lt-card-name" style={{ color: "var(--text-strong)", textDecoration: "none" }}>{p.title}</Link>
              </h2>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-body)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
