"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, ProductImage } from "@/components/ds";
import { CATEGORIES, photo } from "@/lib/products";

/**
 * Dải "Chọn theo gu trà": hiện 4 thẻ một lượt trên màn lớn (2 trên tablet, hơn 1 thẻ trên điện thoại),
 * các danh mục còn lại trượt sang bằng cặp mũi tên + chấm chỉ báo bên dưới. Cuộn tay/vuốt vẫn dùng được.
 */
export default function CategoryRail() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [pages, setPages] = useState(1);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (!clientWidth) return;
      const n = Math.max(1, Math.ceil((scrollWidth - 2) / clientWidth));
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;
      setPages(n);
      setActive(atEnd ? n - 1 : Math.min(n - 1, Math.round(scrollLeft / clientWidth)));
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, []);

  // Không truyền behavior: trình duyệt theo CSS scroll-behavior (mượt; tắt khi người dùng giảm chuyển động)
  const goTo = (left: number) => trackRef.current?.scrollTo({ left });

  const goToIndex = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (window.innerWidth < 640 && children[index]) {
      goTo(children[index].offsetLeft);
    } else {
      goTo(index * el.clientWidth);
    }
  };

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;

    if (dir > 0 && el.scrollLeft >= max - 4) return goTo(0); // hết dải → quay về đầu
    if (dir < 0 && el.scrollLeft <= 4) return goTo(max); // đầu dải → ra cuối

    const children = Array.from(el.children) as HTMLElement[];
    const currentLeft = el.scrollLeft;

    if (window.innerWidth < 640 && children.length > 0) {
      if (dir > 0) {
        const next = children.find((c) => c.offsetLeft > currentLeft + 12);
        if (next) return goTo(next.offsetLeft);
      } else {
        const prevItems = children.filter((c) => c.offsetLeft < currentLeft - 12);
        if (prevItems.length > 0) {
          return goTo(prevItems[prevItems.length - 1].offsetLeft);
        }
      }
    }

    goTo(el.scrollLeft + dir * el.clientWidth);
  };

  return (
    <>
      <ul ref={trackRef} className="lt-cat-track">
        {CATEGORIES.map((c) => (
          <li key={c.slug} className="lt-cat-item">
            <Link href={`/san-pham?danh-muc=${c.slug}`} className="lt-card" style={{ position: "relative", display: "block", borderRadius: 6, overflow: "hidden", textDecoration: "none" }}>
              <span className="lt-card-photo" style={{ display: "block" }}>
                <ProductImage src={photo(c.ph)} alt="" ratio="4 / 3" />
              </span>
              <span style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(25,36,26,.82) 0%, rgba(25,36,26,.1) 60%)" }} />
              <span style={{ position: "absolute", left: 18, right: 18, bottom: 16, display: "flex", flexDirection: "column", gap: 4, color: "var(--logo-cream)" }}>
                <span
                  style={{
                    fontSize: "clamp(21px, 2vw, 25px)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {c.name}
                  <Icon name="arrow-right" size={16} />
                </span>
                <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--reu-100)" }}>{c.desc}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <div className="lt-cat-pager">
          <button type="button" className="lt-cat-arrow" aria-label="Nhóm trà trước" onClick={() => step(-1)}>
            <Icon name="arrow-left" size={18} />
          </button>
          <div className="lt-cat-dots">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                className="lt-cat-dot"
                aria-label={`Nhóm ${i + 1} trên ${pages}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goToIndex(i)}
              />
            ))}
          </div>
          <button type="button" className="lt-cat-arrow" aria-label="Nhóm trà tiếp theo" onClick={() => step(1)}>
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      )}
    </>
  );
}
