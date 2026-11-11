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
  { value: "moccau", label: "Trà Móc Câu Tân Cương (Hộp Premium)", tier: "premium" },
  { value: "nontom", label: "Trà Nõn Tôm Thượng Phẩm (Hộp Premium)", tier: "premium" },
  { value: "sen", label: "Trà Đinh Sen Tây Hồ (Hộp Premium)", tier: "premium" },
  { value: "dinhth", label: "Trà Đinh Thượng Hạng (Hộp Premium)", tier: "premium" },
  { value: "hopqua", label: "Hộp quà biếu cao cấp", tier: "premium" },
  { value: "/assets/products/tra-thanh-nhiet-duong-tam-1.webp", label: "Trà Dưỡng Tâm Thanh Nhiệt", tier: "premium" },
  { value: "hero", label: "Đồi chè Tân Cương nắng sớm", tier: "premium" },
  // Ảnh mẫu phân hạng Tiêu chuẩn (hộp phổ thông / túi giấy):
  { value: "/assets/products/tra-dinh-sen-7.webp", label: "Trà Đinh Sen (Túi kraft Tiêu chuẩn)", tier: "standard" },
  { value: "/assets/products/tra-dinh-sen-6.webp", label: "Trà Đinh Sen (Túi xanh Tiêu chuẩn)", tier: "standard" },
  { value: "/assets/products/tra-moc-cau-pho-thong.webp", label: "Trà Móc Câu (Hộp phổ thông Tiêu chuẩn)", tier: "standard" },
  { value: "/assets/products/tra-non-tom-pho-thong.webp", label: "Trà Nõn Tôm (Hộp phổ thông Tiêu chuẩn)", tier: "standard" },
  { value: "/assets/products/tra-dinh-pho-thong.webp", label: "Trà Đinh (Hộp phổ thông Tiêu chuẩn)", tier: "standard" },
  { value: "/assets/products/tra-nhai-pho-thong.webp", label: "Trà Nhài (Hộp phổ thông Tiêu chuẩn)", tier: "standard" },
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
  const [standardBase, setStandardBase] = useState<number | string>("");
  const [fixed, setFixed] = useState(false);
  const [origin, setOrigin] = useState("Tân Cương · Thái Nguyên");
  const [desc, setDesc] = useState("");
  const [active, setActive] = useState(true);

  // Images state for each tier: Premium & Tiêu chuẩn
  const [premiumImages, setPremiumImages] = useState<ImageItem[]>([]);
  const [standardImages, setStandardImages] = useState<ImageItem[]>([]);
  const [imageTab, setImageTab] = useState<"premium" | "standard" | "both">("premium");

  // Drag & drop state per tier
  const [draggedItem, setDraggedItem] = useState<{ tier: "premium" | "standard"; index: number } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{ tier: "premium" | "standard"; index: number } | null>(null);

  // Lightbox preview state
  const [previewState, setPreviewState] = useState<{ tier: "premium" | "standard"; index: number } | null>(null);
  const [lightboxZoomed, setLightboxZoomed] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mobile Touch Drag & Drop states
  const [touchDragState, setTouchDragState] = useState<{ tier: "premium" | "standard"; index: number } | null>(null);
  const [touchOverIndex, setTouchOverIndex] = useState<number | null>(null);
  const touchStateRef = useRef<{
    tier: "premium" | "standard";
    startIndex: number;
    currentIndex: number;
    active: boolean;
  }>({ tier: "premium", startIndex: -1, currentIndex: -1, active: false });

  // Lightbox mobile touch swipe
  const [lightboxTouchStartX, setLightboxTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // File upload state & dropzone for both tiers
  const premiumFileInputRef = useRef<HTMLInputElement>(null);
  const standardFileInputRef = useRef<HTMLInputElement>(null);
  const [premiumDropOver, setPremiumDropOver] = useState(false);
  const [standardDropOver, setStandardDropOver] = useState(false);
  const [uploadingTier, setUploadingTier] = useState<"premium" | "standard" | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  const [showPremiumSamplePicker, setShowPremiumSamplePicker] = useState(false);
  const [showStandardSamplePicker, setShowStandardSamplePicker] = useState(false);
  const [premiumUrlInput, setPremiumUrlInput] = useState("");
  const [standardUrlInput, setStandardUrlInput] = useState("");

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
      setStandardBase(product.standardBase || "");
      setFixed(!!product.fixed);
      setOrigin(product.origin || "Tân Cương · Thái Nguyên");
      setDesc(product.desc || "");
      setActive(product.active !== false);

      // Rebuild premium images list (ph + gallery)
      const pList: ImageItem[] = [];
      if (product.ph) {
        pList.push({ id: `img-prem-main-${Date.now()}`, url: product.ph, alt: `${product.name} (Premium)` });
      }
      if (Array.isArray(product.gallery)) {
        product.gallery.forEach((g, idx) => {
          if (g.ph && g.ph !== product.ph) {
            pList.push({ id: `img-prem-gal-${idx}-${Date.now()}`, url: g.ph, alt: g.alt || `${product.name} ảnh ${idx + 2}` });
          }
        });
      }
      if (pList.length === 0) {
        pList.push({ id: `img-def-${Date.now()}`, url: "moccau", alt: product.name });
      }
      setPremiumImages(pList);

      // Rebuild standard images list (standardPh + standardGallery)
      const sList: ImageItem[] = [];
      if (product.standardPh) {
        sList.push({ id: `img-std-main-${Date.now()}`, url: product.standardPh, alt: `${product.name} (Tiêu chuẩn)` });
      }
      if (Array.isArray(product.standardGallery)) {
        product.standardGallery.forEach((g, idx) => {
          if (g.ph && g.ph !== product.standardPh) {
            sList.push({ id: `img-std-gal-${idx}-${Date.now()}`, url: g.ph, alt: g.alt || `${product.name} tiêu chuẩn ảnh ${idx + 2}` });
          }
        });
      }
      setStandardImages(sList);

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
      setStandardBase("");
      setFixed(false);
      setOrigin("Tân Cương · Thái Nguyên");
      setDesc("");
      setActive(true);
      setPremiumImages([{ id: `img-new-0`, url: "moccau", alt: "Ảnh sản phẩm mới" }]);
      setStandardImages([]);
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
    setShowPremiumSamplePicker(false);
    setShowStandardSamplePicker(false);
    setPreviewState(null);
  }, [product, open]);

  // Active list helper for lightbox
  const activeLightboxImages = previewState ? (previewState.tier === "premium" ? premiumImages : standardImages) : [];

  // Lightbox keyboard navigation (Esc, ArrowLeft, ArrowRight) with capture-phase isolation
  useEffect(() => {
    if (!previewState) {
      setLightboxZoomed(false);
      setCopiedUrl(false);
      return;
    }
    const currentList = previewState.tier === "premium" ? premiumImages : standardImages;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setPreviewState(null);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPreviewState((prev) => {
          if (!prev) return null;
          const newIdx = prev.index > 0 ? prev.index - 1 : currentList.length - 1;
          return { tier: prev.tier, index: newIdx };
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPreviewState((prev) => {
          if (!prev) return null;
          const newIdx = prev.index < currentList.length - 1 ? prev.index + 1 : 0;
          return { tier: prev.tier, index: newIdx };
        });
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [previewState, premiumImages, standardImages]);

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

  // ─── BATCH IMAGE UPLOAD (Max 10 images / batch for each tier) ───
  const processBatchUpload = async (files: FileList | File[], targetTier: "premium" | "standard") => {
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
    setUploadingTier(targetTier);
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
            id: `upload_${targetTier}_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
            url: data.url,
            alt: `${name.trim() || "Trà"} (${targetTier === "premium" ? "Premium" : "Tiêu chuẩn"}) ${file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ")}`,
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
              id: `data_${targetTier}_${Date.now()}_${i}`,
              url: dataUrl,
              alt: `${name.trim() || "Trà"} (${targetTier === "premium" ? "Premium" : "Tiêu chuẩn"})`,
            });
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải ảnh:", file.name, err);
      }
    }

    if (newItems.length > 0) {
      if (targetTier === "premium") {
        setPremiumImages((prev) => {
          if (prev.length === 1 && prev[0].url === "moccau" && !isEditing) {
            return newItems;
          }
          return [...prev, ...newItems];
        });
      } else {
        setStandardImages((prev) => [...prev, ...newItems]);
      }
      setSuccessNotice(`Đã thêm thành công ${newItems.length} ảnh vào phân hạng ${targetTier === "premium" ? "Premium" : "Tiêu chuẩn"}.`);
      setTimeout(() => setSuccessNotice(null), 3000);
    }

    setUploadingTier(null);
    setUploadProgress(null);
    if (targetTier === "premium" && premiumFileInputRef.current) {
      premiumFileInputRef.current.value = "";
    }
    if (targetTier === "standard" && standardFileInputRef.current) {
      standardFileInputRef.current.value = "";
    }
  };

  // ─── DRAG & DROP REORDERING & TRANSFER ───
  const handleDragStart = (e: React.DragEvent, index: number, tier: "premium" | "standard") => {
    setDraggedItem({ tier, index });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify({ tier, index }));
  };

  const handleDragOver = (e: React.DragEvent, index: number, tier: "premium" | "standard") => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!dragOverItem || dragOverItem.tier !== tier || dragOverItem.index !== index) {
      setDragOverItem({ tier, index });
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number, targetTier: "premium" | "standard") => {
    e.preventDefault();
    if (!draggedItem) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Dragged within the same tier
    if (draggedItem.tier === targetTier) {
      if (draggedItem.index === dropIndex) {
        setDraggedItem(null);
        setDragOverItem(null);
        return;
      }
      const setter = targetTier === "premium" ? setPremiumImages : setStandardImages;
      setter((prev) => {
        const updated = [...prev];
        const [moved] = updated.splice(draggedItem.index, 1);
        updated.splice(dropIndex, 0, moved);
        return updated;
      });
    } else {
      // Dragged across tiers (from Premium to Standard or vice versa)
      const sourceList = draggedItem.tier === "premium" ? premiumImages : standardImages;
      const itemToMove = sourceList[draggedItem.index];
      if (itemToMove) {
        if (draggedItem.tier === "premium") {
          setPremiumImages((prev) => prev.filter((_, i) => i !== draggedItem.index));
          setStandardImages((prev) => {
            const updated = [...prev];
            updated.splice(dropIndex, 0, itemToMove);
            return updated;
          });
        } else {
          setStandardImages((prev) => prev.filter((_, i) => i !== draggedItem.index));
          setPremiumImages((prev) => {
            const updated = [...prev];
            updated.splice(dropIndex, 0, itemToMove);
            return updated;
          });
        }
      }
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // ─── TOUCH DRAG & DROP FOR MOBILE ───
  const handleTouchStart = (e: React.TouchEvent, index: number, tier: "premium" | "standard") => {
    touchStateRef.current = { tier, startIndex: index, currentIndex: index, active: true };
    setTouchDragState({ tier, index });
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
      const tierStr = card.getAttribute("data-image-tier");
      if (idxStr !== null && tierStr === touchStateRef.current.tier) {
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
    const { tier, startIndex, currentIndex } = touchStateRef.current;
    if (startIndex !== -1 && currentIndex !== -1 && startIndex !== currentIndex) {
      const setter = tier === "premium" ? setPremiumImages : setStandardImages;
      setter((prev) => {
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
    touchStateRef.current = { tier: "premium", startIndex: -1, currentIndex: -1, active: false };
    setTouchDragState(null);
    setTouchOverIndex(null);
  };

  const handleTouchCancel = () => {
    touchStateRef.current = { tier: "premium", startIndex: -1, currentIndex: -1, active: false };
    setTouchDragState(null);
    setTouchOverIndex(null);
  };

  useEffect(() => {
    if (touchDragState === null) return;
    const onGlobalTouchEnd = () => handleTouchEnd();
    const onGlobalTouchCancel = () => handleTouchCancel();
    window.addEventListener("touchend", onGlobalTouchEnd);
    window.addEventListener("touchcancel", onGlobalTouchCancel);
    return () => {
      window.removeEventListener("touchend", onGlobalTouchEnd);
      window.removeEventListener("touchcancel", onGlobalTouchCancel);
    };
  }, [touchDragState]);

  // Lightbox touch swipe handlers
  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    setLightboxTouchStartX(e.touches[0].clientX);
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (lightboxTouchStartX === null || !previewState) return;
    const currentList = previewState.tier === "premium" ? premiumImages : standardImages;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - lightboxTouchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // Swipe Right -> Ảnh trước
        setPreviewState((prev) => (prev ? { tier: prev.tier, index: prev.index > 0 ? prev.index - 1 : currentList.length - 1 } : null));
      } else {
        // Swipe Left -> Ảnh kế tiếp
        setPreviewState((prev) => (prev ? { tier: prev.tier, index: prev.index < currentList.length - 1 ? prev.index + 1 : 0 } : null));
      }
    }
    setLightboxTouchStartX(null);
  };

  // Reorder & action controls
  const handleSetPrimary = (index: number, tier: "premium" | "standard") => {
    if (index === 0) return;
    const setter = tier === "premium" ? setPremiumImages : setStandardImages;
    setter((prev) => {
      const updated = [...prev];
      const [item] = updated.splice(index, 1);
      updated.unshift(item);
      return updated;
    });
  };

  const handleMove = (index: number, direction: -1 | 1, tier: "premium" | "standard") => {
    const list = tier === "premium" ? premiumImages : standardImages;
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const setter = tier === "premium" ? setPremiumImages : setStandardImages;
    setter((prev) => {
      const updated = [...prev];
      const tempItem = updated[index];
      updated[index] = updated[target];
      updated[target] = tempItem;
      return updated;
    });
  };

  const handleDeleteImage = (index: number, tier: "premium" | "standard") => {
    const list = tier === "premium" ? premiumImages : standardImages;
    if (tier === "premium" && list.length <= 1) {
      if (confirm("Đây là ảnh Premium duy nhất. Bạn có chắc muốn xóa không?")) {
        setPremiumImages([]);
        setPreviewState(null);
      }
      return;
    }
    if (previewState && previewState.tier === tier) {
      if (previewState.index === index) {
        setPreviewState(null);
      } else if (previewState.index > index) {
        setPreviewState({ tier, index: previewState.index - 1 });
      }
    }
    const setter = tier === "premium" ? setPremiumImages : setStandardImages;
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // Move an image between Premium and Standard tiers
  const handleMoveTier = (index: number, fromTier: "premium" | "standard") => {
    const sourceList = fromTier === "premium" ? premiumImages : standardImages;
    const item = sourceList[index];
    if (!item) return;

    if (fromTier === "premium") {
      setPremiumImages((prev) => prev.filter((_, i) => i !== index));
      setStandardImages((prev) => [...prev, item]);
      setSuccessNotice(`Đã chuyển ảnh sang phân hạng Tiêu chuẩn.`);
    } else {
      setStandardImages((prev) => prev.filter((_, i) => i !== index));
      setPremiumImages((prev) => [...prev, item]);
      setSuccessNotice(`Đã chuyển ảnh sang phân hạng Premium.`);
    }
    setTimeout(() => setSuccessNotice(null), 2500);
  };

  const handleAddSample = (sampleUrl: string, sampleLabel: string, tier: "premium" | "standard") => {
    const newItem: ImageItem = {
      id: `sample_${tier}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      url: sampleUrl,
      alt: sampleLabel,
    };
    if (tier === "premium") {
      setPremiumImages((prev) => [...prev, newItem]);
      setShowPremiumSamplePicker(false);
    } else {
      setStandardImages((prev) => [...prev, newItem]);
      setShowStandardSamplePicker(false);
    }
  };

  const handleAddCustomUrl = (tier: "premium" | "standard") => {
    const url = tier === "premium" ? premiumUrlInput.trim() : standardUrlInput.trim();
    if (!url) return;
    const newItem: ImageItem = {
      id: `url_${tier}_${Date.now()}`,
      url,
      alt: `${name.trim() || "Trà"} (${tier === "premium" ? "Premium" : "Tiêu chuẩn"})`,
    };
    if (tier === "premium") {
      setPremiumImages((prev) => [...prev, newItem]);
      setPremiumUrlInput("");
    } else {
      setStandardImages((prev) => [...prev, newItem]);
      setStandardUrlInput("");
    }
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

    if (premiumImages.length === 0) {
      setError("Vui lòng thêm ít nhất 1 ảnh đại diện cho phân hạng Premium.");
      return;
    }

    const primaryPhoto = premiumImages[0].url;
    const galleryPhotos = premiumImages.slice(1).map((img, i) => ({
      ph: img.url,
      alt: img.alt || `${name.trim()} ảnh ${i + 2}`,
    }));

    const standardPhoto = standardImages[0]?.url || undefined;
    const standardGalleryPhotos = standardImages.length > 1
      ? standardImages.slice(1).map((img, i) => ({
          ph: img.url,
          alt: img.alt || `${name.trim()} tiêu chuẩn ảnh ${i + 2}`,
        }))
      : undefined;

    const numStandardBase = standardBase ? Number(standardBase) : undefined;

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
        standardBase: numStandardBase,
        fixed,
        origin: origin.trim(),
        ph: primaryPhoto,
        gallery: galleryPhotos,
        standardPh: standardPhoto,
        standardGallery: standardGalleryPhotos,
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

  const renderTierBlock = (tier: "premium" | "standard") => {
    const isPremium = tier === "premium";
    const list = isPremium ? premiumImages : standardImages;
    const fileRef = isPremium ? premiumFileInputRef : standardFileInputRef;
    const isDropOver = isPremium ? premiumDropOver : standardDropOver;
    const isUploading = uploadingTier === tier;
    const showSamplePicker = isPremium ? showPremiumSamplePicker : showStandardSamplePicker;
    const setShowSamplePicker = isPremium ? setShowPremiumSamplePicker : setShowStandardSamplePicker;
    const customUrlInput = isPremium ? premiumUrlInput : standardUrlInput;
    const setCustomUrlInput = isPremium ? setPremiumUrlInput : setStandardUrlInput;
    const title = isPremium ? "👑 Phân hạng Premium (Cao cấp)" : "🏷️ Phân hạng Tiêu chuẩn (Hàng ngày)";
    const subDesc = isPremium
      ? "Ảnh hiển thị mặc định và khi khách chọn gói Premium / Hương đậm trên website"
      : "Ảnh hiển thị khi khách chọn gói Tiêu chuẩn / Hộp giấy trên website";
    const targetLabel = isPremium ? "Tiêu chuẩn" : "Premium";

    const borderColor = isPremium ? "#E2CFA8" : "#B8D6BF";
    const headerBg = isPremium ? "linear-gradient(to right, #FCF8F1, #FFFFFF)" : "linear-gradient(to right, #F3F8F4, #FFFFFF)";
    const dropzoneBorder = isDropOver
      ? (isPremium ? "#B58C4F" : "#2D5034")
      : (isPremium ? "rgba(188, 154, 108, 0.45)" : "rgba(45, 80, 52, 0.35)");

    return (
      <div
        key={tier}
        style={{
          borderRadius: 10,
          border: `1.5px solid ${borderColor}`,
          background: isPremium ? "#FFFDF9" : "#FBFDFB",
          padding: "12px 14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        {/* Tier Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, paddingBottom: 8, borderBottom: `1px solid ${borderColor}`, background: headerBg, margin: "-12px -14px 10px -14px", padding: "10px 14px", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: isPremium ? "var(--reu-800)" : "#24341F", display: "flex", alignItems: "center", gap: 6 }}>
              <span>{title}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--stone-600)", marginTop: 2 }}>{subDesc}</div>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: isPremium ? "#94723F" : "#2D5034",
              background: isPremium ? "#FBF3E4" : "#EDF5EF",
              padding: "2px 8px",
              borderRadius: 999,
              border: `1px solid ${isPremium ? "#DFBE89" : "#B8D6BF"}`,
            }}
          >
            {list.length} ảnh
          </span>
        </div>

        {/* Dropzone */}
        <div
          className={`lt-admin-dropzone ${isDropOver ? "is-dragover" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            if (isPremium) setPremiumDropOver(true);
            else setStandardDropOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            if (isPremium) setPremiumDropOver(false);
            else setStandardDropOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (isPremium) setPremiumDropOver(false);
            else setStandardDropOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              processBatchUpload(e.dataTransfer.files, tier);
            }
          }}
          onClick={() => fileRef.current?.click()}
          style={{
            borderColor: dropzoneBorder,
            padding: "14px 12px",
            minHeight: 88,
            marginBottom: 8,
          }}
        >
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: isPremium ? "rgba(188, 154, 108, 0.18)" : "rgba(45, 80, 52, 0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: isPremium ? "var(--reu-800)" : "#2D5034" }}>
            <Icon name="upload" size={17} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: isPremium ? "var(--reu-800)" : "#2D5034" }}>
            {isUploading
              ? `Đang tải ${uploadProgress ? `${uploadProgress.current}/${uploadProgress.total}` : ""} ảnh cho ${isPremium ? "Premium" : "Tiêu chuẩn"}...`
              : `Kéo & thả ảnh vào đây hoặc bấm tải lên`}
          </div>
          <div style={{ fontSize: 11, color: "var(--stone-600)" }}>
            Thêm ảnh cho phân hạng <strong>{isPremium ? "Premium" : "Tiêu chuẩn"}</strong> (JPG, PNG, WebP)
          </div>
        </div>

        {/* Preset Picker & URL Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setShowSamplePicker(!showSamplePicker)}
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                border: "1px solid var(--border-hairline)",
                background: showSamplePicker ? "var(--paper-200)" : "#FFFFFF",
                fontSize: 11.5,
                color: "var(--stone-800)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontWeight: 500,
              }}
            >
              <Icon name="star" size={12} color={isPremium ? "var(--tra-500)" : "#2D5034"} />
              <span>{showSamplePicker ? "Đóng kho ảnh mẫu" : `Chọn ảnh mẫu cho ${isPremium ? "Premium" : "Tiêu chuẩn"}`}</span>
            </button>
          </div>

          {showSamplePicker && (
            <div style={{ background: "var(--paper-50)", border: "1px solid var(--border-hairline)", borderRadius: 8, padding: "8px 10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, maxHeight: 180, overflowY: "auto" }}>
              {SAMPLE_PHOTOS.filter((s) => (isPremium ? s.tier === "premium" || !s.tier : s.tier === "standard" || !s.tier)).map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => handleAddSample(s.value, s.label, tier)}
                  style={{
                    padding: "5px 7px",
                    borderRadius: 5,
                    border: "1px solid #DFD2BB",
                    background: "#FFFFFF",
                    fontSize: 11,
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
              placeholder={`Dán đường dẫn ảnh /assets/... cho ${isPremium ? "Premium" : "Tiêu chuẩn"}`}
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              className="lt-admin-input"
              style={{ height: 30, fontSize: 11.5 }}
            />
            <button
              type="button"
              onClick={() => handleAddCustomUrl(tier)}
              style={{
                height: 30,
                padding: "0 10px",
                borderRadius: 6,
                border: "1px solid var(--border-hairline)",
                background: "#FFFFFF",
                fontSize: 11.5,
                fontWeight: 600,
                color: isPremium ? "var(--reu-800)" : "#2D5034",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Thêm
            </button>
          </div>
        </div>

        {/* List of Images */}
        <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--stone-800)", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Ảnh phân hạng {isPremium ? "Premium" : "Tiêu chuẩn"} ({list.length}):</span>
          {list.length > 1 && (
            <span style={{ fontSize: 10.5, color: "var(--stone-500)", fontWeight: 400 }}>
              Kéo thả hoặc bấm ↑ ↓ để đổi vị trí
            </span>
          )}
        </div>

        {list.length === 0 ? (
          <div style={{ padding: "16px 12px", textAlign: "center", background: "var(--paper-50)", borderRadius: 7, border: "1px dashed var(--border-hairline)", color: "var(--stone-600)", fontSize: 11.5 }}>
            {isPremium
              ? "Chưa có ảnh Premium. Vui lòng tải ảnh lên hoặc chọn ảnh mẫu."
              : "Chưa có ảnh riêng cho Tiêu chuẩn. Thêm ảnh để khi khách bấm \"Tiêu chuẩn\" trên trang mua hàng sẽ thấy hộp này."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "360px", overflowY: "auto", overflowX: "hidden", paddingRight: 2 }}>
            {list.map((item, index) => {
              const isPrimary = index === 0;
              const isDragged = draggedItem?.tier === tier && draggedItem.index === index;
              const isOver = dragOverItem?.tier === tier && dragOverItem.index === index;
              const isTouchDragging = touchDragState?.tier === tier && touchDragState.index === index;
              const isTouchOver = touchStateRef.current.tier === tier && touchOverIndex === index && touchDragState?.index !== index;

              return (
                <div
                  key={item.id}
                  data-image-index={index}
                  data-image-tier={tier}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index, tier)}
                  onDragOver={(e) => handleDragOver(e, index, tier)}
                  onDrop={(e) => handleDrop(e, index, tier)}
                  onDragEnd={handleDragEnd}
                  className={`lt-admin-image-card ${isPrimary ? "is-primary" : ""} ${isDragged ? "is-dragged" : ""} ${isOver ? "is-dragover" : ""} ${isTouchDragging ? "is-touch-dragging" : ""} ${isTouchOver ? "is-touch-over" : ""}`}
                  style={{
                    background: isPrimary
                      ? (isPremium ? "linear-gradient(to right, #FFFDF8, #FFFFFF)" : "linear-gradient(to right, #F5FAF6, #FFFFFF)")
                      : "#FFFFFF",
                    borderColor: isPrimary
                      ? (isPremium ? "#DFBE89" : "#B8D6BF")
                      : "var(--border-hairline)",
                  }}
                >
                  <div className="lt-admin-image-card-main">
                    <div
                      className={`lt-admin-drag-handle ${isTouchDragging ? "is-active" : ""}`}
                      onTouchStart={(e) => handleTouchStart(e, index, tier)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onTouchCancel={handleTouchCancel}
                      title="Kéo thả để đổi thứ tự"
                      style={{
                        color: isPrimary ? (isPremium ? "var(--tra-500)" : "#2D5034") : "var(--stone-500)",
                        cursor: isTouchDragging ? "grabbing" : "grab",
                        userSelect: "none",
                        touchAction: "none",
                      }}
                    >
                      ⋮⋮
                    </div>

                    <button
                      type="button"
                      draggable={false}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewState({ tier, index });
                      }}
                      title="Bấm để phóng to xem ảnh"
                      style={{
                        width: 48,
                        height: 48,
                        minWidth: 48,
                        borderRadius: 6,
                        border: isPrimary ? (isPremium ? "1.5px solid #DFBE89" : "1.5px solid #B8D6BF") : "1px solid var(--border-hairline)",
                        background: "#FAF8F5",
                        backgroundImage: `url('${photo(item.url)}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        flexShrink: 0,
                        position: "relative",
                        cursor: "zoom-in",
                        padding: 0,
                        overflow: "hidden",
                      }}
                    >
                      <span className="lt-thumb-zoom-overlay">
                        <Icon name="search" size={14} />
                      </span>
                    </button>

                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                        {isPrimary ? (
                          <span
                            style={{
                              fontSize: 10.5,
                              fontWeight: 700,
                              color: isPremium ? "#94723F" : "#2D5034",
                              background: isPremium ? "#FBF3E4" : "#EDF5EF",
                              border: `1px solid ${isPremium ? "#DFBE89" : "#B8D6BF"}`,
                              padding: "1px 6px",
                              borderRadius: 4,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            ⭐ #1 Ảnh bìa {isPremium ? "Premium" : "Tiêu chuẩn"}
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: 10.5,
                              fontWeight: 600,
                              color: "var(--stone-600)",
                              background: "var(--paper-100)",
                              border: "1px solid var(--border-hairline)",
                              padding: "1px 6px",
                              borderRadius: 4,
                            }}
                          >
                            #{index + 1} Ảnh phụ
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewState({ tier, index });
                        }}
                        title={`Xem ảnh lớn: ${item.url}`}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          textAlign: "left",
                          fontSize: 11,
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
                          {item.url.length > 32 ? `${item.url.slice(0, 29)}...` : item.url}
                        </code>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(index, tier);
                      }}
                      title="Xóa ảnh này"
                      className="lt-admin-card-quick-del"
                    >
                      <Icon name="trash-2" size={14} />
                    </button>
                  </div>

                  {/* Toolbar */}
                  <div className="lt-admin-image-toolbar" style={{ paddingTop: 4, borderTop: "1px solid var(--paper-200, #EEE4D2)", display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewState({ tier, index });
                      }}
                      className="lt-admin-toolbar-btn"
                      title="Xem phóng to"
                    >
                      <Icon name="search" size={12} />
                      <span>Xem</span>
                    </button>

                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(index, tier)}
                        className="lt-admin-toolbar-btn lt-admin-btn-primary-set"
                        title="Đặt làm ảnh bìa cho phân hạng này"
                      >
                        ⭐ Làm bìa
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1, tier)}
                      className="lt-admin-toolbar-btn lt-admin-btn-move"
                      title="Lên trước"
                    >
                      ↑ Lên
                    </button>

                    <button
                      type="button"
                      disabled={index === list.length - 1}
                      onClick={() => handleMove(index, 1, tier)}
                      className="lt-admin-toolbar-btn lt-admin-btn-move"
                      title="Xuống sau"
                    >
                      ↓ Xuống
                    </button>

                    {/* Quick Move Across Tiers */}
                    <button
                      type="button"
                      onClick={() => handleMoveTier(index, tier)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: 5,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        border: "1px solid var(--border-hairline)",
                        background: isPremium ? "#F3F8F4" : "#FCF8F1",
                        color: isPremium ? "#2D5034" : "#94723F",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        transition: "all 120ms ease",
                      }}
                      title={`Chuyển ảnh này sang phân hạng ${targetLabel}`}
                    >
                      <span>⇄ Sang {targetLabel}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index, tier)}
                      className="lt-admin-toolbar-btn lt-admin-btn-delete"
                      title="Xóa ảnh"
                      style={{ marginLeft: "auto" }}
                    >
                      <Icon name="trash-2" size={12} />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
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

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
                <div>
                  <label className="lt-admin-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span>👑 Giá cơ sở Premium (VND) *</span>
                  </label>
                  <input
                    type="number"
                    step={1000}
                    inputMode="numeric"
                    required
                    placeholder="VD: 559000"
                    value={base}
                    onChange={(e) => setBase(e.target.value)}
                    className="lt-admin-input"
                    style={{ fontSize: 15, fontWeight: 700, color: "var(--reu-800, #24341F)" }}
                  />
                  <span style={{ fontSize: 11, color: "var(--stone-600, #74684F)", marginTop: 3, display: "block" }}>
                    Giá cho hộp 200g Premium (hoặc trọn set)
                  </span>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <label className="lt-admin-label" style={{ margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>🏷️ Giá cơ sở Tiêu chuẩn (VND)</span>
                    </label>
                    {Number(base) > 0 && (
                      <button
                        type="button"
                        onClick={() => setStandardBase(Math.round(Number(base) * 0.75 / 1000) * 1000)}
                        style={{ fontSize: 11, color: "var(--tra-600, #94723F)", background: "transparent", border: 0, cursor: "pointer", fontWeight: 600, textDecoration: "underline", padding: 0 }}
                      >
                        = 75% ({Math.round(Number(base) * 0.75 / 1000 * 1000).toLocaleString("vi-VN")}₫)
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    step={1000}
                    inputMode="numeric"
                    placeholder={Number(base) > 0 ? `Tự động: ${(Math.round(Number(base) * 0.75 / 1000) * 1000).toLocaleString("vi-VN")}₫` : "VD: 419000"}
                    value={standardBase}
                    onChange={(e) => setStandardBase(e.target.value)}
                    className="lt-admin-input"
                    style={{ fontSize: 15, fontWeight: 600, color: "var(--reu-700, #2D5034)" }}
                  />
                  <span style={{ fontSize: 11, color: "var(--stone-600, #74684F)", marginTop: 3, display: "block" }}>
                    {standardBase ? "Đang đặt giá riêng cho Tiêu chuẩn" : `Để trống sẽ tự động tính = 75% giá Premium`}
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

          {/* ════════════ RIGHT COLUMN: MEDIA GALLERY BY TIER (PREMIUM & TIÊU CHUẨN) ════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Hidden multi-file inputs */}
            <input
              type="file"
              ref={premiumFileInputRef}
              multiple
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processBatchUpload(e.target.files, "premium");
                }
              }}
            />
            <input
              type="file"
              ref={standardFileInputRef}
              multiple
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processBatchUpload(e.target.files, "standard");
                }
              }}
            />

            <div className="lt-admin-form-section" style={{ position: "sticky", top: 12 }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, paddingBottom: 10, borderBottom: "1px solid var(--paper-200, #EEE4D2)" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--reu-800)", display: "flex", alignItems: "center", gap: 7 }}>
                    <Icon name="sliders-horizontal" size={17} color="var(--tra-500)" />
                    <span>Bộ sưu tập ảnh theo phân hạng</span>
                  </h3>
                  <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "var(--stone-600)" }}>
                    Quản lý ảnh riêng cho từng dòng sản phẩm hiển thị trên trang mua hàng
                  </p>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#94723F", background: "#FBF3E4", padding: "3px 8px", borderRadius: 999, border: "1px solid #DFBE89" }}>
                    👑 {premiumImages.length} Premium
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#2D5034", background: "#EDF5EF", padding: "3px 8px", borderRadius: 999, border: "1px solid #B8D6BF" }}>
                    🏷️ {standardImages.length} Tiêu chuẩn
                  </span>
                </div>
              </div>

              {/* Segmented Switcher / Tabs */}
              <div style={{ display: "flex", padding: 3, borderRadius: 8, background: "var(--paper-100, #F7F0E3)", border: "1px solid var(--border-hairline, #DFD2BB)", marginTop: 10, gap: 4 }}>
                <button
                  type="button"
                  onClick={() => setImageTab("premium")}
                  style={{
                    flex: 1, padding: "7px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none",
                    background: imageTab === "premium" ? "#FFFFFF" : "transparent",
                    color: imageTab === "premium" ? "var(--reu-800)" : "var(--stone-600)",
                    boxShadow: imageTab === "premium" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    transition: "all 120ms ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <span>👑 Ảnh Premium</span>
                  <span style={{ fontSize: 10.5, opacity: 0.85, background: imageTab === "premium" ? "#FBF3E4" : "transparent", padding: "1px 5px", borderRadius: 999 }}>
                    ({premiumImages.length})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setImageTab("standard")}
                  style={{
                    flex: 1, padding: "7px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none",
                    background: imageTab === "standard" ? "#FFFFFF" : "transparent",
                    color: imageTab === "standard" ? "#2D5034" : "var(--stone-600)",
                    boxShadow: imageTab === "standard" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    transition: "all 120ms ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <span>🏷️ Ảnh Tiêu chuẩn</span>
                  <span style={{ fontSize: 10.5, opacity: 0.85, background: imageTab === "standard" ? "#EDF5EF" : "transparent", padding: "1px 5px", borderRadius: 999 }}>
                    ({standardImages.length})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setImageTab("both")}
                  style={{
                    padding: "7px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                    background: imageTab === "both" ? "#FFFFFF" : "transparent",
                    color: imageTab === "both" ? "var(--reu-800)" : "var(--stone-600)",
                    boxShadow: imageTab === "both" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    transition: "all 120ms ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  }}
                >
                  <span>📋 Cả hai</span>
                </button>
              </div>

              {/* Render Sections */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
                {(imageTab === "premium" || imageTab === "both") && renderTierBlock("premium")}
                {(imageTab === "standard" || imageTab === "both") && renderTierBlock("standard")}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════ STICKY LUXURY MODAL FOOTER ════════════ */}
        <div className="lt-admin-modal-footer">
          <div className="lt-admin-footer-preview" style={{ gap: 16, flexWrap: "wrap" }}>
            {/* Premium cover */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: "var(--reu-800)" }}>👑 Bìa Premium:</span>
              {premiumImages[0] ? (
                <button
                  type="button"
                  onClick={() => setPreviewState({ tier: "premium", index: 0 })}
                  title="Bấm để xem ảnh phóng to"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 600, color: "var(--reu-800)", background: "transparent", border: 0, cursor: "pointer", padding: 0, minWidth: 0 }}
                >
                  <span
                    style={{ width: 22, height: 22, borderRadius: 4, backgroundImage: `url('${photo(premiumImages[0].url)}')`, backgroundSize: "cover", backgroundPosition: "center", border: "1px solid #DFBE89", display: "inline-block", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 11.5, textDecoration: "underline", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {premiumImages[0].url}
                  </span>
                </button>
              ) : (
                <span style={{ fontSize: 11.5, color: "#DC2626" }}>Chưa có</span>
              )}
            </div>

            {/* Standard cover */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#2D5034" }}>🏷️ Bìa Tiêu chuẩn:</span>
              {standardImages[0] ? (
                <button
                  type="button"
                  onClick={() => setPreviewState({ tier: "standard", index: 0 })}
                  title="Bấm để xem ảnh phóng to"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 600, color: "#2D5034", background: "transparent", border: 0, cursor: "pointer", padding: 0, minWidth: 0 }}
                >
                  <span
                    style={{ width: 22, height: 22, borderRadius: 4, backgroundImage: `url('${photo(standardImages[0].url)}')`, backgroundSize: "cover", backgroundPosition: "center", border: "1px solid #B8D6BF", display: "inline-block", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 11.5, textDecoration: "underline", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {standardImages[0].url}
                  </span>
                </button>
              ) : (
                <span style={{ fontSize: 11.5, color: "var(--stone-500)", fontStyle: "italic" }}>(Chưa đặt ảnh riêng)</span>
              )}
            </div>
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
      {mounted && previewState !== null && activeLightboxImages[previewState.index] && createPortal(
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
            if (e.target === e.currentTarget) setPreviewState(null);
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
                  color: previewState.tier === "premium" ? "#DFBE89" : "#B8D6BF",
                  background: previewState.tier === "premium" ? "rgba(188, 154, 108, 0.25)" : "rgba(45, 80, 52, 0.3)",
                  border: `1px solid ${previewState.tier === "premium" ? "#DFBE89" : "#B8D6BF"}`,
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                {previewState.tier === "premium" ? "👑 Phân hạng Premium" : "🏷️ Phân hạng Tiêu chuẩn"}
              </span>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#F7F0E3",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                {previewState.index === 0 ? "⭐ #1 Ảnh bìa" : `#${previewState.index + 1} Ảnh phụ`}
              </span>
              <span style={{ fontSize: 13, color: "var(--tra-300, #D9BF94)" }}>
                ({previewState.index + 1} / {activeLightboxImages.length})
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
                {activeLightboxImages[previewState.index].url}
              </code>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Copy link */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(activeLightboxImages[previewState.index].url);
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

              {previewState.index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(previewState.index, previewState.tier)}
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
                  ⭐ Đặt làm ảnh bìa {previewState.tier === "premium" ? "Premium" : "Tiêu chuẩn"}
                </button>
              )}

              <a
                href={photo(activeLightboxImages[previewState.index].url)}
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
                onClick={() => setPreviewState(null)}
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

          {/* Lightbox Center Stage with Touch Swipe */}
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
              if (e.target === e.currentTarget) setPreviewState(null);
            }}
          >
            {/* Prev button */}
            {activeLightboxImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewState((prev) => (prev ? { tier: prev.tier, index: prev.index > 0 ? prev.index - 1 : activeLightboxImages.length - 1 } : null));
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
                src={photo(activeLightboxImages[previewState.index].url)}
                alt={activeLightboxImages[previewState.index].alt || name}
                onClick={() => setLightboxZoomed((prev) => !prev)}
                style={{
                  maxWidth: lightboxZoomed ? "none" : "100%",
                  maxHeight: lightboxZoomed ? "none" : "72vh",
                  objectFit: "contain",
                  borderRadius: 12,
                  border: `2px solid ${previewState.tier === "premium" ? "rgba(188, 154, 108, 0.4)" : "rgba(45, 80, 52, 0.4)"}`,
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.65)",
                  cursor: lightboxZoomed ? "zoom-out" : "zoom-in",
                  userSelect: "none",
                }}
                title={lightboxZoomed ? "Bấm để thu vừa màn hình" : "Bấm để phóng to 100%"}
              />
            </div>

            {/* Next button */}
            {activeLightboxImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewState((prev) => (prev ? { tier: prev.tier, index: prev.index < activeLightboxImages.length - 1 ? prev.index + 1 : 0 } : null));
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
          {activeLightboxImages.length > 1 && (
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
              {activeLightboxImages.map((img, idx) => {
                const isActive = idx === previewState.index;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setPreviewState({ tier: previewState.tier, index: idx })}
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
