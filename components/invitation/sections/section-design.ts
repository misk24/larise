import type { CSSProperties } from "react";

export type SectionDesign = {
  background?: {
    type?: "color" | "image" | "gradient";
    value?: string;
    position?: string;
    size?: string;
    overlay?: number;
  };
  typography?: {
    fontFamily?: string;
    headingFontSize?: number;
    bodyFontSize?: number;
    fontWeight?: number;
    color?: string;
    alignment?: "left" | "center" | "right";
    lineHeight?: number;
    letterSpacing?: number;
  };
  layout?: {
    paddingTop?: number;
    paddingBottom?: number;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finiteNumber(value: unknown, min: number, max: number): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max ? value : undefined;
}

function safeColor(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const color = value.trim();
  return /^(#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\)|[a-z]{1,24})$/i.test(color) ? color : undefined;
}

function safeUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value, "https://larise.invalid");
    if (url.protocol === "https:" || url.protocol === "http:" || value.startsWith("/")) return value;
  } catch {}
  return undefined;
}

export function getSectionDesignStyle(value: unknown): CSSProperties {
  if (!isRecord(value)) return {};
  const background = isRecord(value.background) ? value.background : {};
  const typography = isRecord(value.typography) ? value.typography : {};
  const layout = isRecord(value.layout) ? value.layout : {};
  const style: CSSProperties = {};
  const cssVars = style as CSSProperties & Record<`--${string}`, string>;

  const bgType = background.type;
  const bgValue = typeof background.value === "string" ? background.value.trim() : "";
  const overlay = finiteNumber(background.overlay, 0, 1) ?? 0;
  if (bgType === "color") {
    const color = safeColor(bgValue);
    if (color) style.backgroundColor = color;
  } else if (bgType === "image") {
    const url = safeUrl(bgValue);
    if (url) {
      style.backgroundImage = overlay > 0
        ? `linear-gradient(rgba(0,0,0,${overlay}), rgba(0,0,0,${overlay})), url("${url.replace(/["\\\\]/g, "")}")`
        : `url("${url.replace(/["\\\\]/g, "")}")`;
      style.backgroundPosition = typeof background.position === "string" ? background.position : "center";
      style.backgroundSize = typeof background.size === "string" ? background.size : "cover";
      style.backgroundRepeat = "no-repeat";
    }
  } else if (bgType === "gradient" && /^linear-gradient\(\s*(?:\d{1,3}deg\s*,\s*)?(?:#[\da-f]{3,8}|[a-z]{1,24}|rgba?\([\d\s.,%]+\))\s*,\s*(?:#[\da-f]{3,8}|[a-z]{1,24}|rgba?\([\d\s.,%]+\))(?:\s*,\s*(?:#[\da-f]{3,8}|[a-z]{1,24}|rgba?\([\d\s.,%]+\)))*\s*\)$/i.test(bgValue)) {
    style.backgroundImage = bgValue;
  }

  const color = safeColor(typography.color);
  if (color) cssVars["--section-text-color"] = color;
  if (typeof typography.fontFamily === "string" && /^[\w ,"'()-]{1,100}$/.test(typography.fontFamily)) cssVars["--section-font-family"] = typography.fontFamily;
  const headingFontSize = finiteNumber(typography.headingFontSize, 12, 120);
  if (headingFontSize) cssVars["--section-heading-size"] = `${headingFontSize}px`;
  const bodyFontSize = finiteNumber(typography.bodyFontSize, 8, 48);
  if (bodyFontSize) cssVars["--section-body-size"] = `${bodyFontSize}px`;
  const fontWeight = finiteNumber(typography.fontWeight, 100, 900);
  if (fontWeight) cssVars["--section-font-weight"] = String(fontWeight);
  if (["left", "center", "right"].includes(String(typography.alignment))) cssVars["--section-text-align"] = String(typography.alignment);
  const lineHeight = finiteNumber(typography.lineHeight, 0.8, 3);
  if (lineHeight) style.lineHeight = lineHeight;
  const letterSpacing = finiteNumber(typography.letterSpacing, -5, 20);
  if (letterSpacing !== undefined) style.letterSpacing = `${letterSpacing}px`;

  const paddingTop = finiteNumber(layout.paddingTop, 0, 400);
  const paddingBottom = finiteNumber(layout.paddingBottom, 0, 400);
  if (paddingTop !== undefined) style.paddingTop = `${paddingTop}px`;
  if (paddingBottom !== undefined) style.paddingBottom = `${paddingBottom}px`;

  return style;
}
