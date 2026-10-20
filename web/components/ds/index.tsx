"use client";

// Lam Trà design system components, ported from _ds_bundle.js.
import { useState, type CSSProperties, type ReactNode } from "react";
import { ICON_PATHS } from "./icon-paths";

export function formatVND(n: number) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  color = "currentColor",
  style,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ flexShrink: 0, display: "block", ...style }}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || "" }}
    />
  );
}

const SIZES = {
  sm: { height: 36, padding: "0 14px", fontSize: 13, gap: 6, icon: 16 },
  md: { height: 44, padding: "0 20px", fontSize: 14, gap: 8, icon: 18 },
  lg: { height: 52, padding: "0 28px", fontSize: 15, gap: 10, icon: 20 },
};
const VARIANTS = {
  primary: { bg: "var(--primary)", fg: "var(--text-on-primary)", bd: "var(--primary)", hbg: "var(--primary-hover)", hbd: "var(--primary-hover)" },
  accent: { bg: "var(--accent)", fg: "var(--text-on-primary)", bd: "var(--accent)", hbg: "var(--accent-hover)", hbd: "var(--accent-hover)" },
  secondary: { bg: "transparent", fg: "var(--text-strong)", bd: "var(--text-strong)", hbg: "var(--bg-sunken)", hbd: "var(--text-strong)" },
  ghost: { bg: "transparent", fg: "var(--text-strong)", bd: "transparent", hbg: "var(--bg-sunken)", hbd: "transparent" },
};

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth,
  children,
  style,
  onClick,
}: {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  iconLeft?: string;
  iconRight?: string;
  fullWidth?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const s = SIZES[size];
  const v = VARIANTS[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPress(false);
      }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        width: fullWidth ? "100%" : undefined,
        fontFamily: "var(--font-ui)",
        fontSize: s.fontSize,
        fontWeight: 500,
        letterSpacing: ".02em",
        color: v.fg,
        background: hover ? v.hbg : v.bg,
        border: "1px solid " + (hover ? v.hbd : v.bd),
        borderRadius: "var(--radius-button)",
        cursor: "pointer",
        transform: press ? "translateY(1px)" : "none",
        transition: "background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), transform var(--dur-fast)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {iconLeft && <Icon name={iconLeft} size={s.icon} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.icon} />}
    </button>
  );
}

export function IconButton({
  icon,
  label,
  variant = "ghost",
  size = 44,
  onClick,
}: {
  icon: string;
  label: string;
  variant?: "ghost" | "surface" | "filled" | "outline";
  size?: number;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const filled = variant === "filled";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-pill)",
        padding: 0,
        cursor: "pointer",
        color: filled ? "var(--text-on-primary)" : "var(--text-strong)",
        background: filled
          ? hover ? "var(--primary-hover)" : "var(--primary)"
          : variant === "surface" ? "rgba(251,248,242,.88)" : hover ? "var(--bg-sunken)" : "transparent",
        border: variant === "outline" ? "1px solid var(--border-strong)" : "1px solid transparent",
        backdropFilter: variant === "surface" ? "blur(8px)" : undefined,
        transition: "background var(--dur-base) var(--ease-out)",
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.48)} />
    </button>
  );
}

export function ProductImage({
  src,
  alt = "",
  ratio = "4 / 5",
  radius = "var(--radius-card)",
}: {
  src: string;
  alt?: string;
  ratio?: string;
  radius?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        width: "100%",
        overflow: "hidden",
        borderRadius: radius,
        background: "var(--surface-photo)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

export function Rating({ value = 0, count, size = 14 }: { value?: number; count?: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-ui)" }}>
      <span style={{ display: "inline-flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => {
          const on = i <= Math.round(value);
          return (
            <span key={i} style={{ color: on ? "var(--rating)" : "var(--paper-400)", display: "inline-flex" }}>
              <Icon name="star" size={size} style={{ fill: on ? "currentColor" : "none" }} />
            </span>
          );
        })}
      </span>
      {count != null && (
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {value.toFixed(1)} ({count})
        </span>
      )}
    </span>
  );
}

export type Option = { value: string; label: string; sub?: string };

export function OptionPicker({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: Option[];
  value: string;
  onChange?: (v: string) => void;
}) {
  const current = options.find((o) => o.value === value);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "var(--font-ui)" }}>
      {label && (
        <div style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }}>
          <span style={{ fontWeight: 500, color: "var(--text-strong)" }}>{label}</span>
          {current && <span style={{ color: "var(--text-muted)" }}>{current.label}</span>}
        </div>
      )}
      <div role="radiogroup" style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))`, gap: 8 }}>
        {options.map((o) => {
          const sel = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={sel}
              onClick={() => onChange && onChange(o.value)}
              style={{
                minHeight: 48,
                padding: "8px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                fontFamily: "inherit",
                border: sel ? "1.5px solid var(--text-strong)" : "1px solid var(--border-strong)",
                background: sel ? "var(--surface-raised)" : "transparent",
                color: "var(--text-strong)",
                transition: "border-color var(--dur-fast)",
              }}
            >
              {/* DS rule: Roboto has no 600, so selected uses 700 */}
              <span style={{ fontSize: 14, fontWeight: sel ? 700 : 500 }}>{o.label}</span>
              {o.sub && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{o.sub}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Price({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const fs = size === "lg" ? "var(--fs-price-lg)" : size === "sm" ? "14px" : "var(--fs-price)";
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", fontFamily: "var(--font-ui)", fontVariantNumeric: "tabular-nums" }}>
      <span style={{ fontSize: fs, fontWeight: 700, color: "var(--text-price)" }}>{formatVND(value)}</span>
    </span>
  );
}
