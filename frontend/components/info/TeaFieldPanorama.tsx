"use client";

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Viewer } from "@photo-sphere-viewer/core";
import type { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { Icon } from "@/components/ds";

export type SceneId = "xuong-che" | "nuong-che";

type Spot = {
  id: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  icon: string;
  yaw: string;
  pitch: string;
};

type SceneConfig = {
  id: SceneId;
  badge: string;
  title: string;
  subtitle: string;
  icon: string;
  pano: { big: string; small: string };
  poster: { wide: string; tall: string; alt: string };
  start: { yaw: string; pitch: string; zoom: number };
  spots: Spot[];
};

/* Hai góc thực tế 360° ghép từ file Insta360 (.insp) tại HTX Chè Thanh Huyền Trà:
   - Xưởng sao chế biến: Camera01/IMG_20181002_235206_00_007.insp
   - Nương chè trung du: Camera01/IMG_20181002_222703_00_002.insp
   Bản 8K cho màn hình lớn, 4K cho điện thoại (tránh vượt giới hạn texture GPU di động). */
const SCENES: Record<SceneId, SceneConfig> = {
  "xuong-che": {
    id: "xuong-che",
    badge: "Không gian 01 · Xưởng chế biến",
    title: "Xưởng sao & vò chè",
    subtitle: "Bên trong khu vực làm héo, băng chuyền nạp búp tươi, tôn quay diệt men và dàn cối vò chè truyền thống.",
    icon: "Flame",
    pano: {
      big: "/assets/pano/xuong-che-8k.webp",
      small: "/assets/pano/xuong-che-4k.webp",
    },
    poster: {
      wide: "/assets/pano/xuong-poster-wide.webp",
      tall: "/assets/pano/xuong-poster-tall.webp",
      alt: "Không gian xưởng chế biến chè Lam Trà với búp chè tươi trải sàn làm héo, băng chuyền nạp lá và tôn quay diệt men",
    },
    start: { yaw: "-128deg", pitch: "-8deg", zoom: 48 },
    spots: [
      {
        id: "lam-heo",
        title: "Sàn rải & nong làm héo búp tươi",
        text: "Búp chè vừa hái từ đồi về được rải đều trên nong tre và sàn thoáng khí, đảo nhẹ tay để thoát bớt hơi nước sương sớm, giúp lá dẻo mềm trước khi đưa vào lò mà không bị gãy nát.",
        href: "/cau-chuyen#hanh-trinh",
        cta: "Xem 5 công đoạn làm trà",
        icon: "leaf",
        yaw: "-148deg",
        pitch: "-18deg",
      },
      {
        id: "bang-chuyen",
        title: "Băng chuyền nạp búp chè",
        text: "Sau khi đạt độ héo vừa tới, búp chè xanh non được đưa lên băng chuyền tự động theo định lượng đều đặn, chuyển thẳng vào buồng nhiệt diệt men.",
        href: "/san-pham",
        cta: "Khám phá các dòng trà",
        icon: "package",
        yaw: "118deg",
        pitch: "-10deg",
      },
      {
        id: "ton-quay",
        title: "Lò tôn quay diệt men & lấy hương",
        text: "Trống quay bằng thép truyền nhiệt đều ở ngưỡng 260–280°C giúp khóa men oxy hóa đúng thời điểm, giữ màu nước xanh ánh vàng và đánh thức hương cốm non đặc trưng của trà Tân Cương.",
        href: "/tra-dam",
        cta: "Đọc thêm tại Trà đàm",
        icon: "thermometer",
        yaw: "-82deg",
        pitch: "-6deg",
      },
      {
        id: "coi-vo",
        title: "Dàn máy vò tạo hình cánh trà",
        text: "Chè sau khi diệt men được đưa sang dàn cối vò lực ép vừa phải để cuộn xoăn cánh trà thành hình móc câu săn chắc và giúp dịch trà tiết nhẹ ra bề mặt, khi pha dậy vị đậm đà.",
        href: "/chung-nhan",
        cta: "Hồ sơ chất lượng VietGAP",
        icon: "shield-check",
        yaw: "38deg",
        pitch: "-14deg",
      },
    ],
  },
  "nuong-che": {
    id: "nuong-che",
    badge: "Không gian 02 · Vùng nguyên liệu",
    title: "Nương chè Thanh Huyền Trà",
    subtitle: "Đồi chè trung du Tân Cương ngập nắng sớm nơi những búp chè non đạt chuẩn VietGAP được thu hái thủ công.",
    icon: "leaf",
    pano: {
      big: "/assets/pano/nuong-che-8k.webp",
      small: "/assets/pano/nuong-che-4k.webp",
    },
    poster: {
      wide: "/assets/pano/poster-wide.webp",
      tall: "/assets/pano/poster-tall.webp",
      alt: "Nhân viên Lam Trà đội nón lá đứng trước biển HTX Chè Thanh Huyền Trà, giữa nương chè xanh Tân Cương",
    },
    start: { yaw: "-88deg", pitch: "-8deg", zoom: 50 },
    spots: [
      {
        id: "htx",
        title: "HTX Chè Thanh Huyền Trà",
        text: "Đơn vị chế biến chè Lam Trà hợp tác, có chứng nhận cơ sở đủ điều kiện an toàn thực phẩm và chứng nhận VietGAP cho vùng chè búp tươi.",
        href: "/chung-nhan",
        cta: "Xem hồ sơ chứng nhận",
        icon: "shield-check",
        yaw: "-121deg",
        pitch: "-14deg",
      },
      {
        id: "nuong",
        title: "Nương chè trung du Tân Cương",
        text: "Hàng chè được tỉa thấp ngang hông để hái tay chuẩn 1 tôm 1–2 lá non, rồi chuyển ngay về xưởng làm héo, diệt men, vò và sao lấy hương.",
        href: "/san-pham",
        cta: "Xem các loại trà",
        icon: "leaf",
        yaw: "-48deg",
        pitch: "-20deg",
      },
    ],
  },
};

const SCENE_LIST: SceneConfig[] = [SCENES["xuong-che"], SCENES["nuong-che"]];

const SPOT_HTML = '<span class="lt-pano-spot" aria-hidden="true"><span></span></span>';

type Status = "poster" | "loading" | "ready" | "error";

export function TeaFieldPanorama({
  defaultScene = "xuong-che",
  compact = false,
}: {
  defaultScene?: SceneId;
  compact?: boolean;
}) {
  const [sceneId, setSceneId] = useState<SceneId>(defaultScene);
  const scene = SCENES[sceneId];

  const stageRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const markersRef = useRef<MarkersPlugin | null>(null);
  const pendingSpot = useRef<string | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [status, setStatus] = useState<Status>("poster");
  const [sheet, setSheet] = useState(false);
  const [spot, setSpot] = useState<Spot | null>(null);
  const [touched, setTouched] = useState(false);

  const prefetch = useCallback(() => {
    void import("@photo-sphere-viewer/core");
    void import("@photo-sphere-viewer/markers-plugin");
  }, []);

  const goTo = useCallback((id: string, currentSpots: Spot[]) => {
    const s = currentSpots.find((x) => x.id === id);
    const viewer = viewerRef.current;
    if (!s || !viewer) return;
    setSpot(s);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      viewer.rotate({ yaw: s.yaw, pitch: s.pitch });
    } else {
      void markersRef.current?.gotoMarker(id, 1000);
    }
  }, []);

  const teardown = useCallback(() => {
    viewerRef.current?.destroy();
    viewerRef.current = null;
    markersRef.current = null;
    setSpot(null);
    setTouched(false);
    setStatus("poster");
  }, []);

  const buildMarkers = useCallback((spots: Spot[]) => {
    return spots.map((s) => ({
      id: s.id,
      html: SPOT_HTML,
      size: { width: 44, height: 44 },
      anchor: "center center",
      position: { yaw: s.yaw, pitch: s.pitch },
      tooltip: { content: s.title, position: "top center", className: "lt-pano-tip" },
    }));
  }, []);

  const open = useCallback(
    async (spotId?: string, targetSceneId?: SceneId) => {
      const activeScene = SCENES[targetSceneId ?? sceneId];
      openerRef.current = document.activeElement as HTMLElement | null;
      const small = window.matchMedia("(max-width: 719px)").matches;
      if (small) setSheet(true);

      if (viewerRef.current && (!targetSceneId || targetSceneId === sceneId)) {
        if (spotId) goTo(spotId, activeScene.spots);
        return;
      }

      if (!stageRef.current || status === "loading") return;
      pendingSpot.current = spotId ?? null;
      setStatus("loading");

      try {
        const [{ Viewer }, { MarkersPlugin }] = await Promise.all([
          import("@photo-sphere-viewer/core"),
          import("@photo-sphere-viewer/markers-plugin"),
        ]);
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        const wide = Math.max(window.screen.width, window.screen.height) * window.devicePixelRatio >= 1900;
        const panoUrl = !coarse && wide ? activeScene.pano.big : activeScene.pano.small;

        if (viewerRef.current) {
          await viewerRef.current.setPanorama(panoUrl, {
            position: { yaw: activeScene.start.yaw, pitch: activeScene.start.pitch },
            zoom: activeScene.start.zoom,
            showLoader: true,
          });
          markersRef.current?.setMarkers(buildMarkers(activeScene.spots));
          setStatus("ready");
          if (pendingSpot.current) {
            goTo(pendingSpot.current, activeScene.spots);
            pendingSpot.current = null;
          }
          return;
        }

        const viewer = new Viewer({
          container: stageRef.current,
          panorama: panoUrl,
          defaultYaw: activeScene.start.yaw,
          defaultPitch: activeScene.start.pitch,
          defaultZoomLvl: activeScene.start.zoom,
          minFov: 35,
          maxFov: 95,
          mousewheelCtrlKey: !small,
          navbar: small ? ["zoom"] : ["zoom", "fullscreen"],
          loadingTxt: "Đang mở không gian 360°…",
          lang: {
            zoom: "Thu phóng",
            zoomOut: "Thu nhỏ",
            zoomIn: "Phóng to",
            fullscreen: "Toàn màn hình",
            loading: "Đang mở không gian 360°…",
            close: "Đóng",
            twoFingers: "Dùng hai ngón tay để xoay ảnh",
            ctrlZoom: "Giữ Ctrl và cuộn chuột để phóng to",
            loadError: "Không tải được ảnh 360°",
            webglError: "Trình duyệt này chưa hỗ trợ xem ảnh 360°",
          },
          plugins: [
            [
              MarkersPlugin,
              {
                defaultHoverScale: false,
                markers: buildMarkers(activeScene.spots),
              },
            ],
          ],
        });

        viewerRef.current = viewer;
        const markers = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
        markersRef.current = markers;
        markers.addEventListener("select-marker", ({ marker }) => {
          const current = SCENES[sceneIdRef.current];
          goTo(marker.id, current.spots);
        });
        viewer.addEventListener("panorama-error", () => setStatus("error"));
        viewer.addEventListener("click", () => setTouched(true));
        viewer.addEventListener(
          "ready",
          () => {
            setStatus("ready");
            if (pendingSpot.current) {
              goTo(pendingSpot.current, activeScene.spots);
            }
            pendingSpot.current = null;
          },
          { once: true },
        );
      } catch {
        setStatus("error");
      }
    },
    [buildMarkers, goTo, sceneId, status],
  );

  const sceneIdRef = useRef<SceneId>(sceneId);
  useEffect(() => {
    sceneIdRef.current = sceneId;
  }, [sceneId]);

  const switchScene = useCallback(
    (nextId: SceneId) => {
      if (nextId === sceneId) return;
      setSceneId(nextId);
      setSpot(null);
      setTouched(false);
      if (viewerRef.current) {
        void open(undefined, nextId);
      }
    },
    [open, sceneId],
  );

  const closeSheet = useCallback(() => {
    setSheet(false);
    teardown();
    openerRef.current?.focus();
  }, [teardown]);

  useEffect(() => {
    if (!sheet) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSheet();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheet, closeSheet]);

  useEffect(() => () => viewerRef.current?.destroy(), []);

  const live = status === "loading" || status === "ready";

  return (
    <section className={`lt-pano-section${compact ? " is-compact" : ""}`} aria-labelledby="lt-pano-heading">
      <div className="lt-container">
        {/* Header & Scene Switcher */}
        <div className="lt-pano-header">
          <div className="lt-pano-title-group">
            <div className="lt-pano-eyebrow">
              <span className="lt-pano-live-dot" aria-hidden="true" />
              <span>Trải nghiệm thực tế 360° · HTX Chè Thanh Huyền Trà</span>
            </div>
            <h2 id="lt-pano-heading" className="lt-pano-heading">
              Từ <span>nương chè</span> đến <span>xưởng sao</span>
            </h2>
            <p className="lt-pano-desc">{scene.subtitle}</p>
          </div>

          <div className="lt-pano-tabs" role="tablist" aria-label="Chọn không gian 360°">
            {SCENE_LIST.map((item) => {
              const active = item.id === sceneId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`lt-pano-tab${active ? " is-active" : ""}`}
                  onClick={() => switchScene(item.id)}
                  onPointerEnter={prefetch}
                >
                  <span className="lt-pano-tab-badge">{item.id === "xuong-che" ? "01" : "02"}</span>
                  <span className="lt-pano-tab-text">
                    <strong>{item.title}</strong>
                    <small>{item.id === "xuong-che" ? "4 điểm thuyết minh" : "2 điểm thuyết minh"}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 360 Viewport Frame */}
        <div
          className={`lt-pano-frame${sheet ? " is-sheet" : ""}`}
          data-status={status}
          role={sheet ? "dialog" : undefined}
          aria-modal={sheet || undefined}
          aria-label={sheet ? `Ảnh 360° ${scene.title}` : undefined}
          onPointerEnter={prefetch}
        >
          <div
            ref={stageRef}
            className="lt-pano-stage"
            tabIndex={status === "ready" ? 0 : -1}
            aria-label={`Không gian 360° ${scene.title}. Dùng chuột kéo hoặc phím mũi tên để xoay góc nhìn.`}
            onFocus={() => viewerRef.current?.startKeyboardControl()}
            onBlur={() => viewerRef.current?.stopKeyboardControl()}
            onPointerDown={() => setTouched(true)}
          />

          <picture className="lt-pano-poster" aria-hidden={live}>
            <source media="(max-width: 719px)" srcSet={scene.poster.tall} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scene.poster.wide}
              alt={scene.poster.alt}
              width={2400}
              height={1028}
              loading="lazy"
              decoding="async"
            />
          </picture>

          {/* Top Bar inside Frame */}
          <div className="lt-pano-topbar">
            <span className="lt-pano-scene-pill">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <ellipse cx="12" cy="12" rx="10" ry="4" />
                <path d="M12 2v20" opacity="0.5" />
              </svg>
              {scene.badge}: <strong>{scene.title}</strong>
            </span>

            {live && (
              <button
                type="button"
                className="lt-pano-reset-btn"
                onClick={() => {
                  setSpot(null);
                  viewerRef.current?.animate({
                    yaw: scene.start.yaw,
                    pitch: scene.start.pitch,
                    zoom: scene.start.zoom,
                    speed: "2rpm",
                  });
                }}
              >
                <Icon name="rotate-ccw" size={14} />
                <span>Góc nhìn chuẩn</span>
              </button>
            )}
          </div>

          {!live && (
            <div className="lt-pano-cta">
              <button type="button" className="lt-pano-open" onClick={() => open()} onFocus={prefetch}>
                <span className="lt-pano-open-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="12" rx="10" ry="4.2" />
                    <path d="M12 3.5v17" opacity=".55" />
                    <path d="m17.5 14.6 2.4 1.1-1.3 2.3" />
                  </svg>
                </span>
                <span className="lt-pano-open-copy">
                  <strong>Bước vào không gian 360°</strong>
                  <small>Kéo xoay toàn cảnh hoặc chạm vào các điểm thuyết minh</small>
                </span>
              </button>
              {status === "error" && (
                <p className="lt-pano-error" role="alert">
                  Không tải được ảnh 360°. Vui lòng thử bấm lại nút trên.
                </p>
              )}
            </div>
          )}

          {status === "ready" && !touched && !spot && (
            <p className="lt-pano-hint" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              Kéo chuột hoặc vuốt ngang để xoay 360° quanh xưởng
            </p>
          )}

          {spot && (
            <div className="lt-pano-card" role="region" aria-live="polite" aria-label={spot.title}>
              <div className="lt-pano-card-head">
                <span className="lt-pano-card-icon">
                  <Icon name={spot.icon} size={16} />
                </span>
                <h3>{spot.title}</h3>
              </div>
              <p>{spot.text}</p>
              <Link href={spot.href} className="lt-pano-card-link">
                <span>{spot.cta}</span>
                <Icon name="arrow-right" size={15} />
              </Link>
              <button
                type="button"
                className="lt-pano-card-close"
                aria-label="Đóng thông tin"
                onClick={() => setSpot(null)}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
          )}

          {sheet && (
            <button ref={closeRef} type="button" className="lt-pano-sheet-close" onClick={closeSheet}>
              <Icon name="x" size={18} />
              Đóng 360°
            </button>
          )}
        </div>

        {/* Interactive Hotspots Bar */}
        <div className="lt-pano-spots-wrap">
          <span className="lt-pano-spots-label">Điểm thuyết minh trong góc nhìn này:</span>
          <ul className="lt-pano-spots" aria-label="Các điểm thuyết minh trong ảnh 360°">
            {scene.spots.map((s, idx) => {
              const active = spot?.id === s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className={active ? "is-active" : undefined}
                    aria-pressed={active}
                    onClick={() => open(s.id)}
                    onPointerEnter={prefetch}
                  >
                    <span className="lt-pano-spot-num">0{idx + 1}</span>
                    <Icon name={s.icon} size={16} />
                    <span>{s.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
