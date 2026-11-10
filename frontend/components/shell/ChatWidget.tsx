"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ds";

type Msg = { role: "user" | "assistant"; content: string; at: string };

const STORE_KEY = "lt-chat";
const MASCOT = "/assets/mascot/lam-tra-mascot.svg";
const GREETING: Msg = {
  role: "assistant",
  content: "Xin chào! Mình là trợ lý Lam Trà. Bạn cần tư vấn chọn trà, hướng dẫn cách pha hay hỏi về giao hàng, thanh toán?",
  at: "",
};
const QUICK = ["Tư vấn chọn trà", "Hướng dẫn cách pha trà", "Chọn trà làm quà biếu", "Phí giao hàng", "Mã giảm giá", "Tra cứu đơn hàng"];

const now = () => new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

/* Hiển thị câu trả lời: **đậm**, [link](/duong-dan), đường dẫn nội bộ trần, và gạch đầu dòng "- ". */
const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\((\/[^)\s]*)\)|(\/(?:san-pham|gio-hang|tra-cuu-don|chinh-sach|lien-he|chung-nhan|tra-dam|hoi-dap)[a-z0-9/-]*)/g;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index}>{m[1]}</strong>);
    else {
      const href = m[3] ?? m[4];
      out.push(<Link key={m.index} href={href}>{m[2] ?? href}</Link>);
    }
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out;
}

function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) blocks.push(<ul key={blocks.length}>{bullets.map((b, i) => <li key={i}>{inline(b)}</li>)}</ul>);
    bullets = [];
  };
  for (const line of lines) {
    const t = line.trim();
    if (/^[-*•]\s+/.test(t)) bullets.push(t.replace(/^[-*•]\s+/, ""));
    else {
      flush();
      if (t) blocks.push(<p key={blocks.length}>{inline(t)}</p>);
    }
  }
  flush();
  return <>{blocks.map((b, i) => <Fragment key={i}>{b}</Fragment>)}</>;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Giữ hội thoại trong phiên duyệt web (đóng tab là mất)
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || "null");
      if (Array.isArray(saved) && saved.length) setMsgs(saved);
    } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(msgs)); } catch {}
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q, at: now() }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    let answer: string;
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING).map(({ role, content }) => ({ role, content })) }),
      });
      const data = await r.json().catch(() => ({}));
      answer = data.reply || data.error || "Lam Trà chưa trả lời được lúc này. Bạn thử lại sau ít phút nhé.";
    } catch {
      answer = "Mạng đang chập chờn. Bạn kiểm tra kết nối rồi gửi lại nhé.";
    }
    setMsgs((m) => [...m, { role: "assistant", content: answer, at: now() }]);
    setBusy(false);
  }

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className="lt-fab-btn lt-chat-launcher"
        aria-expanded={open}
        aria-controls="lt-chat-panel"
        aria-label={open ? "Đóng trợ lý AI Lam Trà" : "Mở trợ lý AI Lam Trà"}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {open ? <Icon name="x" size={24} /> : <img src={MASCOT} alt="" width={50} height={50} />}
        {!open && <span className="lt-chat-launcher-label" aria-hidden>Trợ lý AI Lam Trà</span>}
      </button>

      {open && (
        <section
          id="lt-chat-panel"
          className="lt-chat"
          role="dialog"
          aria-label="Trợ lý Lam Trà"
          onKeyDown={(e) => e.key === "Escape" && close()}
        >
          <header className="lt-chat-head">
            <span className="lt-chat-avatar" aria-hidden>
              <img src={MASCOT} alt="" width={36} height={36} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 className="lt-chat-title">Trợ lý Lam Trà</h2>
              <p className="lt-chat-status"><span className="lt-chat-dot" aria-hidden />Hỏi đáp cùng AI</p>
            </div>
            <button type="button" className="lt-chat-icon" aria-label="Bắt đầu cuộc trò chuyện mới" title="Trò chuyện mới" onClick={() => setMsgs([GREETING])} disabled={busy}>
              <Icon name="rotate-ccw" size={16} />
            </button>
            <button type="button" className="lt-chat-icon" aria-label="Đóng trợ lý" title="Đóng" onClick={close}>
              <Icon name="x" size={18} />
            </button>
          </header>

          <div ref={logRef} className="lt-chat-log" role="log" aria-live="polite" aria-busy={busy}>
            {msgs.map((m, i) => (
              <div key={i} className={`lt-chat-row lt-chat-${m.role}`}>
                {m.role === "assistant" && (
                  <span className="lt-chat-avatar lt-chat-avatar-sm" aria-hidden>
                    <img src={MASCOT} alt="" width={26} height={26} />
                  </span>
                )}
                <div className="lt-chat-bubble">
                  <span className="lt-sr">{m.role === "user" ? "Bạn: " : "Lam Trà: "}</span>
                  <RichText text={m.content} />
                  {m.at && <time className="lt-chat-time">{m.at}</time>}
                </div>
              </div>
            ))}
            {busy && (
              <div className="lt-chat-row lt-chat-assistant">
                <span className="lt-chat-avatar lt-chat-avatar-sm" aria-hidden>
                  <img src={MASCOT} alt="" width={26} height={26} />
                </span>
                <div className="lt-chat-bubble lt-chat-typing" aria-label="Lam Trà đang trả lời">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          <div className="lt-chat-quick" aria-label="Câu hỏi gợi ý">
            {QUICK.map((q) => (
              <button key={q} type="button" onClick={() => send(q)} disabled={busy}>{q}</button>
            ))}
          </div>

          <form
            className="lt-chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="lt-chat-input" className="lt-sr">Câu hỏi của bạn</label>
            <textarea
              id="lt-chat-input"
              ref={inputRef}
              rows={1}
              maxLength={1000}
              value={input}
              placeholder="Nhập câu hỏi của bạn…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <button type="submit" className="lt-chat-send" aria-label="Gửi câu hỏi" disabled={busy || !input.trim()}>
              <Icon name="send" size={18} />
            </button>
          </form>
          <p className="lt-chat-hint">Enter để gửi · Shift + Enter để xuống dòng</p>
        </section>
      )}
    </>
  );
}
