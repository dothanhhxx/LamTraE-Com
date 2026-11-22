"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Icon } from "@/components/ds";
import { TeaFieldPanorama } from "@/components/info/TeaFieldPanorama";
import { SITE } from "@/lib/site";

type ChatMsg = { role: "user" | "assistant"; content: string; at: string };

const TECH_CARDS = [
  {
    id: "card-360",
    target: "#khong-gian-360",
    title: "KHÔNG GIAN 360°",
    subtitle: "Nguồn gốc & quy trình thực tế",
    desc: "Quan sát 360° đồi chè VietGAP, xưởng sao chế biến và phòng kiểm định chất lượng.",
    icon: "compass",
  },
  {
    id: "card-qr",
    target: "#qr-ai-video",
    title: "QR & VIDEO HÀNH TRÌNH",
    subtitle: "Kể chuyện di sản",
    desc: "Tái hiện câu chuyện làng nghề Tân Cương qua trải nghiệm video và cẩm nang pha trà.",
    icon: "qr",
  },
  {
    id: "card-ai",
    target: "#chatbot-ai",
    title: "CHATBOT AI",
    subtitle: "Tư vấn 24/7",
    desc: "Hỗ trợ khách hàng chọn trà hợp gu, hướng dẫn cách pha và truy xuất nguồn gốc.",
    icon: "bot",
  },
  {
    id: "card-trace",
    target: "#truy-xuat-nguon-goc",
    title: "TRUY XUẤT",
    subtitle: "Kết nối minh bạch",
    desc: "Đưa hồ sơ chứng nhận VietGAP, ATTP và thông tin sản phẩm đến gần hơn với người dùng.",
    icon: "scan",
  },
] as const;

const AI_QUICK_PROMPTS = [
  { label: "Tư vấn sản phẩm", prompt: "Tư vấn giúp mình chọn loại trà Lam Trà phù hợp để uống hằng ngày và biếu tặng." },
  { label: "Hướng dẫn pha trà", prompt: "Hướng dẫn mình cách pha trà Tân Cương Thái Nguyên xanh nước, ngọt hậu." },
  { label: "Câu chuyện trà", prompt: "Kể cho mình nghe về vùng nguyên liệu đồi chè Tân Cương và quy trình chế biến của Lam Trà." },
];

const nowTime = () => new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

function TechBadgeIcon({ kind }: { kind: (typeof TECH_CARDS)[number]["icon"] }) {
  if (kind === "compass") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" />
        <path d="M12 3v18" opacity="0.55" />
      </svg>
    );
  }
  if (kind === "qr") {
    return <Icon name="qr-code" size={21} />;
  }
  if (kind === "bot") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="3" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
    </svg>
  );
}

export function DigitalTechPage() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: "Xin chào! Mình là trợ lý Lam Trà. Bạn cần tư vấn chọn trà hay hướng dẫn cách pha trà?",
      at: "00:41",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  async function askAi(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    const next: ChatMsg[] = [...msgs, { role: "user", content: q, at: nowTime() }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }, 30);

    let reply = "Lam Trà chưa trả lời được lúc này. Bạn thử lại sau ít phút nhé.";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(1).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.reply || data.error) reply = data.reply || data.error;
    } catch {
      reply = "Mạng đang chập chờn. Bạn kiểm tra kết nối rồi gửi lại nhé.";
    }

    setMsgs((prev) => [...prev, { role: "assistant", content: reply, at: nowTime() }]);
    setBusy(false);
    setTimeout(() => {
      chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }

  function resetChat() {
    setMsgs([
      {
        role: "assistant",
        content: "Xin chào! Mình là trợ lý Lam Trà. Bạn cần tư vấn chọn trà hay hướng dẫn cách pha trà?",
        at: nowTime(),
      },
    ]);
  }

  return (
    <div className="lt-tech-page">
      {/* 1. HERO: ỨNG DỤNG CÔNG NGHỆ + 4 THẺ TRỤ CỘT */}
      <section className="lt-tech-hero" aria-labelledby="cong-nghe-title">
        <div className="lt-container">
          <div className="lt-tech-hero-head">
            <div className="lt-tech-eyebrow">
              <span>ỨNG DỤNG CÔNG NGHỆ</span>
              <span className="lt-tech-eyebrow-line" aria-hidden="true" />
            </div>
            <h1 id="cong-nghe-title" className="lt-tech-main-title">
              CÔNG NGHỆ <span>LAM TRÀ</span>
            </h1>
            <p className="lt-tech-main-lead">
              Ứng dụng công nghệ trong trải nghiệm 360°, quản lý chất lượng và kể chuyện Trà Tân Cương —
              để mỗi chén trà không chỉ ngon mà còn minh bạch, gần gũi và giàu giá trị văn hóa.
            </p>
          </div>

          <div className="lt-tech-pillars-grid">
            {TECH_CARDS.map((c) => (
              <a key={c.id} href={c.target} className="lt-tech-pillar-card">
                <span className="lt-tech-pillar-ring" aria-hidden="true">
                  <TechBadgeIcon kind={c.icon} />
                </span>
                <h2>{c.title}</h2>
                <strong>{c.subtitle}</strong>
                <p>{c.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 2. KHÔNG GIAN 360° LAM TRÀ (3 điểm chính: Nguồn gốc tự nhiên · Quy trình chế biến · Trải nghiệm minh bạch) */}
      <TeaFieldPanorama defaultScene="nguon-goc" id="khong-gian-360" />

      {/* 3. DẢI NỀN XANH ĐẬM: QR & VIDEO HÀNH TRÌNH (KỂ CHUYỆN TỪ NÔNG ĐỒI) */}
      <section id="qr-ai-video" className="lt-tech-video-band" aria-labelledby="qr-video-title">
        {/* Đường vân đồi chè trang trí hai góc như mẫu Tân Trà */}
        <svg className="lt-tech-wave lt-tech-wave-left" viewBox="0 0 420 220" fill="none" aria-hidden="true">
          <path d="M-40 20C60 30 120 110 220 130C320 150 370 90 420 60" stroke="currentColor" strokeWidth="1.2" />
          <path d="M-40 55C50 65 115 140 215 160C315 180 365 125 420 95" stroke="currentColor" strokeWidth="1.2" />
          <path d="M-40 90C40 100 110 170 210 190C310 210 360 160 420 130" stroke="currentColor" strokeWidth="1.2" />
          <path d="M-40 125C30 135 105 200 205 220" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <svg className="lt-tech-wave lt-tech-wave-right" viewBox="0 0 420 220" fill="none" aria-hidden="true">
          <path d="M460 20C360 30 300 110 200 130C100 150 50 90 0 60" stroke="currentColor" strokeWidth="1.2" />
          <path d="M460 55C370 65 305 140 205 160C105 180 55 125 0 95" stroke="currentColor" strokeWidth="1.2" />
          <path d="M460 90C380 100 310 170 210 190C110 210 60 160 0 130" stroke="currentColor" strokeWidth="1.2" />
        </svg>

        <div className="lt-container lt-tech-video-grid">
          <Link href="/huong-dan" className="lt-tech-video-frame" aria-label="Mở Cẩm nang video & đồng hồ pha trà QR">
            <span className="lt-tech-video-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/journey/thu-hai.webp"
                alt="Thu hái búp chè non sáng sớm trên đồi chè Tân Cương, Thái Nguyên"
                loading="lazy"
                decoding="async"
              />
              <span className="lt-tech-video-play" aria-hidden="true">
                <Icon name="play" size={20} />
              </span>
            </span>
          </Link>

          <div className="lt-tech-video-copy">
            <div className="lt-tech-eyebrow is-on-dark">
              <span>KỂ CHUYỆN TỪ NÔNG ĐỒI</span>
              <span className="lt-tech-eyebrow-line" aria-hidden="true" />
            </div>
            <h2 id="qr-video-title" className="lt-tech-video-title">
              QR &amp; VIDEO HÀNH TRÌNH
            </h2>
            <p className="lt-tech-video-sub">Mỗi lá trà đều có một câu chuyện.</p>
            <p className="lt-tech-video-desc">
              Khám phá hành trình của trà Lam Trà — từ nông đồi Tân Cương sương sớm, bàn tay người nghệ nhân sao chè
              trên lửa ấm, đến chén trà trên bàn của bạn. Quét mã QR trên mỗi hộp trà để xem thước phim hướng dẫn và
              bấm giờ pha trà chuẩn vị.
            </p>
            <div className="lt-tech-video-actions">
              <Link href="/huong-dan" className="lt-tech-gold-btn">
                <span>Mở Cẩm nang QR &amp; Video</span>
                <Icon name="arrow-right" size={15} />
              </Link>
              <a
                href={SITE.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="lt-tech-ghost-link"
              >
                <span>Xem trên TikTok</span>
                <Icon name="arrow-right" size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRỢ LÝ TRÀ 24/7 — CHATBOT AI & TRUY XUẤT NGUỒN GỐC */}
      <section id="chatbot-ai" className="lt-tech-ai-section" aria-labelledby="chatbot-ai-title">
        <div className="lt-container">
          <div className="lt-tech-ai-grid">
            {/* Cột trái: Giới thiệu & câu hỏi gợi ý */}
            <div className="lt-tech-ai-copy">
              <div className="lt-tech-eyebrow">
                <span>TRỢ LÝ TRÀ 24/7</span>
                <span className="lt-tech-eyebrow-line" aria-hidden="true" />
              </div>
              <h2 id="chatbot-ai-title" className="lt-tech-ai-title">
                CHATBOT AI
              </h2>
              <p className="lt-tech-ai-sub">Hỏi gì về trà, Lam Trà luôn sẵn sàng.</p>
              <p className="lt-tech-ai-desc">
                Trợ lý AI giúp bạn tìm hiểu về các dòng trà Tân Cương, cách pha trà ngon, bảo quản trà và những câu
                chuyện thú vị về văn hóa trà Việt. Luôn đồng hành cùng bạn, mọi lúc mọi nơi.
              </p>

              <div className="lt-tech-ai-pills" aria-label="Chủ đề gợi ý hỏi nhanh">
                {AI_QUICK_PROMPTS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="lt-tech-ai-pill"
                    onClick={() => void askAi(item.prompt)}
                  >
                    <span className="lt-tech-ai-sparkle" aria-hidden="true">✦</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              <p className="lt-tech-ai-note">Trò chuyện cùng trợ lý AI Lam Trà, không cần đăng nhập.</p>
            </div>

            {/* Cột phải: Mascot Lam Trà + Khung chat AI trực tiếp */}
            <div className="lt-tech-ai-stage">
              <span className="lt-tech-ai-orbit" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/mascot/lam-tra-mascot.svg"
                alt="Linh vật búp trà Lam Trà đội nón lá nâng chén trà"
                className="lt-tech-ai-mascot"
                width={180}
                height={180}
                loading="lazy"
              />

              <div className="lt-tech-chatbox" role="region" aria-label="Khung trò chuyện trực tiếp với Trợ lý Lam Trà">
                <div className="lt-tech-chatbox-head">
                  <div className="lt-tech-chatbox-brand">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/mascot/lam-tra-mascot.svg" alt="" width={32} height={32} />
                    <div>
                      <strong>Trợ lý Lam Trà</strong>
                      <span>
                        <i aria-hidden="true" />
                        Hỏi đáp bằng AI
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="lt-tech-chatbox-reset"
                    onClick={resetChat}
                    aria-label="Làm mới cuộc trò chuyện"
                    title="Làm mới cuộc trò chuyện"
                  >
                    <Icon name="rotate-ccw" size={14} />
                  </button>
                </div>

                <div ref={chatBodyRef} className="lt-tech-chatbox-body">
                  {msgs.map((m, idx) => (
                    <div key={idx} className={`lt-tech-chat-row is-${m.role}`}>
                      {m.role === "assistant" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src="/assets/mascot/lam-tra-mascot.svg"
                          alt=""
                          className="lt-tech-chat-avatar"
                          width={24}
                          height={24}
                        />
                      )}
                      <div className="lt-tech-chat-bubble">
                        <p>{m.content}</p>
                        {m.at && <small>{m.at}</small>}
                      </div>
                    </div>
                  ))}
                  {busy && (
                    <div className="lt-tech-chat-row is-assistant">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/mascot/lam-tra-mascot.svg"
                        alt=""
                        className="lt-tech-chat-avatar"
                        width={24}
                        height={24}
                      />
                      <div className="lt-tech-chat-bubble">
                        <p>Đang pha câu trả lời cho bạn…</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lt-tech-chatbox-chips">
                  <button type="button" onClick={() => void askAi("Tư vấn chọn trà hợp khẩu vị")}>
                    <Icon name="leaf" size={12} />
                    <span>Tư vấn chọn trà</span>
                  </button>
                  <button type="button" onClick={() => void askAi("Hướng dẫn cách pha trà chuẩn nhiệt độ")}>
                    <Icon name="thermometer" size={12} />
                    <span>Hướng dẫn cách pha</span>
                  </button>
                </div>

                <form
                  className="lt-tech-chatbox-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void askAi(input);
                  }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                    aria-label="Nhập câu hỏi cho Trợ lý AI Lam Trà"
                  />
                  <button type="submit" disabled={busy || !input.trim()} aria-label="Gửi câu hỏi">
                    <Icon name="send" size={14} />
                  </button>
                </form>
                <div className="lt-tech-chatbox-foot">Enter để gửi · Shift + Enter xuống dòng</div>
              </div>
            </div>
          </div>

          {/* Thanh phân cách Truy xuất nguồn gốc */}
          <div id="truy-xuat-nguon-goc" className="lt-tech-trace-bar">
            <div className="lt-tech-trace-left">
              <Icon name="qr-code" size={16} />
              <span>Truy xuất nguồn gốc &amp; Hồ sơ chứng nhận VietGAP</span>
            </div>
            <Link href="/chung-nhan" className="lt-tech-trace-link">
              <span>Tìm hiểu hành trình lá trà</span>
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>

          {/* Banner kết: HÀNH TRÌNH CÔNG NGHỆ LAM TRÀ */}
          <div className="lt-tech-closing-card">
            <span className="lt-tech-closing-eyebrow">KHÁM PHÁ THÊM</span>
            <h2>HÀNH TRÌNH CÔNG NGHỆ LAM TRÀ</h2>
            <p>
              Cùng chúng tôi khám phá những câu chuyện, hình ảnh 360° và công nghệ đằng sau mỗi chén trà —
              trên trang chứng nhận hoặc Fanpage chính thức của Lam Trà.
            </p>
            <div className="lt-tech-closing-actions">
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="lt-tech-gold-btn"
              >
                <span>Khám phá ngay trên Facebook</span>
                <Icon name="arrow-right" size={15} />
              </a>
              <Link href="/chung-nhan" className="lt-tech-closing-secondary">
                <span>Xem hồ sơ chứng nhận VietGAP</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
