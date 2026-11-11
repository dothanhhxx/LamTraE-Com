"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ds";
import { POSTS } from "@/lib/posts";
import { photo } from "@/lib/products";

export type TalkItem = {
  slug: string;
  tag: string;
};

// Các bài Trà đàm tiêu biểu: từ câu chuyện Festival, nghệ thuật pha trà, bảo quản đến văn hóa và hồ sơ xuất xứ
export const FEATURED_TALKS: TalkItem[] = [
  { slug: "lam-tra-tai-festival-tra-quoc-te-thai-nguyen", tag: "Festival Trà Quốc tế" },
  { slug: "cach-pha-tra-thai-nguyen", tag: "Góc pha trà" },
  { slug: "bao-quan-tra-xanh", tag: "Giữ hương trà" },
  { slug: "mot-am-tra-pha-duoc-bao-nhieu-lan", tag: "Hỏi đáp thưởng trà" },
  { slug: "chen-tra-dau-cau-chuyen", tag: "Văn hóa Việt" },
  { slug: "minh-bach-nguon-goc-an-tam-chat-luong", tag: "Hồ sơ chứng nhận" },
];

/**
 * Dải trượt bài viết "Trà đàm":
 * - Mobile: Trượt ngang (scroll snap), hiện 1 thẻ chính và hé lộ 15% thẻ kế tiếp để báo hiệu cuộn ngang.
 * - Tablet/Desktop: Hiển thị 2 - 3 thẻ dàn đều, có nút điều hướng mũi tên và chấm chỉ báo đồng bộ với "Chọn theo gu trà".
 */
export default function TalkRail({ items = FEATURED_TALKS }: { items?: TalkItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [pages, setPages] = useState(1);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (!clientWidth) return;

      const children = Array.from(el.children) as HTMLElement[];
      const totalItems = children.length;
      if (totalItems === 0) return;

      const isMobile = window.innerWidth < 640;
      const maxScroll = Math.max(0, scrollWidth - clientWidth);
      const atEnd = scrollLeft >= maxScroll - 4;

      // Trên mobile: mỗi thẻ là 1 vị trí chấm; trên màn lớn: theo số trang cuộn
      const totalPages = isMobile ? totalItems : Math.max(1, Math.ceil(maxScroll / clientWidth) + 1);
      setPages(totalPages);

      if (atEnd) {
        setActive(totalPages - 1);
        return;
      }

      if (isMobile) {
        let closestIdx = 0;
        let minDiff = Infinity;
        children.forEach((child, idx) => {
          const diff = Math.abs(child.offsetLeft - scrollLeft);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });
        setActive(closestIdx);
      } else {
        const pageIdx = Math.min(totalPages - 1, Math.round(scrollLeft / clientWidth));
        setActive(pageIdx);
      }
    };

    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [items]);

  // Cuộn mượt theo CSS scroll-behavior
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

    // Vòng lặp: hết dải → quay về đầu; đầu dải → chuyển đến cuối
    if (dir > 0 && el.scrollLeft >= max - 6) return goTo(0);
    if (dir < 0 && el.scrollLeft <= 6) return goTo(max);

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

  const talkPosts = items
    .map(({ slug, tag }) => {
      const post = POSTS.find((p) => p.slug === slug);
      if (!post) return null;
      return { ...post, tag };
    })
    .filter(Boolean) as (typeof POSTS[number] & { tag: string })[];

  return (
    <div className="lt-talk-rail-wrapper">
      <ul ref={trackRef} className="lt-talk-track" aria-label="Danh sách bài viết Trà đàm">
        {talkPosts.map((p) => (
          <li key={p.slug} className="lt-talk-item">
            <Link href={`/tra-dam/${p.slug}`} className="lt-talk-card">
              <span className="lt-talk-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo(p.ph)} alt="" loading="lazy" decoding="async" />
                <span className="lt-talk-tag">
                  <Icon name="leaf" size={14} />
                  {p.tag}
                </span>
              </span>
              <span className="lt-talk-body">
                <span className="lt-talk-meta">
                  <Icon name="clock" size={14} />
                  {p.readMin} phút đọc
                </span>
                <span className="lt-talk-title">{p.title}</span>
                <span className="lt-talk-excerpt">{p.excerpt}</span>
                <span className="lt-talk-more">
                  Đọc thêm
                  <Icon name="arrow-right" size={16} />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <div className="lt-talk-pager" aria-label="Điều hướng bài viết Trà đàm">
          <button
            type="button"
            className="lt-talk-arrow"
            aria-label="Bài viết trước"
            onClick={() => step(-1)}
          >
            <Icon name="arrow-left" size={18} />
          </button>
          <div className="lt-talk-dots" role="tablist" aria-label="Chỉ báo vị trí bài viết">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                className="lt-talk-dot"
                aria-label={`Bài ${i + 1} trên ${pages}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goToIndex(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="lt-talk-arrow"
            aria-label="Bài viết tiếp theo"
            onClick={() => step(1)}
          >
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

