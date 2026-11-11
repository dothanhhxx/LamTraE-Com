"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Icon, IconButton, OptionPicker, Price, ProductImage, Rating, SectionTitle } from "@/components/ds";
import StoryBox from "@/components/landing/StoryBox";
import { BuyCard } from "@/components/catalog/BuyCard";
import { useCart } from "@/lib/cart";
import { DEFAULT_GRADE, DEFAULT_SIZE, GRADE_OPTIONS, PRODUCTS as STATIC_TEAS, SIZE_OPTIONS, photo, priceOf, variantLabel, type Product } from "@/lib/products";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Landing({ products }: { products?: Product[] } = {}) {
  const TEAS = products && products.length > 0 ? products : STATIC_TEAS;
  const router = useRouter();
  const { add } = useCart();
  const [idx, setIdx] = useState(0);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [grade, setGrade] = useState(DEFAULT_GRADE);
  const [added, setAdded] = useState(false);
  const [fading, setFading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [w, setW] = useState(1280);
  const stageRef = useRef<HTMLElement>(null);
  const t1 = useRef<ReturnType<typeof setTimeout>>(undefined);
  const t2 = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    const t0 = setTimeout(() => setLoaded(true), 60);
    TEAS.forEach((t) => {
      const i = new Image();
      i.src = photo(t.ph);
    });
    return () => {
      window.removeEventListener("resize", onResize);
      [t0, t1.current, t2.current].forEach(clearTimeout);
    };
  }, []);

  const scrollToStage = () => {
    const el = stageRef.current;
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
  };

  const pick = (i: number) => {
    const n = (i + TEAS.length) % TEAS.length;
    if (n === idx) return;
    clearTimeout(t1.current);
    setFading(true);
    setAdded(false);
    t1.current = setTimeout(() => {
      setIdx(n);
      setFading(false);
    }, 160);
  };

  const go = (i: number | null) => (e?: MouseEvent) => {
    e?.preventDefault();
    if (i != null) pick(i);
    scrollToStage();
  };

  const addToCart = () => {
    clearTimeout(t2.current);
    add(tea.slug, size, grade);
    setAdded(true);
    t2.current = setTimeout(() => setAdded(false), 2200);
  };
  const buyNow = () => {
    if (add(tea.slug, size, grade)) router.push("/gio-hang");
  };

  const safeIdx = Math.min(idx, Math.max(0, TEAS.length - 1));
  const tea = TEAS[safeIdx] || TEAS[0];
  const isDesktop = w >= 1000;
  const mobile = w < 720;
  const price = tea ? priceOf(tea, size, grade) : 0;

  const trust = [
    { icon: "leaf", a: "Búp chè Tân Cương", b: "hái tay sáng sớm" },
    { icon: "scale", a: "Rõ khối lượng", b: "và phân hạng" },
    { icon: "qr-code", a: "Thanh toán VietQR", b: "hoặc COD" },
  ];

  return (
    <div>
      {/* Mở đầu trang chủ bằng Câu chuyện Lam Trà (.lt-story-open) */}
      <section className="lt-story-open lt-hero-poster" aria-labelledby="trang-chu-title">
        <div
          className="lt-container lt-story-open-inner"
          style={{
            minHeight: mobile ? "clamp(580px, 90vh, 740px)" : "min(760px, 84vh, 46vw)",
            justifyContent: "center",
            paddingTop: mobile ? "clamp(28px, 6vw, 44px)" : 64,
            paddingBottom: mobile ? "clamp(32px, 6vw, 48px)" : 64,
            opacity: loaded ? 1 : 0,
            transform: `translateY(${loaded ? "0px" : "8px"})`,
            transition: "opacity 600ms cubic-bezier(.2,.7,.2,1),transform 600ms cubic-bezier(.2,.7,.2,1)",
          }}
        >
          <span className="lt-story-open-eyebrow">Tân Cương · Thái Nguyên · Câu chuyện Lam Trà</span>
          <h1
            id="trang-chu-title"
            style={{
              margin: 0,
              fontSize: mobile ? "clamp(32px, 8.2vw, 46px)" : "clamp(40px, 4.8vw, 62px)",
              lineHeight: 1.15,
              fontWeight: 700,
              letterSpacing: "0.01em",
              fontFamily: "var(--font-display)",
              color: "var(--logo-cream)",
              textShadow: "0 2px 14px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9)",
              textWrap: "balance",
            }}
          >
            Trọn vị trà Việt,
            <br />
            <span>trọn tấm lòng trao gửi.</span>
          </h1>
          <p
            style={{
              maxWidth: 540,
              margin: 0,
              fontSize: mobile ? 14.5 : 16,
              lineHeight: 1.6,
              color: "var(--reu-100)",
              textShadow: "0 1px 6px rgba(0,0,0,0.85)",
            }}
          >
            Từ một ấm trà mỗi sáng bên đồi chè Tân Cương, đến món quà trao tay khắp mọi miền. Búp chè hái sáng sớm, sao tay trên chảo gang, ghi rõ khối lượng và phân hạng trong từng gói trà.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: mobile ? "10px 12px" : "12px 24px", marginTop: 10 }}>
            <a href="#tra-noi-bat" onClick={go(null)} className="lt-hero-cta-btn">
              <span>Chọn trà ngay</span>
              <Icon name="arrow-right" size={17} />
            </a>
            <a href="#khoi-nguon" className={mobile ? "lt-hero-sec-link" : "lt-gift-link"}>
              <Icon name="book-open" size={17} />
              <span>Đọc câu chuyện</span>
            </a>
            <a href="#tra-noi-bat" onClick={go(TEAS.findIndex((t) => t.category === "qua-tang"))} className={mobile ? "lt-hero-sec-link" : "lt-gift-link"}>
              <Icon name="gift" size={17} />
              <span>Xem hộp quà biếu</span>
            </a>
          </div>
          <div className="lt-hero-trust-bar">
            {trust.map((t) => (
              <div key={t.icon} className="lt-hero-trust-item">
                <span className="lt-hero-trust-icon">
                  <Icon name={t.icon} size={16} />
                </span>
                <span className="lt-hero-trust-text">
                  <strong>{t.a}</strong>
                  <span>{t.b}</span>
                </span>
              </div>
            ))}
          </div>
          <a href="#khoi-nguon" className="lt-story-open-down" aria-label="Cuộn xuống đọc câu chuyện Lam Trà">
            <Icon name="chevron-down" size={20} />
          </a>
        </div>
      </section>

      {/* Câu chuyện vùng đất Tân Cương ngay sau phần mở đầu trang chủ */}
      <StoryBox />

      {/* Khung chọn Trà nổi bật đặt ngay sau phần Câu chuyện */}
      <section
        id="tra-noi-bat"
        aria-labelledby="tra-noi-bat-heading"
        ref={stageRef}
        style={{
          position: "relative",
          zIndex: 2,
          padding: "clamp(40px,5vw,64px) clamp(12px,3vw,40px)",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <SectionTitle
            id="tra-noi-bat-heading"
            eyebrow="Từ câu chuyện đến chén trà"
            title="Trà nổi bật của Lam Trà"
            action={<Link href="/san-pham" style={{ fontSize: 14 }}>Tất cả sản phẩm</Link>}
          />
          {mobile ? (
            <div className="lt-buy-grid" style={{ marginTop: 16 }}>
              {TEAS.slice(0, 6).map((t) => (
                <BuyCard key={t.slug} p={t} />
              ))}
            </div>
          ) : (
            <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-hairline)", borderRadius: 10, boxShadow: "var(--shadow-lg)", overflow: "hidden", display: "flex", flexWrap: "wrap" }}>
              <div style={{ flex: "0 0 220px", padding: "16px 12px", background: "var(--logo-green)", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--tra-300)", padding: "4px 10px 12px" }}>Trà nổi bật</div>
                {TEAS.map((t, i) => (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => pick(i)}
                    className={i === idx ? "lt-tea-item" : "lt-tea-item lt-tea-idle"}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 6,
                      border: "1px solid " + (i === idx ? "rgba(188,154,108,.7)" : "rgba(253,237,216,.1)"),
                      background: i === idx ? "rgba(188,154,108,.16)" : undefined,
                      color: "var(--logo-cream)", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                      transition: "background 200ms,border-color 200ms",
                    }}
                  >
                    <span style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 4, backgroundImage: `url('${photo(t.ph)}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                    <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                      <span style={{ fontSize: 11, color: "var(--tra-300)", fontVariantNumeric: "tabular-nums" }}>{pad(i + 1)}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.25 }}>{t.name}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ flex: "999 1 420px", minWidth: 0, padding: "clamp(12px,1.6vw,20px)", display: "flex" }}>
                <div style={{ position: "relative", flex: 1, alignSelf: isDesktop ? "stretch" : "flex-start", opacity: fading ? 0 : 1, transition: "opacity 200ms cubic-bezier(.2,.7,.2,1)" }}>
                  <div style={{ position: "relative", height: "100%", minHeight: 420, borderRadius: 6, overflow: "hidden", background: "var(--surface-photo)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo(tea.ph)} alt={tea.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <span style={{ position: "absolute", left: 14, top: 14, padding: "6px 12px", borderRadius: 999, background: "rgba(252,248,241,.88)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", fontSize: 12, color: "var(--text-strong)", whiteSpace: "nowrap" }}>
                    {tea.origin}
                  </span>
                  <div style={{ position: "absolute", right: 14, bottom: 14, display: "flex", gap: 8 }}>
                    <IconButton icon="chevron-left" label="Trà trước" variant="surface" onClick={() => pick(idx - 1)} />
                    <IconButton icon="chevron-right" label="Trà tiếp theo" variant="surface" onClick={() => pick(idx + 1)} />
                  </div>
                </div>
              </div>

              <div style={{ flex: "1 1 320px", minWidth: 0, padding: "clamp(20px,2.4vw,32px) clamp(20px,2.4vw,32px) clamp(20px,2.4vw,28px) clamp(20px,1vw,12px)", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 500, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>
                    {pad(idx + 1)} / {pad(TEAS.length)} · {tea.kind}
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "clamp(26px, 2.6vw, 34px)",
                      lineHeight: 1.16,
                      fontWeight: 600,
                      letterSpacing: "0.015em",
                      fontFamily: "var(--font-display)",
                      color: "var(--text-strong)",
                    }}
                  >
                    <Link href={`/san-pham/${tea.slug}`} className="lt-card-name" style={{ color: "inherit", textDecoration: "none" }}>{tea.name}</Link>
                  </h3>
                  <div style={{ fontSize: 15, color: "var(--tra-500)" }}>{tea.note}</div>
                  <Rating value={tea.rating} count={tea.reviews} />
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-body)", textWrap: "pretty" }}>{tea.desc}</p>
                {tea.fixed ? (
                  <div style={{ padding: "14px 16px", border: "1px solid var(--border-hairline)", borderRadius: 6, background: "var(--bg-page)", fontSize: 13, lineHeight: 1.55, color: "var(--text-body)" }}>
                    Bộ quà gói sẵn trong hộp sơn mài. Bạn ghi lời nhắn ở bước đặt hàng, Lam Trà sẽ viết tay vào thiệp.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <OptionPicker label="Khối lượng" options={SIZE_OPTIONS} value={size} onChange={(v) => { setSize(v); setAdded(false); }} />
                    <OptionPicker label="Phân hạng" options={GRADE_OPTIONS} value={grade} onChange={(v) => { setGrade(v); setAdded(false); }} />
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, paddingTop: 16, borderTop: "1px solid var(--border-hairline)", marginTop: "auto" }}>
                  <Price value={price} compareAt={tea.compareAt && size === DEFAULT_SIZE && grade === DEFAULT_GRADE ? tea.compareAt : undefined} size="lg" />
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{variantLabel(tea, size, grade)}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ flex: "1 1 150px", minWidth: 0 }}>
                    <Button variant="secondary" fullWidth iconLeft={added ? "check" : "shopping-bag"} onClick={addToCart}>
                      {added ? "Đã thêm" : "Thêm vào giỏ"}
                    </Button>
                  </div>
                  <div style={{ flex: "1 1 150px", minWidth: 0 }}>
                    <Button fullWidth iconRight="arrow-right" onClick={buyNow}>
                      Mua ngay
                    </Button>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Thanh toán VietQR hoặc COD · Lam Trà xác nhận qua Zalo trong 30 phút</div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
