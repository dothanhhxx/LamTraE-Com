"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, Icon } from "@/components/ds";
import { fold } from "@/lib/text";
import type { Category, Product, Spec } from "@/shared";
import { CATEGORIES, OCCASIONS, PURPOSES, photo } from "@/lib/products";

const DEFAULT_SPECS: Spec[] = [
  { label: "Vùng trồng", value: "Tân Cương, Thái Nguyên" },
  { label: "Mùa hái", value: "Vụ xuân, tháng 3 – 5" },
  { label: "Chế biến", value: "Sao tay chảo gang truyền thống" },
  { label: "Hương vị", value: "Hương cốm non dịu, tiền chát hậu ngọt sâu" },
  { label: "Màu nước", value: "Xanh vàng trong, sánh" },
  { label: "Hạn dùng", value: "12 tháng kể từ ngày đóng gói" },
  { label: "Bảo quản", value: "Giữ trong túi zip hoặc hũ kín, để nơi khô mát" },
];

export type ImageItem = {
  id: string;
  url: string;
  alt?: string;
};

const SAMPLE_PHOTOS = [
  { value: "moccau", label: "Trà Móc Câu Tân Cương" },
  { value: "nontom", label: "Trà Nõn Tôm Thượng Phẩm" },
  { value: "sen", label: "Trà Đinh Sen Tây Hồ" },
  { value: "dinhth", label: "Trà Đinh Thượng Hạng" },
  { value: "hopqua", label: "Hộp quà biếu cao cấp" },
  { value: "/assets/products/tra-thanh-nhiet-duong-tam-1.webp", label: "Trà Dưỡng Tâm Thanh Nhiệt" },
  { value: "hero", label: "Đồi chè Tân Cương nắng sớm" },
];

export function ProductEditModal({
  product,
  open,
  onClose,
  onSaved,
}: {
  product: Product | null; // null = tạo mới, có object = chỉnh sửa
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEditing = !!product;

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("tra-xanh");
  const [kind, setKind] = useState("Trà xanh");
  const [note, setNote] = useState("");
  const [base, setBase] = useState<number | string>(180000);
  const [compareAt, setCompareAt] = useState<number | string>("");
  const [fixed, setFixed] = useState(false);
  const [origin, setOrigin] = useState("Tân Cương · Thái Nguyên");
  const [desc, setDesc] = useState("");
  const [active, setActive] = useState(true);

  // Gallery Images List: index 0 is primary (ph), rest are gallery
  const [images, setImages] = useState<ImageItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [lightboxZoomed, setLightboxZoomed] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mobile Touch Drag & Drop states
  const [touchDragIndex, setTouchDragIndex] = useState<number | null>(null);
  const [touchOverIndex, setTouchOverIndex] = useState<number | null>(null);
  const touchStateRef = useRef<{
    startIndex: number;
    currentIndex: number;
    active: boolean;
  }>({ startIndex: -1, currentIndex: -1, active: false });

  // Lightbox mobile touch swipe
  const [lightboxTouchStartX, setLightboxTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // File upload state & dropzone
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const [isDropOver, setIsDropOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [showSamplePicker, setShowSamplePicker] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState("");

  // Brew guide
  const [temp, setTemp] = useState("80 – 85°C");
  const [amount, setAmount] = useState("5g cho ấm 150ml");
  const [time, setTime] = useState("Tráng trà, hãm 20 – 30 giây");
  const [infusions, setInfusions] = useState("4 – 5 nước");
  const [tip, setTip] = useState("Không dùng nước sôi già để giữ hương cốm non.");

  // Purposes & Occasions
  const [purposes, setPurposes] = useState<string[]>(["hang-ngay"]);
  const [occasions, setOccasions] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Initialize data on open / product change
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setSlug(product.slug || "");
      setCategory(product.category || "tra-xanh");
      setKind(product.kind || "Trà xanh");
      setNote(product.note || "");
      setBase(product.base || 0);
      setCompareAt(product.compareAt || "");
      setFixed(!!product.fixed);
      setOrigin(product.origin || "Tân Cương · Thái Nguyên");
      setDesc(product.desc || "");
      setActive(product.active !== false);

      // Rebuild image list
      const list: ImageItem[] = [];
      if (product.ph) {
        list.push({ id: `img-main-${Date.now()}`, url: product.ph, alt: product.name });
      }
      if (Array.isArray(product.gallery)) {
        product.gallery.forEach((g, idx) => {
          if (g.ph && g.ph !== product.ph) {
            list.push({ id: `img-gal-${idx}-${Date.now()}`, url: g.ph, alt: g.alt || `${product.name} ảnh ${idx + 2}` });
          }
        });
      }
      if (list.length === 0) {
        list.push({ id: `img-def-${Date.now()}`, url: "moccau", alt: product.name });
      }
      setImages(list);

      if (product.brew) {
        setTemp(product.brew.temp || "");
        setAmount(product.brew.amount || "");
        setTime(product.brew.time || "");
        setInfusions(product.brew.infusions || "");
        setTip(product.brew.tip || "");
      }
      setPurposes(product.purposes || ["hang-ngay"]);
      setOccasions(product.occasions || []);
    } else {
      // New product defaults
      setName("");
      setSlug("");
      setCategory("tra-xanh");
      setKind("Trà xanh");
      setNote("");
      setBase(200000);
      setCompareAt("");
      setFixed(false);
      setOrigin("Tân Cương · Thái Nguyên");
      setDesc("");
      setActive(true);
      setImages([{ id: `img-new-0`, url: "moccau", alt: "Ảnh sản phẩm mới" }]);
      setTemp("80 – 85°C");
      setAmount("5g cho ấm 150ml");
      setTime("Tráng trà, hãm 25 giây");
      setInfusions("4 – 5 nước");
      setTip("Nước sau tăng thêm 10 giây hãm.");
      setPurposes(["hang-ngay"]);
      setOccasions([]);
    }
    setError(null);
    setSuccessNotice(null);
    setShowSamplePicker(false);
    setPreviewIndex(null);
  }, [product, open]);

  // Lightbox keyboard navigation (Esc, ArrowLeft, ArrowRight) with capture-phase isolation
  useEffect(() => {
    if (previewIndex === null) {
      setLightboxZoomed(false);
      setCopiedUrl(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setPreviewIndex(null);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPreviewIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPreviewIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [previewIndex, images.length]);

  // Generate slug automatically from name
  const handleGenerateSlug = (text = name) => {
    const generated = fold(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && (!slug || slug === fold(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""))) {
      handleGenerateSlug(val);
    }
  };

  // ─── BATCH IMAGE UPLOAD (Max 10 images / batch) ───
  const processBatchUpload = async (files: FileList | File[]) => {
    const rawFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (rawFiles.length === 0) {
      setError("Vui lòng chọn ít nhất một tệp định dạng hình ảnh (JPG, PNG, WebP...).");
      return;
    }

    if (rawFiles.length > 10) {
      setError("Hệ thống chỉ nhận tối đa 10 ảnh mỗi lần tải. 10 ảnh đầu tiên đang được xử lý.");
    } else {
      setError(null);
    }

    const filesToUpload = rawFiles.slice(0, 10);
    setUploading(true);
    setUploadProgress({ current: 0, total: filesToUpload.length });

    const newItems: ImageItem[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      setUploadProgress({ current: i + 1, total: filesToUpload.length });

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json().catch(() => ({ ok: false }));
        if (data.ok && data.url) {
          newItems.push({
            id: `upload_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
            url: data.url,
            alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          });
        } else {
          // Fallback to Data URL for instant preview if backend storage is offline
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve((e.target?.result as string) || "");
            reader.readAsDataURL(file);
          });
          if (dataUrl) {
            newItems.push({
              id: `data_${Date.now()}_${i}`,
              url: dataUrl,
              alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
            });
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải ảnh:", file.name, err);
      }
    }

    if (newItems.length > 0) {
      setImages((prev) => {
        // If current images only has 1 placeholder, replace it
        if (prev.length === 1 && prev[0].url === "moccau" && !isEditing) {
          return newItems;
        }
        return [...prev, ...newItems];
      });
      setSuccessNotice(`Đã thêm thành công ${newItems.length} ảnh mới.`);
      setTimeout(() => setSuccessNotice(null), 3000);
    }

    setUploading(false);
    setUploadProgress(null);
    if (multiFileInputRef.current) {
      multiFileInputRef.current.value = "";
    }
  };

  // Dropzone drag events
  const handleDropzoneOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropOver(true);
  };

  const handleDropzoneLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropOver(false);
  };

  const handleDropzoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processBatchUpload(e.dataTransfer.files);
    }
  };

  // ─── DRAG & DROP REORDERING OF EXISTING IMAGES ───
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const updated = [...images];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, moved);
    setImages(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // ─── TOUCH DRAG & DROP FOR MOBILE TOUCHSCREENS ───
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    touchStateRef.current = { startIndex: index, currentIndex: index, active: true };
    setTouchDragIndex(index);
    setTouchOverIndex(index);
    if (typeof window !== "undefined" && window.navigator && "vibrate" in window.navigator) {
      try {
        window.navigator.vibrate(30);
      } catch {}
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStateRef.current.active) return;
    const touch = e.touches[0];
    if (!touch) return;
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = elem?.closest("[data-image-index]");
    if (card) {
      const idxStr = card.getAttribute("data-image-index");
      if (idxStr !== null) {
        const overIdx = parseInt(idxStr, 10);
        if (!isNaN(overIdx) && overIdx !== touchStateRef.current.currentIndex) {
          touchStateRef.current.currentIndex = overIdx;
          setTouchOverIndex(overIdx);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStateRef.current.active) return;
    const { startIndex, currentIndex } = touchStateRef.current;
    if (startIndex !== -1 && currentIndex !== -1 && startIndex !== currentIndex) {
      setImages((prev) => {
        const updated = [...prev];
        const [moved] = updated.splice(startIndex, 1);
        updated.splice(currentIndex, 0, moved);
        return updated;
      });
      setSuccessNotice(`Đã đổi vị trí ảnh #${startIndex + 1} sang #${currentIndex + 1}.`);
      setTimeout(() => setSuccessNotice(null), 2500);
      if (typeof window !== "undefined" && window.navigator && "vibrate" in window.navigator) {
        try {
          window.navigator.vibrate(20);
        } catch {}
      }
    }
    touchStateRef.current = { startIndex: -1, currentIndex: -1, active: false };
    setTouchDragIndex(null);
    setTouchOverIndex(null);
  };

  const handleTouchCancel = () => {
    touchStateRef.current = { startIndex: -1, currentIndex: -1, active: false };
    setTouchDragIndex(null);
    setTouchOverIndex(null);
  };

  // Catch touch releases outside the handle
  useEffect(() => {
    if (touchDragIndex === null) return;
    const onGlobalTouchEnd = () => handleTouchEnd();
    const onGlobalTouchCancel = () => handleTouchCancel();
    window.addEventListener("touchend", onGlobalTouchEnd);
    window.addEventListener("touchcancel", onGlobalTouchCancel);
    return () => {
      window.removeEventListener("touchend", onGlobalTouchEnd);
      window.removeEventListener("touchcancel", onGlobalTouchCancel);
    };
  }, [touchDragIndex]);

  // Lightbox touch swipe handlers
  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    setLightboxTouchStartX(e.touches[0].clientX);
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (lightboxTouchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - lightboxTouchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // Swipe Right -> Ảnh trước
        setPreviewIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      } else {
        // Swipe Left -> Ảnh kế tiếp
        setPreviewIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      }
    }
    setLightboxTouchStartX(null);
  };

  // Fast reorder / action controls
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [item] = updated.splice(index, 1);
    updated.unshift(item);
    setImages(updated);
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const updated = [...images];
    const tempItem = updated[index];
    updated[index] = updated[target];
    updated[target] = tempItem;
    setImages(updated);
  };

  const handleDeleteImage = (index: number) => {
    if (images.length <= 1) {
      if (confirm("Đây là ảnh duy nhất của sản phẩm. Bạn có chắc muốn xóa không?")) {
        setImages([]);
      }
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSample = (sampleUrl: string, sampleLabel: string) => {
    setImages((prev) => [
      ...prev,
      {
        id: `sample_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        url: sampleUrl,
        alt: sampleLabel,
      },
    ]);
    setShowSamplePicker(false);
  };

  const handleAddCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setImages((prev) => [
      ...prev,
      {
        id: `url_${Date.now()}`,
        url: customUrlInput.trim(),
        alt: name.trim() || "Ảnh sản phẩm",
      },
    ]);
    setCustomUrlInput("");
  };

  // Toggle helpers
  const handlePurposeToggle = (val: string) => {
    setPurposes((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));
  };

  const handleOccasionToggle = (val: string) => {
    setOccasions((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (!slug.trim()) {
      setError("Vui lòng nhập mã đường dẫn (slug).");
      return;
    }
    const numBase = Number(base);
    if (isNaN(numBase) || numBase <= 0) {
      setError("Giá bán cơ sở phải là số lớn hơn 0.");
      return;
    }

    if (images.length === 0) {
      setError("Vui lòng thêm ít nhất 1 ảnh đại diện cho sản phẩm.");
      return;
    }

    const primaryPhoto = images[0].url;
    const galleryPhotos = images.slice(1).map((img, i) => ({
      ph: img.url,
      alt: img.alt || `${name.trim()} ảnh ${i + 2}`,
    }));

    setSaving(true);
    try {
      const payload: Partial<Product> & { currentSlug?: string } = {
        name: name.trim(),
        slug: slug.trim(),
        category,
        kind: kind.trim() || "Trà xanh",
        note: note.trim(),
        base: numBase,
        compareAt: compareAt ? Number(compareAt) : undefined,
        fixed,
        origin: origin.trim(),
        ph: primaryPhoto,
        gallery: galleryPhotos,
        desc: desc.trim(),
        active,
        purposes: purposes as Product["purposes"],
        occasions: occasions as Product["occasions"],
        brew: { temp, amount, time, infusions, tip },
        specs: product?.specs?.length ? product.specs : DEFAULT_SPECS,
      };

      let res: Response;
      if (isEditing) {
        payload.currentSlug = product.slug;
        res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Có lỗi xảy ra khi lưu sản phẩm.");
        setSaving(false);
        return;
      }

      onSaved();
      onClose();
    } catch {
      setError("Lỗi kết nối máy chủ khi lưu sản phẩm.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? `Chỉnh sửa: ${product.name}` : "Thêm sản phẩm trà mới"}
      maxWidth="min(1180px, 95vw)"
      maxHeight="92vh"
    >
      <form onSubmit={handleSubmit} className="lt-admin-modal-form">
        {/* Alerts */}
        {error && (
          <div style={{ padding: "12px 16px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {successNotice && (
          <div style={{ padding: "10px 16px", borderRadius: 8, background: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <span>✓</span>
            <span>{successNotice}</span>
          </div>
        )}

        {/* ─── 2-COLUMN LUXURY ADMIN MODAL LAYOUT ─── */}
        <div className="lt-admin-modal-layout">
          {/* ════════════ LEFT COLUMN: PRODUCT ESSENTIALS ════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* 1. Định danh sản phẩm */}
            <div className="lt-admin-form-section">
              <h3 className="lt-admin-form-section-title">
                <Icon name="package" size={17} color="var(--reu-600)" />
                <span>1. Định danh sản phẩm</span>
              </h3>

              <div className="lt-admin-grid-2">
                <div>
                  <label className="lt-admin-label">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Trà Đinh Ngọc Thượng Đỉnh"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="lt-admin-input"
                  />
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <label className="lt-admin-label" style={{ margin: 0 }}>Mã đường dẫn (Slug) *</label>
                    <button
                      type="button"
                      onClick={() => handleGenerateSlug()}
                      style={{ fontSize: 11, color: "var(--tra-500, #94723F)", background: "transparent", border: 0, cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}
                    >
                      Tạo lại slug
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="VD: tra-dinh-ngoc"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="lt-admin-input"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    style={{ background: "var(--paper-50, #FCF8F1)" }}
                  />
                </div>
              </div>

              <div className="lt-admin-grid-3">
                <div>
                  <label className="lt-admin-label">Danh mục trà</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      const c = CATEGORIES.find((x) => x.slug === e.target.value);
                      if (c) setKind(c.name);
                    }}
                    className="lt-admin-input"
                    style={{ cursor: "pointer" }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="lt-admin-label">Tên loại trà</label>
                  <input
                    type="text"
                    placeholder="VD: Trà xanh, Trà sen"
                    value={kind}
                    onChange={(e) => setKind(e.target.value)}
                    className="lt-admin-input"
                  />
                </div>

                <div>
                  <label className="lt-admin-label">Vùng xuất xứ</label>
                  <input
                    type="text"
                    placeholder="Tân Cương · Thái Nguyên"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="lt-admin-input"
                  />
                </div>
              </div>
            </div>

            {/* 2. Giá bán & Trạng thái */}
            <div className="lt-admin-form-section" style={{ background: "var(--paper-50, #FCF8F1)" }}>
              <h3 className="lt-admin-form-section-title">
                <Icon name="tag" size={17} color="var(--tra-500)" />
                <span>2. Giá bán & Trạng thái kinh doanh</span>
              </h3>

              <div className="lt-admin-grid-2">
                <div>
                  <label className="lt-admin-label">Giá bán cơ sở (VND) *</label>
                  <input
                    type="number"
                    step={1000}
                    inputMode="numeric"
                    required
                    placeholder="VD: 250000"
                    value={base}
                    onChange={(e) => setBase(e.target.value)}
                    className="lt-admin-input"
                    style={{ fontSize: 15, fontWeight: 700, color: "var(--reu-800, #24341F)" }}
                  />
                  <span style={{ fontSize: 11, color: "var(--stone-600, #74684F)", marginTop: 3, display: "block" }}>
                    Giá tiêu chuẩn cho hộp 200g Premium (hoặc trọn set)
                  </span>
                </div>

                <div>
                  <label className="lt-admin-label">Giá niêm yết cũ / Giá gốc (VND)</label>
                  <input
                    type="number"
                    step={1000}
                    inputMode="numeric"
                    placeholder="Để trống nếu không ưu đãi"
                    value={compareAt}
                    onChange={(e) => setCompareAt(e.target.value)}
                    className="lt-admin-input"
                  />
                  <span style={{ fontSize: 11, color: "var(--stone-600, #74684F)", marginTop: 3, display: "block" }}>
                    Hiển thị gạch ngang trên trang sản phẩm
                  </span>
                </div>
              </div>

              <div className="lt-admin-checkbox-group">
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--stone-900)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={fixed}
                    onChange={(e) => setFixed(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "var(--reu-700)" }}
                  />
                  <span>Giá cố định (không chọn phân khối lượng 100g/200g/500g)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: active ? "#047857" : "#DC2626", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "#047857" }}
                  />
                  <span>Mở bán hiển thị ra Storefront</span>
                </label>
              </div>
            </div>

            {/* 3. Tóm tắt & Mô tả chi tiết */}
            <div className="lt-admin-form-section">
              <h3 className="lt-admin-form-section-title">
                <Icon name="book-open" size={17} color="var(--reu-600)" />
                <span>3. Giới thiệu & Câu chuyện trà</span>
              </h3>

              <div>
                <label className="lt-admin-label">Câu tóm tắt đặc trưng (Note ngắn)</label>
                <input
                  type="text"
                  placeholder="VD: Hương cốm non, tiền chát dịu, hậu ngọt kéo dài"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="lt-admin-input"
                />
              </div>

              <div>
                <label className="lt-admin-label">Mô tả chi tiết sản phẩm</label>
                <textarea
                  rows={4}
                  placeholder="Kể về búp trà Tân Cương, thổ nhưỡng, quy trình sao tay trên chảo gang và cảm giác thưởng thức..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="lt-admin-input"
                  style={{ height: "auto", padding: "10px 12px", lineHeight: 1.55 }}
                />
              </div>
            </div>

            {/* 4. Hướng dẫn pha trà */}
            <div className="lt-admin-form-section">
              <h3 className="lt-admin-form-section-title">
                <Icon name="leaf" size={17} color="var(--reu-600)" />
                <span>4. Nghệ thuật pha trà chuẩn</span>
              </h3>

              <div className="lt-admin-grid-4">
                <div>
                  <span style={{ fontSize: 11.5, color: "var(--stone-600)", fontWeight: 500, display: "block", marginBottom: 3 }}>Nhiệt độ nước:</span>
                  <input
                    type="text"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className="lt-admin-input"
                    style={{ height: 34, fontSize: 12.5 }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: 11.5, color: "var(--stone-600)", fontWeight: 500, display: "block", marginBottom: 3 }}>Định lượng:</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="lt-admin-input"
                    style={{ height: 34, fontSize: 12.5 }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: 11.5, color: "var(--stone-600)", fontWeight: 500, display: "block", marginBottom: 3 }}>Thời gian hãm:</span>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="lt-admin-input"
                    style={{ height: 34, fontSize: 12.5 }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: 11.5, color: "var(--stone-600)", fontWeight: 500, display: "block", marginBottom: 3 }}>Số lần châm:</span>
                  <input
                    type="text"
                    value={infusions}
                    onChange={(e) => setInfusions(e.target.value)}
                    className="lt-admin-input"
                    style={{ height: 34, fontSize: 12.5 }}
                  />
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11.5, color: "var(--stone-600)", fontWeight: 500, display: "block", marginBottom: 3 }}>Mẹo nghệ nhân:</span>
                <input
                  type="text"
                  placeholder="VD: Không dùng nước sôi già để giữ trọn vẹn hương cốm non..."
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  className="lt-admin-input"
                  style={{ height: 34, fontSize: 12.5 }}
                />
              </div>
            </div>

            {/* 5. Gu & Dịp tặng */}
            <div className="lt-admin-form-section">
              <h3 className="lt-admin-form-section-title">
                <Icon name="gift" size={17} color="var(--tra-500)" />
                <span>5. Mục đích sử dụng & Dịp biếu tặng</span>
              </h3>

              <div className="lt-admin-grid-2">
                <div>
                  <label className="lt-admin-label">Mục đích dùng:</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {PURPOSES.map((p) => {
                      const checked = purposes.includes(p.value);
                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => handlePurposeToggle(p.value)}
                          style={{
                            padding: "5px 12px",
                            borderRadius: 999,
                            border: checked ? "1px solid var(--reu-800)" : "1px solid var(--border-hairline)",
                            background: checked ? "var(--reu-800)" : "#FFFFFF",
                            color: checked ? "#F7F0E3" : "var(--stone-800)",
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 140ms ease",
                          }}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="lt-admin-label">Dịp biếu tặng:</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {OCCASIONS.map((o) => {
                      const checked = occasions.includes(o.value);
                      return (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => handleOccasionToggle(o.value)}
                          style={{
                            padding: "5px 12px",
                            borderRadius: 999,
                            border: checked ? "1px solid var(--tra-500)" : "1px solid var(--border-hairline)",
                            background: checked ? "var(--paper-100)" : "#FFFFFF",
                            color: checked ? "var(--tra-700)" : "var(--stone-800)",
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 140ms ease",
                          }}
                        >
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ════════════ RIGHT COLUMN: MEDIA GALLERY & DRAG-DROP REORDER ════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="lt-admin-form-section" style={{ position: "sticky", top: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, paddingBottom: 8, borderBottom: "1px solid var(--paper-200, #EEE4D2)" }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--reu-800)", display: "flex", alignItems: "center", gap: 7 }}>
                  <Icon name="sliders-horizontal" size={17} color="var(--tra-500)" />
                  <span>Bộ sưu tập ảnh sản phẩm</span>
                </h3>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--tra-600)", background: "var(--paper-100)", padding: "2px 8px", borderRadius: 999, border: "1px solid var(--border-hairline)" }}>
                  {images.length} ảnh
                </span>
              </div>

              <p style={{ margin: "2px 0 6px", fontSize: 12, color: "var(--stone-600)", lineHeight: 1.5 }}>
                💡 <strong>Kéo & thả</strong> các thẻ ảnh để đổi thứ tự. Ảnh đầu tiên <strong>(#1)</strong> luôn là <strong>ảnh đại diện (ảnh bìa)</strong> hiển thị chính trên website.
              </p>

              {/* ─── MULTI-FILE DROPZONE (Up to 10 images / batch) ─── */}
              <input
                type="file"
                ref={multiFileInputRef}
                multiple
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    processBatchUpload(e.target.files);
                  }
                }}
              />

              <div
                className={`lt-admin-dropzone ${isDropOver ? "is-dragover" : ""}`}
                onDragOver={handleDropzoneOver}
                onDragLeave={handleDropzoneLeave}
                onDrop={handleDropzoneDrop}
                onClick={() => multiFileInputRef.current?.click()}
              >
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(188, 154, 108, 0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--reu-800)" }}>
                  <Icon name="upload" size={20} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--reu-800)" }}>
                  {uploading
                    ? `Đang xử lý ${uploadProgress ? `${uploadProgress.current}/${uploadProgress.total}` : ""} ảnh...`
                    : "Kéo & thả nhiều ảnh vào đây hoặc bấm tải lên"}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--stone-600)" }}>
                  Hỗ trợ tải tối đa <strong>10 ảnh / 1 lần</strong> (JPG, PNG, WebP)
                </div>
              </div>

              {/* ─── QUICK PRESET & CUSTOM URL PICKER ─── */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 2 }}>
                <button
                  type="button"
                  onClick={() => setShowSamplePicker(!showSamplePicker)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid var(--border-hairline)",
                    background: showSamplePicker ? "var(--paper-200)" : "#FFFFFF",
                    fontSize: 12,
                    color: "var(--stone-800)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontWeight: 500,
                  }}
                >
                  <Icon name="star" size={13} color="var(--tra-500)" />
                  <span>{showSamplePicker ? "Đóng kho ảnh mẫu" : "Thêm từ kho ảnh mẫu Lam Trà"}</span>
                </button>
              </div>

              {showSamplePicker && (
                <div style={{ background: "var(--paper-50)", border: "1px solid var(--border-hairline)", borderRadius: 8, padding: "10px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {SAMPLE_PHOTOS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => handleAddSample(s.value, s.label)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 6,
                        border: "1px solid #DFD2BB",
                        background: "#FFFFFF",
                        fontSize: 11.5,
                        textAlign: "left",
                        cursor: "pointer",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "var(--stone-900)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                      title={s.label}
                    >
                      <span style={{ width: 18, height: 18, borderRadius: 3, backgroundImage: `url('${photo(s.value)}')`, backgroundSize: "cover", flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>+ {s.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Custom URL Input */}
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type="text"
                  placeholder="Hoặc dán đường dẫn ảnh /assets/..."
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="lt-admin-input"
                  style={{ height: 32, fontSize: 12 }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomUrl}
                  style={{
                    height: 32,
                    padding: "0 10px",
                    borderRadius: 6,
                    border: "1px solid var(--border-hairline)",
                    background: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--reu-800)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Thêm
                </button>
              </div>

              {/* ─── REORDERABLE IMAGES LIST ─── */}
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--stone-800)", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                  <span>Danh sách ảnh hiện có ({images.length}):</span>
                  {images.length > 1 && (
                    <span style={{ fontSize: 11, color: "var(--tra-600)", fontWeight: 500 }}>
                      Kéo thả thẻ ảnh hoặc chạm nút ↑ ↓ để đổi vị trí
                    </span>
                  )}
                </div>

                {/* Touch dragging live position hint banner on mobile */}
                {touchDragIndex !== null && (
                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "linear-gradient(135deg, #19241A, #24341F)",
                      color: "#F7F0E3",
                      fontSize: 12.5,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: "0 4px 12px rgba(25, 36, 26, 0.3)",
                      marginBottom: 10,
                      border: "1px solid #DFBE89",
                    }}
                  >
                    <span>
                      Đang kéo ảnh <strong>#{touchDragIndex + 1}</strong>
                    </span>
                    <span>
                      ➔ Vị trí mới: <strong style={{ color: "#DFBE89" }}>#{touchOverIndex !== null ? touchOverIndex + 1 : touchDragIndex + 1}</strong>
                    </span>
                  </div>
                )}

                {images.length === 0 ? (
                  <div style={{ padding: "24px 16px", textAlign: "center", background: "var(--paper-50)", borderRadius: 8, border: "1px dashed var(--border-hairline)", color: "var(--stone-600)", fontSize: 12.5 }}>
                    Chưa có ảnh nào. Vui lòng kéo ảnh vào khung phía trên hoặc chọn ảnh mẫu.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "380px", overflowY: "auto", paddingRight: 4 }}>
                    {images.map((item, index) => {
                      const isPrimary = index === 0;
                      const isDragged = draggedIndex === index;
                      const isOver = dragOverIndex === index;
                      const isTouchDragging = touchDragIndex === index;
                      const isTouchOver = touchOverIndex === index && touchDragIndex !== index;

                      return (
                        <div
                          key={item.id}
                          data-image-index={index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`lt-admin-image-card lt-admin-image-card-responsive ${isPrimary ? "is-primary" : ""} ${isDragged ? "is-dragged" : ""} ${isOver ? "is-dragover" : ""} ${isTouchDragging ? "is-touch-dragging" : ""} ${isTouchOver ? "is-touch-over" : ""}`}
                          style={{
                            padding: "8px 10px",
                            background: isPrimary ? "linear-gradient(to right, #FFFDF9, #FFFFFF)" : "#FFFFFF",
                          }}
                        >
                          <div className="lt-admin-image-card-main">
                            {/* Drag Handle Icon - Supports mouse drag and mobile touch drag */}
                            <div
                              className={`lt-admin-drag-handle ${isTouchDragging ? "is-active" : ""}`}
                              onTouchStart={(e) => handleTouchStart(e, index)}
                              onTouchMove={handleTouchMove}
                              onTouchEnd={handleTouchEnd}
                              onTouchCancel={handleTouchCancel}
                              title="Kéo thả để đổi thứ tự (Chạm giữ và kéo trên điện thoại)"
                              style={{
                                color: isPrimary ? "var(--tra-500)" : "var(--stone-500)",
                                cursor: isTouchDragging ? "grabbing" : "grab",
                                fontSize: 18,
                                lineHeight: 1,
                                userSelect: "none",
                                WebkitUserSelect: "none",
                                touchAction: "none",
                              }}
                            >
                              ⋮⋮
                            </div>

                            {/* Image Thumbnail with Click-to-Zoom */}
                            <button
                              type="button"
                              draggable={false}
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewIndex(index);
                              }}
                              title="Bấm để phóng to xem ảnh"
                              style={{
                                width: 52,
                                height: 52,
                                borderRadius: 6,
                                border: isPrimary ? "1.5px solid var(--tra-400)" : "1px solid var(--border-hairline)",
                                background: "#FAF8F5",
                                backgroundImage: `url('${photo(item.url)}')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                flexShrink: 0,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                position: "relative",
                                cursor: "zoom-in",
                                padding: 0,
                                overflow: "hidden",
                              }}
                            >
                              <span
                                className="lt-thumb-zoom-overlay"
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  background: "rgba(13, 34, 25, 0.55)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#FFFFFF",
                                }}
                              >
                                <Icon name="search" size={16} />
                              </span>
                              <span
                                style={{
                                  position: "absolute",
                                  bottom: 2,
                                  right: 2,
                                  background: "rgba(13, 34, 25, 0.7)",
                                  borderRadius: 3,
                                  padding: "1px 3px",
                                  color: "#F7F0E3",
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: 9,
                                  lineHeight: 1,
                                }}
                                title="Bấm để phóng to"
                              >
                                <Icon name="search" size={9} />
                              </span>
                            </button>

                            {/* Info and Tags */}
                            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                {isPrimary ? (
                                  <span
                                    style={{
                                      fontSize: 10.5,
                                      fontWeight: 700,
                                      color: "#94723F",
                                      background: "#FBF3E4",
                                      border: "1px solid #DFBE89",
                                      padding: "1px 7px",
                                      borderRadius: 4,
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 3,
                                    }}
                                  >
                                    ⭐ #1 Ảnh bìa chính
                                  </span>
                                ) : (
                                  <span style={{ fontSize: 10.5, fontWeight: 600, color: "var(--stone-600)", background: "var(--paper-100)", padding: "1px 6px", borderRadius: 4 }}>
                                    #{index + 1} Ảnh phụ
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewIndex(index);
                                }}
                                title={`Xem ảnh lớn: ${item.url}`}
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  textAlign: "left",
                                  fontSize: 11.5,
                                  color: "var(--stone-700)",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  cursor: "zoom-in",
                                  display: "block",
                                  width: "100%",
                                }}
                              >
                                <code style={{ textDecoration: "underline", textDecorationStyle: "dotted" }}>
                                  {item.url.length > 35 ? `${item.url.slice(0, 32)}...` : item.url}
                                </code>
                              </button>
                            </div>
                          </div>

                          {/* Control Toolbar with Mobile-Friendly Touch Targets */}
                          <div className="lt-admin-image-toolbar">
                            {/* Preview Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewIndex(index);
                              }}
                              title="Bấm xem ảnh phóng to"
                              className="lt-admin-toolbar-btn"
                            >
                              <Icon name="search" size={13} />
                              <span className="lt-admin-btn-text">Xem</span>
                            </button>

                            {/* Make primary */}
                            {!isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(index)}
                                title="Đặt làm ảnh bìa chính (#1)"
                                className="lt-admin-toolbar-btn lt-admin-btn-primary-set"
                              >
                                ⭐ Làm bìa
                              </button>
                            )}

                            {/* Move Up */}
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMove(index, -1)}
                              title="Di chuyển lên trước"
                              className="lt-admin-toolbar-btn lt-admin-btn-move"
                            >
                              ↑ Lên
                            </button>

                            {/* Move Down */}
                            <button
                              type="button"
                              disabled={index === images.length - 1}
                              onClick={() => handleMove(index, 1)}
                              title="Di chuyển xuống sau"
                              className="lt-admin-toolbar-btn lt-admin-btn-move"
                            >
                              ↓ Xuống
                            </button>

                            {/* Delete single image */}
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(index)}
                              title="Xóa ảnh này"
                              className="lt-admin-toolbar-btn lt-admin-btn-delete"
                            >
                              <Icon name="trash-2" size={13} />
                              <span className="lt-admin-btn-text">Xóa</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════ STICKY LUXURY MODAL FOOTER ════════════ */}
        <div className="lt-admin-modal-footer">
          <div className="lt-admin-footer-preview">
            <span style={{ flexShrink: 0, fontWeight: 500 }}>Ảnh đại diện:</span>
            {images[0] ? (
              <button
                type="button"
                onClick={() => setPreviewIndex(0)}
                title="Bấm để xem ảnh phóng to"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  fontWeight: 600,
                  color: "var(--reu-800)",
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  padding: 0,
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    backgroundImage: `url('${photo(images[0].url)}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "1px solid var(--border-hairline)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span style={{ textDecoration: "underline", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {images[0].url}
                </span>
                <Icon name="search" size={13} color="var(--tra-500)" />
              </button>
            ) : (
              <span style={{ color: "#DC2626" }}>Chưa có ảnh</span>
            )}
          </div>

          <div className="lt-admin-footer-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="lt-admin-footer-btn-cancel"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={saving}
              className="lt-admin-footer-btn-submit"
            >
              <Icon name="circle-check" size={16} color="var(--tra-300, #D9BF94)" />
              <span>{saving ? "Đang lưu..." : isEditing ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* ════════════ FULL-SIZE IMAGE PREVIEW LIGHTBOX ════════════ */}
      {mounted && previewIndex !== null && images[previewIndex] && createPortal(
        <div
          role="dialog"
          aria-modal
          aria-label="Xem ảnh phóng to"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            background: "rgba(10, 22, 16, 0.95)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            color: "#F7F0E3",
            animation: "ltFade .18s ease-out",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewIndex(null);
          }}
        >
          {/* Lightbox Topbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              background: "rgba(13, 34, 25, 0.75)",
              borderBottom: "1px solid rgba(188, 154, 108, 0.3)",
              flexShrink: 0,
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: previewIndex === 0 ? "#DFBE89" : "#F7F0E3",
                  background: previewIndex === 0 ? "rgba(188, 154, 108, 0.25)" : "rgba(255, 255, 255, 0.1)",
                  border: `1px solid ${previewIndex === 0 ? "#DFBE89" : "rgba(255, 255, 255, 0.2)"}`,
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                {previewIndex === 0 ? "⭐ #1 Ảnh bìa chính" : `#${previewIndex + 1} Ảnh phụ`}
              </span>
              <span style={{ fontSize: 13, color: "var(--tra-300, #D9BF94)" }}>
                ({previewIndex + 1} / {images.length})
              </span>
              <code
                style={{
                  fontSize: 12,
                  background: "rgba(0, 0, 0, 0.35)",
                  padding: "3px 8px",
                  borderRadius: 4,
                  color: "#E2E8F0",
                  maxWidth: 320,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {images[previewIndex].url}
              </code>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Copy link */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(images[previewIndex].url);
                  setCopiedUrl(true);
                  setTimeout(() => setCopiedUrl(false), 2000);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: copiedUrl ? "#6EE7B7" : "#F7F0E3",
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                <Icon name={copiedUrl ? "circle-check" : "search"} size={14} />
                <span>{copiedUrl ? "Đã chép link!" : "Chép link"}</span>
              </button>

              {/* Zoom scale toggle */}
              <button
                type="button"
                onClick={() => setLightboxZoomed((prev) => !prev)}
                title={lightboxZoomed ? "Thu vừa màn hình" : "Phóng to 100%"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  background: lightboxZoomed ? "rgba(188, 154, 108, 0.3)" : "rgba(255, 255, 255, 0.08)",
                  color: "#F7F0E3",
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                <Icon name="search" size={14} />
                <span>{lightboxZoomed ? "Vừa khung" : "100%"}</span>
              </button>

              {previewIndex !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(previewIndex)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: "1px solid #DFBE89",
                    background: "rgba(188, 154, 108, 0.25)",
                    color: "#F7F0E3",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ⭐ Đặt làm ảnh chính
                </button>
              )}

              <a
                href={photo(images[previewIndex].url)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#F7F0E3",
                  fontSize: 12.5,
                  textDecoration: "none",
                }}
              >
                <Icon name="external-link" size={14} />
                <span>Mở ảnh gốc</span>
              </a>

              <button
                type="button"
                onClick={() => setPreviewIndex(null)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 7,
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  background: "rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title="Đóng (Esc)"
                aria-label="Đóng"
              >
                <Icon name="x" size={18} />
              </button>
            </div>
          </div>

          {/* Lightbox Center Stage with Mobile Touch Swipe Navigation */}
          <div
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 24px",
              overflow: lightboxZoomed ? "auto" : "hidden",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPreviewIndex(null);
            }}
          >
            {/* Prev button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
                }}
                style={{
                  position: "fixed",
                  left: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "1px solid rgba(188, 154, 108, 0.45)",
                  background: "rgba(13, 34, 25, 0.8)",
                  color: "#F7F0E3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
                  transition: "all 140ms ease",
                }}
                aria-label="Ảnh trước (Mũi tên trái)"
                title="Ảnh trước (←)"
              >
                <Icon name="chevron-left" size={24} />
              </button>
            )}

            {/* Main Image */}
            <div
              style={{
                maxWidth: lightboxZoomed ? "none" : "88vw",
                maxHeight: lightboxZoomed ? "none" : "72vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo(images[previewIndex].url)}
                alt={images[previewIndex].alt || name}
                onClick={() => setLightboxZoomed((prev) => !prev)}
                style={{
                  maxWidth: lightboxZoomed ? "none" : "100%",
                  maxHeight: lightboxZoomed ? "none" : "72vh",
                  objectFit: "contain",
                  borderRadius: 12,
                  border: "2px solid rgba(188, 154, 108, 0.4)",
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.65)",
                  cursor: lightboxZoomed ? "zoom-out" : "zoom-in",
                  userSelect: "none",
                }}
                title={lightboxZoomed ? "Bấm để thu vừa màn hình" : "Bấm để phóng to 100%"}
              />
            </div>

            {/* Next button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
                }}
                style={{
                  position: "fixed",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "1px solid rgba(188, 154, 108, 0.45)",
                  background: "rgba(13, 34, 25, 0.8)",
                  color: "#F7F0E3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
                  transition: "all 140ms ease",
                }}
                aria-label="Ảnh tiếp theo (Mũi tên phải)"
                title="Ảnh tiếp theo (→)"
              >
                <Icon name="chevron-right" size={24} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Carousel */}
          {images.length > 1 && (
            <div
              style={{
                padding: "12px 20px",
                background: "rgba(13, 34, 25, 0.75)",
                borderTop: "1px solid rgba(188, 154, 108, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                overflowX: "auto",
              }}
            >
              {images.map((img, idx) => {
                const isActive = idx === previewIndex;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setPreviewIndex(idx)}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 6,
                      border: isActive ? "2px solid #DFBE89" : "1px solid rgba(255, 255, 255, 0.25)",
                      padding: 0,
                      background: "transparent",
                      cursor: "pointer",
                      overflow: "hidden",
                      opacity: isActive ? 1 : 0.65,
                      transform: isActive ? "scale(1.1)" : "none",
                      transition: "all 140ms ease",
                      boxShadow: isActive ? "0 0 12px rgba(223, 190, 137, 0.6)" : "none",
                      flexShrink: 0,
                    }}
                    title={`Ảnh #${idx + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo(img.url)}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>,
        document.body
      )}
    </Dialog>
  );
}
