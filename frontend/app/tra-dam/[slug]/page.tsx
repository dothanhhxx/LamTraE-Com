import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductImage, SectionTitle } from "@/components/ds";
import { TeaGrid } from "@/components/catalog/TeaCard";
import JsonLd from "@/components/shell/JsonLd";
import { Breadcrumbs } from "@/components/shell/PageHeader";
import TalkRail from "@/components/landing/TalkRail";
import { POSTS, FEATURED_TALKS, formatDate, getPost } from "@/lib/posts";
import { getProduct, photo, type Product } from "@/lib/products";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, openGraph: { type: "article", images: [photo(p.ph)] } };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const products = post.related.map(getProduct).filter(Boolean) as Product[];
  return (
    <article>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, datePublished: post.date, image: SITE.url + photo(post.ph), author: { "@type": "Organization", name: SITE.name } }} />
      <div className="lt-container" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumbs crumbs={[{ label: "Trà đàm", href: "/tra-dam" }, { label: post.title }]} />
        <header className="lt-prose" style={{ margin: "32px auto 28px" }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{formatDate(post.date)} · {post.readMin} phút đọc</span>
          <h1 style={{ margin: "10px 0 0", fontSize: "clamp(28px,3.6vw,42px)", lineHeight: 1.2, fontWeight: 500, letterSpacing: "-.01em", color: "var(--text-strong)" }}>{post.title}</h1>
        </header>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <ProductImage src={photo(post.ph)} alt="" ratio="16 / 9" />
        </div>
        <div className="lt-prose" style={{ margin: "40px auto 0" }}>
          <p className="lt-lead">{post.excerpt}</p>
          {post.body.map((b, i) => (
            <div key={i}>
              {b.h && <h2>{b.h}</h2>}
              {b.img && (
                <figure className="lt-figure">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.img.src} alt={b.img.alt} width={b.img.w} height={b.img.h} loading="lazy" decoding="async" />
                  {b.img.caption && <figcaption>{b.img.caption}</figcaption>}
                </figure>
              )}
              {b.gallery && (
                <figure className="lt-gallery" data-n={b.gallery.items.length}>
                  <div className="lt-gallery-grid">
                    {b.gallery.items.map((f) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={f.src} src={f.src} alt={f.alt} width={f.w} height={f.h} loading="lazy" decoding="async" />
                    ))}
                  </div>
                  {b.gallery.caption && <figcaption>{b.gallery.caption}</figcaption>}
                </figure>
              )}
              {b.p && <p>{b.p}</p>}
              {b.list && (
                <ul>
                  {b.list.map((x) => <li key={x}>{x}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
        {products.length > 0 && (
          <section style={{ marginTop: 72 }}>
            <SectionTitle eyebrow="Nhắc đến trong bài" title="Trà để bạn thử" />
            <TeaGrid products={products} />
          </section>
        )}
        <section style={{ marginTop: 72 }}>
          <SectionTitle eyebrow="Trà đàm" title="Chuyện trà tiếp theo" />
          <TalkRail items={FEATURED_TALKS.filter((t) => t.slug !== post.slug)} />
        </section>
      </div>
    </article>
  );
}
