"use client";

import { useState, useId, useEffect } from "react";
import { Icon } from "@/components/ds";
import { postJSON } from "@/lib/api";
import { SITE, zaloLink } from "@/lib/site";

export interface SubjectOption {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export const SUBJECT_OPTIONS: SubjectOption[] = [
  {
    id: "chon-tra",
    title: "Tư vấn chọn dòng trà phù hợp",
    desc: "Tìm đúng gu: Móc Câu đậm đà, Nõn Tôm thanh ngọt hay Đinh Ngọc hảo hạng.",
    icon: "leaf",
  },
  {
    id: "pha-tra",
    title: "Hướng dẫn pha và bảo quản trà",
    desc: "Nhiệt độ nước, dụng cụ hãm và mẹo giữ trọn sắc nước cùng hương cốm non.",
    icon: "droplet",
  },
  {
    id: "qua-tang",
    title: "Trao đổi nhu cầu đặt hàng, quà tặng",
    desc: "Thiết kế set hộp quà biếu Tết, quà sự kiện doanh nghiệp với chiết khấu tốt.",
    icon: "gift",
  },
  {
    id: "hop-tac",
    title: "Tiếp nhận góp ý và đề xuất hợp tác",
    desc: "Chào đón đối tác mở đại lý, phân phối hoặc cung cấp trà cho nhà hàng, trà quán.",
    icon: "building-2",
  },
  {
    id: "khac",
    title: "Chủ đề khác...",
    desc: "Mọi thắc mắc và câu hỏi khác cần đội ngũ chuyên viên Lam Trà hỗ trợ.",
    icon: "message-circle",
  },
];

export function ConsultationForm() {
  const formId = useId();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: SUBJECT_OPTIONS[0].title,
    message: "",
    website: "", // Honeypot spam trap
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<string>();

  useEffect(() => {
    if (!pickerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPickerOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [pickerOpen]);

  const selectedOption =
    SUBJECT_OPTIONS.find((s) => s.title === formData.subject) || SUBJECT_OPTIONS[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      nextErrors.name = "Vui lòng nhập họ và tên.";
    }
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone) {
      nextErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!/^[0-9+() -]{9,15}$/.test(cleanPhone)) {
      nextErrors.phone = "Số điện thoại chưa đúng.";
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Email chưa đúng định dạng.";
    }
    if (!formData.message.trim()) {
      nextErrors.message = "Vui lòng nhập nội dung tin nhắn.";
    } else if (formData.message.trim().length < 5) {
      nextErrors.message = "Nội dung tối thiểu 5 ký tự.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setBusy(true);
    setFailure(undefined);

    try {
      const res = await postJSON("/api/contact", {
        type: "lien-he",
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        message: `[Chủ đề: ${formData.subject}]\n\n${formData.message.trim()}`,
        website: formData.website,
      });

      setBusy(false);

      if (res.ok) {
        setSent(true);
      } else {
        if (res.errors) {
          setErrors(res.errors);
        } else {
          setFailure(res.error || "Chưa gửi được tin nhắn, bạn vui lòng thử lại hoặc liên hệ qua Zalo nhé.");
        }
      }
    } catch {
      setBusy(false);
      setFailure("Có lỗi kết nối. Bạn vui lòng nhắn Zalo hoặc gọi Hotline để được hỗ trợ tức thì.");
    }
  };

  const handleComposeEmail = () => {
    if (!validate()) return;

    // Direct mailto link generation
    const emailSubject = encodeURIComponent(`[Lam Trà - Tư vấn] ${formData.subject} - ${formData.name}`);
    const emailBody = encodeURIComponent(
      `Chào Lam Trà,\n\n` +
      `Tôi muốn gửi lời nhắn / yêu cầu tư vấn với thông tin sau:\n` +
      `- Họ và tên: ${formData.name}\n` +
      `- Số điện thoại: ${formData.phone}\n` +
      `- Email: ${formData.email || "Không cung cấp"}\n` +
      `- Chủ đề: ${formData.subject}\n\n` +
      `Nội dung tin nhắn:\n${formData.message}\n\n` +
      `Trân trọng!`
    );

    // Also send in background to system database so inquiry is safely captured
    handleSubmit();

    // Trigger user's mail client
    window.location.href = `mailto:${SITE.email}?subject=${emailSubject}&body=${emailBody}`;
  };

  if (sent) {
    return (
      <div
        className="lt-consultation-card"
        style={{
          background: "#0E261B",
          border: "1.5px solid rgba(188, 154, 108, 0.4)",
          borderRadius: 20,
          padding: "clamp(24px, 3.5vw, 36px)",
          color: "#FAF8F5",
          boxShadow: "0 20px 44px -12px rgba(8, 24, 16, 0.45)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(188, 154, 108, 0.15)",
            border: "1.5px solid #BC9A6C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#BC9A6C",
          }}
        >
          <Icon name="circle-check" size={28} />
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: "clamp(18px, 2.8vw, 22px)",
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            color: "#D9BF94",
            letterSpacing: "0.03em",
          }}
        >
          Gửi Lời Nhắn Thành Công!
        </h3>

        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "rgba(255, 255, 255, 0.85)", maxWidth: 360 }}>
          Cảm ơn bạn <strong style={{ color: "#FAF8F5" }}>{formData.name}</strong>. Lam Trà đã nhận được thông tin tư vấn và sẽ liên hệ qua <strong style={{ color: "#FAF8F5" }}>{formData.phone}</strong> trong vòng 30 phút.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8, justifyContent: "center" }}>
          <a
            href={zaloLink()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 18px",
              borderRadius: 8,
              background: "#BC9A6C",
              color: "#19241A",
              fontWeight: 600,
              fontSize: 13.5,
              textDecoration: "none",
            }}
          >
            <Icon name="zalo" size={17} />
            Nhắn Zalo tức thì
          </a>

          <button
            type="button"
            onClick={() => {
              setSent(false);
              setFormData({
                name: "",
                phone: "",
                email: "",
                subject: SUBJECT_OPTIONS[0].title,
                message: "",
                website: "",
              });
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              borderRadius: 8,
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#FAF8F5",
              fontWeight: 500,
              fontSize: 13.5,
              cursor: "pointer",
            }}
          >
            Gửi tin nhắn khác
          </button>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 44,
    padding: "0 13px",
    fontFamily: "var(--font-ui)",
    fontSize: 14,
    color: "#FAF8F5",
    background: "#081912",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <>
      <div
        className="lt-consultation-card"
        style={{
          background: "#0E261B",
          border: "1.5px solid rgba(188, 154, 108, 0.35)",
          borderRadius: 20,
          padding: "clamp(18px, 3.2vw, 30px)",
          color: "#FAF8F5",
          boxShadow: "0 20px 44px -12px rgba(8, 24, 16, 0.45)",
          position: "relative",
        }}
      >
        <h2
          id={`${formId}-title`}
          style={{
            margin: "0 0 14px",
            textAlign: "center",
            fontSize: "clamp(16.5px, 2.4vw, 20px)",
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            color: "#D9BF94",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            lineHeight: 1.3,
          }}
        >
          Nhập thông tin đăng ký tư vấn
        </h2>

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Row 1: Name & Phone (Dàn ngang 2 cột) */}
          <div className="lt-form-row-2">
            {/* Name input */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <label htmlFor={`${formId}-name`} style={{ position: "absolute", left: -9999, opacity: 0 }}>
                Họ và tên của bạn
              </label>
              <input
                id={`${formId}-name`}
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Họ và tên *"
                aria-invalid={!!errors.name}
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? "var(--danger)" : "rgba(255, 255, 255, 0.2)",
                }}
              />
              {errors.name && <span role="alert" style={{ fontSize: 11.5, color: "#FFA199", paddingLeft: 2 }}>{errors.name}</span>}
            </div>

            {/* Phone input */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <label htmlFor={`${formId}-phone`} style={{ position: "absolute", left: -9999, opacity: 0 }}>
                Số điện thoại
              </label>
              <input
                id={`${formId}-phone`}
                name="phone"
                type="tel"
                inputMode="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Số điện thoại *"
                aria-invalid={!!errors.phone}
                style={{
                  ...inputStyle,
                  borderColor: errors.phone ? "var(--danger)" : "rgba(255, 255, 255, 0.2)",
                }}
              />
              {errors.phone && <span role="alert" style={{ fontSize: 11.5, color: "#FFA199", paddingLeft: 2 }}>{errors.phone}</span>}
            </div>
          </div>

          {/* Row 2: Email & Subject Trigger Button (Dàn ngang 2 cột) */}
          <div className="lt-form-row-2">
            {/* Email input (optional) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <label htmlFor={`${formId}-email`} style={{ position: "absolute", left: -9999, opacity: 0 }}>
                Email của bạn (không bắt buộc)
              </label>
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email (không bắt buộc)"
                aria-invalid={!!errors.email}
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? "var(--danger)" : "rgba(255, 255, 255, 0.2)",
                }}
              />
              {errors.email && <span role="alert" style={{ fontSize: 11.5, color: "#FFA199", paddingLeft: 2 }}>{errors.email}</span>}
            </div>

            {/* Custom Subject Selector Trigger (Không dùng select mặc định gây thô) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <label htmlFor={`${formId}-subject`} style={{ position: "absolute", left: -9999, opacity: 0 }}>
                Chủ đề liên hệ
              </label>
              <button
                id={`${formId}-subject`}
                type="button"
                onClick={() => setPickerOpen(true)}
                className="lt-subject-trigger"
                aria-haspopup="dialog"
                aria-expanded={pickerOpen}
                title="Bấm để chọn chủ đề tư vấn"
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, overflow: "hidden" }}>
                  <span style={{ color: "#BC9A6C", display: "flex", flexShrink: 0 }}>
                    <Icon name={selectedOption.icon} size={15} />
                  </span>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#FAF8F5",
                      fontWeight: 500,
                    }}
                  >
                    {formData.subject}
                  </span>
                </div>
                <span style={{ color: "#BC9A6C", display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <Icon name="chevron-down" size={15} />
                </span>
              </button>
            </div>
          </div>

          {/* Message textarea (compact rows) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <label htmlFor={`${formId}-message`} style={{ position: "absolute", left: -9999, opacity: 0 }}>
              Nội dung tin nhắn
            </label>
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={3}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Nội dung bạn cần Lam Trà tư vấn hoặc hỗ trợ *"
              aria-invalid={!!errors.message}
              style={{
                ...inputStyle,
                minHeight: 82,
                padding: "10px 14px",
                resize: "vertical",
                borderColor: errors.message ? "var(--danger)" : "rgba(255, 255, 255, 0.2)",
              }}
            />
            {errors.message && <span role="alert" style={{ fontSize: 11.5, color: "#FFA199", paddingLeft: 2 }}>{errors.message}</span>}
          </div>

          {/* Honeypot spam trap */}
          <input
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            name="website"
            value={formData.website}
            onChange={handleChange}
            style={{ position: "absolute", left: -9999, opacity: 0, width: 1, height: 1 }}
          />

          {failure && (
            <div
              role="alert"
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "rgba(166, 64, 47, 0.2)",
                border: "1px solid rgba(166, 64, 47, 0.5)",
                color: "#FFA199",
                fontSize: 12.5,
                lineHeight: 1.45,
              }}
            >
              {failure}
            </div>
          )}

          {/* Action Buttons row - Dàn ngang tối ưu */}
          <div className="lt-form-actions-row" style={{ marginTop: 2 }}>
            <button
              type="submit"
              disabled={busy}
              style={{
                width: "100%",
                minHeight: 46,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: "#BC9A6C",
                color: "#19241A",
                border: 0,
                borderRadius: 8,
                fontSize: 14.5,
                fontWeight: 600,
                cursor: busy ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <span>{busy ? "Đang gửi…" : "Gửi tin tư vấn"}</span>
              {!busy && <Icon name="arrow-right" size={16} />}
            </button>

            <button
              type="button"
              onClick={handleComposeEmail}
              style={{
                background: "transparent",
                border: "1px dashed rgba(188, 154, 108, 0.45)",
                borderRadius: 8,
                color: "#D9BF94",
                fontSize: 13,
                fontWeight: 500,
                padding: "8px 12px",
                minHeight: 46,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
            >
              <Icon name="mail" size={15} />
              <span>Soạn email ↗</span>
            </button>
          </div>

          {/* Footnote text */}
          <p
            style={{
              margin: "2px 0 0",
              textAlign: "center",
              fontSize: 11.5,
              lineHeight: 1.45,
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            Thông tin được bảo mật · Phản hồi trong 30 phút
          </p>
        </form>
      </div>

      {/* BẢNG LỰA CHỌN CHỦ ĐỀ DÀN NGANG MÀN HÌNH (Đồng bộ thiết kế Lam Trà) */}
      {pickerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="subject-sheet-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Backdrop mờ tối sang trọng */}
          <div
            onClick={() => setPickerOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10, 24, 16, 0.72)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* Khung bảng chọn dàn ngang màn hình */}
          <div
            className="lt-subject-sheet"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 580,
              maxHeight: "85vh",
              background: "#0E261B",
              borderTop: "2.5px solid #BC9A6C",
              borderLeft: "1.5px solid rgba(188, 154, 108, 0.35)",
              borderRight: "1.5px solid rgba(188, 154, 108, 0.35)",
              borderRadius: "24px 24px 0 0",
              boxShadow: "0 -16px 40px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              fontFamily: "var(--font-ui)",
              color: "#FAF8F5",
              animation: "lt-sheet-up 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Thanh kéo trang trí phong cách app hiện đại */}
            <div style={{ paddingTop: 10, paddingBottom: 4, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 44, height: 4, borderRadius: 999, background: "rgba(188, 154, 108, 0.45)" }} />
            </div>

            {/* Header của bảng */}
            <div
              style={{
                padding: "12px 20px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(188, 154, 108, 0.25)",
              }}
            >
              <div>
                <h3
                  id="subject-sheet-title"
                  style={{
                    margin: 0,
                    fontSize: 16.5,
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    color: "#D9BF94",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Chọn chủ đề cần tư vấn
                </h3>
                <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "rgba(255, 255, 255, 0.65)" }}>
                  Lam Trà sẵn sàng chuẩn bị tài liệu và hỗ trợ bạn chu đáo nhất
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Đóng bảng chọn"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "1px solid rgba(188, 154, 108, 0.35)",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#D9BF94",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "background 0.2s ease",
                }}
              >
                <Icon name="x" size={17} />
              </button>
            </div>

            {/* Danh sách 5 lựa chọn dàn ngang tràn viền */}
            <div
              style={{
                padding: "16px 16px 28px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {SUBJECT_OPTIONS.map((opt) => {
                const isSelected = formData.subject === opt.title;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, subject: opt.title }));
                      setPickerOpen(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "13px 15px",
                      borderRadius: 14,
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      background: isSelected ? "rgba(188, 154, 108, 0.16)" : "#081912",
                      border: isSelected ? "1.5px solid #BC9A6C" : "1px solid rgba(188, 154, 108, 0.22)",
                      boxShadow: isSelected ? "0 4px 18px -2px rgba(188, 154, 108, 0.3)" : "none",
                      transition: "all 0.18s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
                      <span
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: isSelected ? "#BC9A6C" : "rgba(188, 154, 108, 0.16)",
                          color: isSelected ? "#19241A" : "#BC9A6C",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        <Icon name={opt.icon} size={18} />
                      </span>

                      <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: 14.5,
                            fontWeight: isSelected ? 700 : 600,
                            color: isSelected ? "#FAF8F5" : "#E8DFC8",
                            lineHeight: 1.3,
                          }}
                        >
                          {opt.title}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: isSelected ? "#D9BF94" : "rgba(255, 255, 255, 0.6)",
                            lineHeight: 1.45,
                          }}
                        >
                          {opt.desc}
                        </span>
                      </div>
                    </div>

                    {/* Radio checkmark */}
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        border: isSelected ? "1.8px solid #BC9A6C" : "1.5px solid rgba(255, 255, 255, 0.3)",
                        background: isSelected ? "#BC9A6C" : "transparent",
                        color: "#19241A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
