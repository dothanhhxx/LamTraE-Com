"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Viewer } from "@photo-sphere-viewer/core";
import type { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { Icon } from "@/components/ds";

export type SceneId = "nguon-goc" | "quy-trinh" | "minh-bach";

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

type PillarSceneConfig = {
  id: SceneId;
  step: string;
  pillarTitle: string;
  pillarCaption: string;
  spaceName: string;
  callouts: string[];
  icon: string;
  pano: { big: string; small: string };
  poster: { wide: string; tall: string; alt: string };
  start: { yaw: string; pitch: string; zoom: number };
  spots: Spot[];
};

/* Ba điểm chính kể câu chuyện chất lượng & quy trình làm chè bằng ảnh 360° thực tế (Insta360 .insp):
   01. Nguồn gốc tự nhiên (Camera01/IMG_20181002_222703_00_002.insp)
   02. Quy trình chế biến (Camera01/IMG_20181002_235206_00_007.insp)
   03. Trải nghiệm minh bạch (Camera01/IMG_20181003_012355_00_012.insp) */
export const PANO_SCENES: Record<SceneId, PillarSceneConfig> = {
  "nguon-goc": {
    id: "nguon-goc",
    step: "01",
    pillarTitle: "Nguồn gốc tự nhiên",
    pillarCaption:
      "Không gian đồi chè và vùng nguyên liệu sạch chuẩn VietGAP, khẳng định yếu tố tự nhiên, không sử dụng hóa chất.",
    spaceName: "Nương chè HTX Thanh Huyền Trà",
    callouts: ["Chuẩn VietGAP", "Không hóa chất", "Hái tay sương sớm"],
    icon: "leaf",
    pano: {
      big: "/assets/pano/nuong-che-8k.webp",
      small: "/assets/pano/nuong-che-4k.webp",
    },
    poster: {
      wide: "/assets/pano/poster-wide.webp",
      tall: "/assets/pano/poster-tall.webp",
      alt: "Không gian đồi chè tự nhiên tại HTX Chè Thanh Huyền Trà, Tân Cương, Thái Nguyên",
    },
    start: { yaw: "-88deg", pitch: "-8deg", zoom: 50 },
    spots: [
      {
        id: "htx",
        title: "Vùng nguyên liệu sạch HTX Thanh Huyền Trà",
        text: "Đơn vị hợp tác sản xuất chính thức của Lam Trà tại Tân Cương, có chứng nhận VietGAP cho vùng chè búp tươi và nhật ký canh tác kiểm soát nghiêm ngặt.",
        href: "/chung-nhan",
        cta: "Xem hồ sơ chứng nhận VietGAP",
        icon: "shield-check",
        yaw: "-121deg",
        pitch: "-14deg",
      },
      {
        id: "nuong",
        title: "Luống chè tỉa tán hái tay búp non",
        text: "Hàng chè được tỉa thấp ngang hông để hái thủ công từng búp 1 tôm 1–2 lá non khi sương sớm vừa tan, giữ nguyên độ tươi và dưỡng chất tự nhiên.",
        href: "/san-pham",
        cta: "Khám phá các dòng trà",
        icon: "leaf",
        yaw: "-48deg",
        pitch: "-20deg",
      },
      {
        id: "sinh-thai",
        title: "Hệ sinh thái tự nhiên · Không hóa chất",
        text: "Đất trung du pha cát tơi xốp bao quanh bởi núi đồi tự nhiên, chăm bón bằng phân hữu cơ vi sinh, không dùng thuốc diệt cỏ hay hóa chất kích tăng trưởng.",
        href: "/cau-chuyen#vung-dat",
        cta: "Tìm hiểu thổ nhưỡng Tân Cương",
        icon: "circle-check",
        yaw: "95deg",
        pitch: "-6deg",
      },
    ],
  },
  "quy-trinh": {
    id: "quy-trinh",
    step: "02",
    pillarTitle: "Quy trình chế biến",
    pillarCaption:
      "Toàn cảnh nhà máy xử lý và các công đoạn sản xuất chè thực tế: làm héo, nạp băng chuyền, diệt men tôn quay và vò chè.",
    spaceName: "Xưởng sao & vò chè thực tế",
    callouts: ["Làm héo tự nhiên", "Tôn quay 260–280°C", "Dàn cối vò chè"],
    icon: "thermometer",
    pano: {
      big: "/assets/pano/xuong-che-8k.webp",
      small: "/assets/pano/xuong-che-4k.webp",
    },
    poster: {
      wide: "/assets/pano/xuong-poster-wide.webp",
      tall: "/assets/pano/xuong-poster-tall.webp",
      alt: "Toàn cảnh nhà máy xử lý và các công đoạn sản xuất chè thực tế tại xưởng",
    },
    start: { yaw: "-128deg", pitch: "-8deg", zoom: 48 },
    spots: [
      {
        id: "lam-heo",
        title: "Công đoạn 1 · Rải sàn & nong tre làm héo",
        text: "Búp chè tươi vừa thu hái được rải đều trên nong tre và sàn thoáng khí, đảo nhẹ tay để thoát hơi nước sương sớm, giúp lá dẻo mềm trước khi sao mà không bị gãy nát.",
        href: "/cau-chuyen#hanh-trinh",
        cta: "Xem 5 công đoạn làm trà",
        icon: "leaf",
        yaw: "-148deg",
        pitch: "-18deg",
      },
      {
        id: "bang-chuyen",
        title: "Công đoạn 2 · Băng chuyền nạp búp định lượng",
        text: "Sau khi đạt độ héo vừa tới và dậy mùi hương thanh mát, búp chè được đưa lên băng chuyền inox sạch sẽ để cấp đều đặn vào buồng nhiệt diệt men.",
        href: "/san-pham",
        cta: "Xem sản phẩm trà nguyên búp",
        icon: "package",
        yaw: "118deg",
        pitch: "-10deg",
      },
      {
        id: "ton-quay",
        title: "Công đoạn 3 · Lò tôn quay diệt men & lấy hương",
        text: "Trống quay bằng thép truyền nhiệt ổn định ở ngưỡng 260–280°C giúp khóa men oxy hóa đúng thời điểm, giữ màu nước xanh ánh vàng và đánh thức hương cốm non tự nhiên.",
        href: "/tra-dam",
        cta: "Đọc bí quyết sao trà tại Trà đàm",
        icon: "thermometer",
        yaw: "-82deg",
        pitch: "-6deg",
      },
      {
        id: "coi-vo",
        title: "Công đoạn 4 · Dàn máy vò tạo hình cánh trà",
        text: "Chè sau khi diệt men được đưa sang dàn cối vò với lực ép vừa phải để cuộn xoăn cánh trà thành hình móc câu săn chắc, giúp dịch trà tiết nhẹ ra bề mặt để khi pha dậy vị đậm đà.",
        href: "/chung-nhan",
        cta: "Chứng nhận cơ sở đủ điều kiện ATTP",
        icon: "shield-check",
        yaw: "38deg",
        pitch: "-14deg",
      },
    ],
  },
  "minh-bach": {
    id: "minh-bach",
    step: "03",
    pillarTitle: "Trải nghiệm minh bạch",
    pillarCaption:
      "Cho phép người xem tự do quan sát mọi góc độ từ chứng nhận, bàn cân định lượng đến bàn thẩm định để củng cố niềm tin.",
    spaceName: "Phòng kiểm định, đóng gói & thưởng trà",
    callouts: ["Xoay 360° mọi góc độ", "Cân đúng định lượng", "Thẩm định từng mẻ"],
    icon: "shield-check",
    pano: {
      big: "/assets/pano/phong-tra-8k.webp",
      small: "/assets/pano/phong-tra-4k.webp",
    },
    poster: {
      wide: "/assets/pano/phong-tra-poster-wide.webp",
      tall: "/assets/pano/phong-tra-poster-tall.webp",
      alt: "Không gian phòng kiểm định, cân đóng gói và bàn trà thẩm định chất lượng tại Thanh Huyền Trà",
    },
    start: { yaw: "-10deg", pitch: "-14deg", zoom: 45 },
    spots: [
      {
        id: "chung-nhan-treo",
        title: "Chứng nhận VietGAP & ATTP niêm yết công khai",
        text: "Giấy chứng nhận VietGAP và hồ sơ đủ điều kiện an toàn thực phẩm được đóng khung niêm yết trực tiếp trên tường khu vực đón khách và đóng gói.",
        href: "/chung-nhan",
        cta: "Đối chiếu bản chụp chứng nhận gốc",
        icon: "shield-check",
        yaw: "-24deg",
        pitch: "-8deg",
      },
      {
        id: "ban-can",
        title: "Bàn cân điện tử & đóng gói hút chân không",
        text: "Từng gói trà vàng/xanh trước khi xuất xưởng đều được cân định lượng chính xác trên bàn cân điện tử, hàn kín hút chân không để khóa trọn hương cốm.",
        href: "/san-pham",
        cta: "Xem quy cách đóng gói từng dòng trà",
        icon: "scale",
        yaw: "-28deg",
        pitch: "-32deg",
      },
      {
        id: "ban-tham-dinh",
        title: "Bàn trà thẩm định chất lượng thực tế",
        text: "Đội ngũ Lam Trà trực tiếp ngồi thẩm định sắc nước, hương cốm và hậu ngọt của từng mẻ trà mới sao cùng nghệ nhân trước khi đưa vào phân phối.",
        href: "/lien-he",
        cta: "Đặt lịch ghé thưởng trà tại xưởng",
        icon: "circle-check",
        yaw: "28deg",
        pitch: "-26deg",
      },
      {
        id: "ke-thanh-pham",
        title: "Kệ lưu mẫu & trưng bày minh bạch phân hạng",
        text: "Mỗi dòng Trà Đinh, Nõn Tôm, Móc Câu và hộp quà đều được phân khu rõ ràng, ghi minh bạch khối lượng, vùng nguyên liệu và ngày đóng gói trên bao bì.",
        href: "/huong-dan",
        cta: "Xem hướng dẫn pha & bảo quản trà",
        icon: "package",
        yaw: "125deg",
        pitch: "-6deg",
      },
    ],
  },
};

const SCENE_LIST: PillarSceneConfig[] = [
  PANO_SCENES["nguon-goc"],
  PANO_SCENES["quy-trinh"],
  PANO_SCENES["minh-bach"],
];

const SPOT_HTML = '<span class="lt-pano-spot" aria-hidden="true"><span></span></span>';

type Status = "poster" | "loading" | "ready" | "error";

export function TeaFieldPanorama({
  defaultScene = "nguon-goc",
  compact = false,
  id = "khong-gian-360",
}: {
  defaultScene?: SceneId;
  compact?: boolean;
  id?: string;
}) {
  const [sceneId, setSceneId] = useState<SceneId>(defaultScene);
  const scene = PANO_SCENES[sceneId];

  const viewportWrapRef = useRef<HTMLDivElement>(null);
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

  const goTo = useCallback((spotId: string, currentSpots: Spot[]) => {
    const s = currentSpots.find((x) => x.id === spotId);
    const viewer = viewerRef.current;
    if (!s || !viewer) return;
    setSpot(s);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      viewer.rotate({ yaw: s.yaw, pitch: s.pitch });
    } else {
      void markersRef.current?.gotoMarker(spotId, 1000);
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
      const activeScene = PANO_SCENES[targetSceneId ?? sceneId];
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
          const current = PANO_SCENES[sceneIdRef.current];
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

  const selectPillar = useCallback(
    (nextId: SceneId, autoOpen = false) => {
      const changed = nextId !== sceneId;
      if (changed) {
        setSceneId(nextId);
        setSpot(null);
        setTouched(false);
      }
      if (viewerRef.current || autoOpen) {
        void open(PANO_SCENES[nextId].spots[0]?.id, nextId);
      }
    },
    [open, sceneId],
  );

  const stepSpot = useCallback(
    (delta: number) => {
      const spots = scene.spots;
      if (!spots.length) return;
      const idx = spot ? spots.findIndex((s) => s.id === spot.id) : -1;
      const nextIdx = (idx + delta + spots.length) % spots.length;
      void open(spots[nextIdx].id);
    },
    [open, scene.spots, spot],
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
    <section
      id={id}
      className={`lt-pano-section${compact ? " is-compact" : ""}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="lt-container">
        {/* Centered Header (theo phong cách Công nghệ số Tân Trà) */}
        <header className="lt-pano-center-head">
          <div className="lt-pano-flanked-kicker">
            <span className="lt-pano-kicker-line" aria-hidden="true" />
            <span>TRẢI NGHIỆM THỰC TẾ 360°</span>
            <span className="lt-pano-kicker-line" aria-hidden="true" />
          </div>
          <h2 id={`${id}-heading`} className="lt-pano-center-title">
            KHÔNG GIAN 360° <span>LAM TRÀ</span>
          </h2>
          <p className="lt-pano-center-lead">
            Ghi hình thực tế 360° tại vùng trồng, nhà máy chế biến và phòng kiểm định của HTX Chè Thanh Huyền Trà —
            kể trọn câu chuyện chất lượng qua 3 điểm tựa cốt lõi để giữ vững niềm tin trong từng chén trà.
          </p>
        </header>

        {/* 3 Thẻ Điểm Tựa (Visual Frame ở trên + Thanh nền xanh đậm ở dưới như mẫu Tân Trà) */}
        <div
          className="lt-pano-showcase-grid"
          role="tablist"
          aria-label="Ba điểm chính trong câu chuyện chất lượng 360°"
        >
          {SCENE_LIST.map((item) => {
            const active = item.id === sceneId;
            return (
              <div
                key={item.id}
                role="tab"
                tabIndex={0}
                aria-selected={active}
                className={`lt-pano-showcase-card${active ? " is-active" : ""}`}
                onClick={() => selectPillar(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectPillar(item.id);
                  }
                }}
                onPointerEnter={prefetch}
              >
                {/* Khung hình minh hoạ 360° phía trên */}
                <div className="lt-pano-showcase-visual">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.poster.wide}
                    alt={item.poster.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="lt-pano-showcase-step">
                    Điểm {item.step} · 360°
                  </span>
                  <div className="lt-pano-showcase-tags" aria-hidden="true">
                    {item.callouts.map((tag) => (
                      <span key={tag} className="lt-pano-showcase-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="lt-pano-showcase-play"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectPillar(item.id, true);
                      viewportWrapRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <ellipse cx="12" cy="12" rx="10" ry="4" />
                    </svg>
                    <span>{active && live ? "Đang mở 360°" : "Xoay 360°"}</span>
                  </button>
                </div>

                {/* Chân thẻ màu xanh rừng đậm (#0C2B1E) đồng bộ mẫu Tân Trà */}
                <div className="lt-pano-showcase-body">
                  <div className="lt-pano-showcase-title-row">
                    <strong>{item.pillarTitle}</strong>
                    <span className="lt-pano-showcase-state">
                      {active ? "Đang chọn" : "Xem góc này →"}
                    </span>
                  </div>
                  <p>{item.pillarCaption}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Khung Trình Xem 360° Tương Tác Trực Tiếp */}
        <div ref={viewportWrapRef} className="lt-pano-stage-shell">
          <div
            className={`lt-pano-frame${sheet ? " is-sheet" : ""}`}
            data-status={status}
            role={sheet ? "dialog" : undefined}
            aria-modal={sheet || undefined}
            aria-label={sheet ? `Ảnh 360° ${scene.spaceName}` : undefined}
            onPointerEnter={prefetch}
          >
            <div
              ref={stageRef}
              className="lt-pano-stage"
              tabIndex={status === "ready" ? 0 : -1}
              aria-label={`Không gian 360° ${scene.spaceName}. Dùng chuột kéo hoặc phím mũi tên để tự do quan sát mọi góc độ.`}
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

            {/* Thanh trạng thái phía trên khung 360° */}
            <div className="lt-pano-topbar">
              <span className="lt-pano-scene-pill">
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" />
                  <path d="M12 2v20" opacity="0.5" />
                </svg>
                <span>Điểm {scene.step} · {scene.pillarTitle}:</span>
                <strong>{scene.spaceName}</strong>
              </span>

              <div className="lt-pano-top-actions">
                {live && (
                  <>
                    <button
                      type="button"
                      className="lt-pano-reset-btn"
                      onClick={() => stepSpot(1)}
                      title="Chuyển sang điểm thuyết minh tiếp theo"
                    >
                      <span>Điểm tiếp theo</span>
                      <Icon name="arrow-right" size={13} />
                    </button>
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
                  </>
                )}
              </div>
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
                    <strong>Bấm để xoay 360° · {scene.pillarTitle}</strong>
                    <small>Tự do quan sát mọi góc độ tại {scene.spaceName}</small>
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
                Kéo chuột 360° để tự do quan sát mọi góc độ thực tế
              </p>
            )}

            {spot && (
              <div className="lt-pano-card" role="region" aria-live="polite" aria-label={spot.title}>
                <div className="lt-pano-card-head">
                  <span className="lt-pano-card-icon">
                    <Icon name={spot.icon} size={16} />
                  </span>
                  <div>
                    <span className="lt-pano-card-kicker">Điểm {scene.step} · {scene.pillarTitle}</span>
                    <h3>{spot.title}</h3>
                  </div>
                </div>
                <p>{spot.text}</p>
                <div className="lt-pano-card-actions">
                  <Link href={spot.href} className="lt-pano-card-link">
                    <span>{spot.cta}</span>
                    <Icon name="arrow-right" size={15} />
                  </Link>
                  <div className="lt-pano-card-stepper">
                    <button type="button" onClick={() => stepSpot(-1)} aria-label="Điểm trước">
                      <Icon name="chevron-left" size={15} />
                    </button>
                    <button type="button" onClick={() => stepSpot(1)} aria-label="Điểm tiếp theo">
                      <Icon name="chevron-right" size={15} />
                    </button>
                  </div>
                </div>
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

          {/* Thanh chọn nhanh các điểm thuyết minh bên dưới khung 360° */}
          <div className="lt-pano-spots-wrap">
            <span className="lt-pano-spots-label">
              Điểm thuyết minh trong <strong>{scene.pillarTitle}</strong>:
            </span>
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
      </div>
    </section>
  );
}
