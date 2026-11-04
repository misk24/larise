import type { CSSProperties } from "react";

export type SectionDesign = {
  background?: { type?: "color" | "image" | "gradient"; value?: string; position?: string; size?: "cover" | "contain" | "auto"; overlay?: number };
  typography?: {
    fontFamily?: string; headingFontSize?: number; bodyFontSize?: number;
    headingFontFamily?: string; bodyFontFamily?: string; headingColor?: string; bodyColor?: string;
    headingFontWeight?: number; bodyFontWeight?: number;
    headingAlignment?: "left" | "center" | "right"; bodyAlignment?: "left" | "center" | "right";
    fontWeight?: number; color?: string; alignment?: "left" | "center" | "right";
    lineHeight?: number; letterSpacing?: number;
  };
  layout?: { paddingTop?: number; paddingBottom?: number; elementGap?: number };
  button?: { backgroundColor?: string; textColor?: string; borderColor?: string; borderRadius?: number; fontSize?: number; paddingX?: number; paddingY?: number };
  image?: { borderRadius?: number; aspectRatio?: "square" | "portrait" | "landscape"; objectFit?: "cover" | "contain"; objectPosition?: string };
  icon?: { color?: string; size?: number; strokeWidth?: number };
  divider?: { color?: string; thickness?: number; width?: number; style?: "solid" | "dashed" | "dotted"; spacing?: number };
  ornament?: { color?: string; size?: number; opacity?: number; position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" };
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
function safeFontFamily(value: unknown): string | undefined {
  return typeof value === "string" && /^[\w ,"'()-]{1,100}$/.test(value) ? value : undefined;
}
function safeUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > 2048 || /[\u0000-\u0020"'()\\]/.test(value)) return undefined;
  try {
    const url = new URL(value, "https://larise.invalid");
    if ((url.protocol === "https:" || url.protocol === "http:") && !value.startsWith("//")) return value;
  } catch {}
  return undefined;
}
function cssVar(style: CSSProperties, key: `--${string}`, value: string | undefined) {
  if (value !== undefined) (style as CSSProperties & Record<`--${string}`, string>)[key] = value;
}

export function getSectionDesignStyle(value: unknown): CSSProperties {
  if (!isRecord(value)) return {};
  const background = isRecord(value.background) ? value.background : {};
  const typography = isRecord(value.typography) ? value.typography : {};
  const layout = isRecord(value.layout) ? value.layout : {};
  const button = isRecord(value.button) ? value.button : {};
  const image = isRecord(value.image) ? value.image : {};
  const icon = isRecord(value.icon) ? value.icon : {};
  const divider = isRecord(value.divider) ? value.divider : {};
  const ornament = isRecord(value.ornament) ? value.ornament : {};
  const style: CSSProperties = {};

  const bgValue = typeof background.value === "string" ? background.value.trim() : "";
  const overlay = finiteNumber(background.overlay, 0, 1) ?? 0;
  if (background.type === "color") {
    const color = safeColor(bgValue);
    if (color) style.backgroundColor = color;
  } else if (background.type === "image") {
    const url = safeUrl(bgValue);
    if (url) {
      style.backgroundImage = overlay > 0
        ? `linear-gradient(rgba(0,0,0,${overlay}), rgba(0,0,0,${overlay})), url("${url}")`
        : `url("${url}")`;
      style.backgroundPosition = typeof background.position === "string" && /^(center|top|bottom|left|right|\d{1,3}%\s+\d{1,3}%)$/.test(background.position) ? background.position : "center";
      style.backgroundSize = ["cover", "contain", "auto"].includes(String(background.size)) ? background.size as CSSProperties["backgroundSize"] : "cover";
      style.backgroundRepeat = "no-repeat";
    }
  } else if (background.type === "gradient" && typeof background.value === "string" &&
    /^linear-gradient\(\s*(?:\d{1,3}deg\s*,\s*)?(?:#[\da-f]{3,8}|[a-z]{1,24}|rgba?\([\d\s.,%]+\))\s*,\s*(?:#[\da-f]{3,8}|[a-z]{1,24}|rgba?\([\d\s.,%]+\))(?:\s*,\s*(?:#[\da-f]{3,8}|[a-z]{1,24}|rgba?\([\d\s.,%]+\)))*\s*\)$/i.test(background.value)) {
    style.backgroundImage = background.value;
  }

  cssVar(style, "--section-text-color", safeColor(typography.color));
  cssVar(style, "--section-font-family", safeFontFamily(typography.fontFamily));
  cssVar(style, "--section-heading-color", safeColor(typography.headingColor));
  cssVar(style, "--section-body-color", safeColor(typography.bodyColor));
  cssVar(style, "--section-heading-font-family", safeFontFamily(typography.headingFontFamily));
  cssVar(style, "--section-body-font-family", safeFontFamily(typography.bodyFontFamily));
  const headingWeight = finiteNumber(typography.headingFontWeight, 100, 900);
  const bodyWeight = finiteNumber(typography.bodyFontWeight, 100, 900);
  const fontWeight = finiteNumber(typography.fontWeight, 100, 900);
  cssVar(style, "--section-heading-font-weight", headingWeight === undefined ? undefined : String(headingWeight));
  cssVar(style, "--section-body-font-weight", bodyWeight === undefined ? undefined : String(bodyWeight));
  cssVar(style, "--section-font-weight", fontWeight === undefined ? undefined : String(fontWeight));
  if (["left", "center", "right"].includes(String(typography.headingAlignment))) cssVar(style, "--section-heading-align", String(typography.headingAlignment));
  if (["left", "center", "right"].includes(String(typography.bodyAlignment))) cssVar(style, "--section-body-align", String(typography.bodyAlignment));
  if (["left", "center", "right"].includes(String(typography.alignment))) cssVar(style, "--section-text-align", String(typography.alignment));
  const headingSize = finiteNumber(typography.headingFontSize, 12, 120);
  const bodySize = finiteNumber(typography.bodyFontSize, 8, 48);
  cssVar(style, "--section-heading-size", headingSize === undefined ? undefined : `${headingSize}px`);
  cssVar(style, "--section-body-size", bodySize === undefined ? undefined : `${bodySize}px`);
  const lineHeight = finiteNumber(typography.lineHeight, 0.8, 3);
  if (lineHeight !== undefined) style.lineHeight = lineHeight;
  const letterSpacing = finiteNumber(typography.letterSpacing, -5, 20);
  if (letterSpacing !== undefined) style.letterSpacing = `${letterSpacing}px`;

  for (const [key, cssKey] of [["paddingTop", "paddingTop"], ["paddingBottom", "paddingBottom"]] as const) {
    const number = finiteNumber(layout[key], 0, 400);
    if (number !== undefined) style[cssKey] = `${number}px`;
  }
  const elementGap = finiteNumber(layout.elementGap, 0, 96);
  cssVar(style, "--section-element-gap", elementGap === undefined ? undefined : `${elementGap}px`);

  cssVar(style, "--section-button-bg", safeColor(button.backgroundColor));
  cssVar(style, "--section-button-text", safeColor(button.textColor));
  cssVar(style, "--section-button-border", safeColor(button.borderColor));
  for (const [key, cssKey, min, max] of [
    ["borderRadius", "--section-button-radius", 0, 48], ["fontSize", "--section-button-size", 10, 32],
    ["paddingX", "--section-button-px", 0, 64], ["paddingY", "--section-button-py", 0, 40],
  ] as const) {
    const number = finiteNumber(button[key], min, max);
    cssVar(style, cssKey, number === undefined ? undefined : `${number}px`);
  }

  const imageRadius = finiteNumber(image.borderRadius, 0, 48);
  cssVar(style, "--section-image-radius", imageRadius === undefined ? undefined : `${imageRadius}px`);
  if (image.aspectRatio === "square") cssVar(style, "--section-image-ratio", "1 / 1");
  if (image.aspectRatio === "portrait") cssVar(style, "--section-image-ratio", "3 / 4");
  if (image.aspectRatio === "landscape") cssVar(style, "--section-image-ratio", "4 / 3");
  if (image.objectFit === "cover" || image.objectFit === "contain") cssVar(style, "--section-image-fit", image.objectFit);
  if (typeof image.objectPosition === "string" && /^(center|top|bottom|left|right|\d{1,3}%\s+\d{1,3}%)$/.test(image.objectPosition)) cssVar(style, "--section-image-position", image.objectPosition);

  cssVar(style, "--section-icon-color", safeColor(icon.color));
  const iconSize = finiteNumber(icon.size, 12, 96);
  const iconStroke = finiteNumber(icon.strokeWidth, 1, 4);
  cssVar(style, "--section-icon-size", iconSize === undefined ? undefined : `${iconSize}px`);
  cssVar(style, "--section-icon-stroke", iconStroke === undefined ? undefined : String(iconStroke));

  cssVar(style, "--section-divider-color", safeColor(divider.color));
  for (const [key, cssKey, min, max] of [
    ["thickness", "--section-divider-thickness", 1, 8],
    ["width", "--section-divider-width", 10, 100],
    ["spacing", "--section-divider-spacing", 0, 160],
  ] as const) {
    const number = finiteNumber(divider[key], min, max);
    cssVar(style, cssKey, number === undefined ? undefined : `${number}px`);
  }
  if (["solid", "dashed", "dotted"].includes(String(divider.style))) cssVar(style, "--section-divider-style", String(divider.style));

  cssVar(style, "--section-ornament-color", safeColor(ornament.color));
  const ornamentSize = finiteNumber(ornament.size, 8, 160);
  const ornamentOpacity = finiteNumber(ornament.opacity, 0, 1);
  cssVar(style, "--section-ornament-size", ornamentSize === undefined ? undefined : `${ornamentSize}px`);
  cssVar(style, "--section-ornament-opacity", ornamentOpacity === undefined ? undefined : String(ornamentOpacity));
  if (["top-left", "top-right", "bottom-left", "bottom-right"].includes(String(ornament.position))) cssVar(style, "--section-ornament-position", String(ornament.position));

  return style;
}

export function getSectionDesignAttributes(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {};
  const typography = isRecord(value.typography) ? value.typography : {};
  const button = isRecord(value.button) ? value.button : {};
  const image = isRecord(value.image) ? value.image : {};
  const icon = isRecord(value.icon) ? value.icon : {};
  const divider = isRecord(value.divider) ? value.divider : {};
  const ornament = isRecord(value.ornament) ? value.ornament : {};
  const layout = isRecord(value.layout) ? value.layout : {};
  const attributes: Record<string, string> = {};
  const flags: Array<[string, unknown]> = [
    ["data-design-heading-size", typography.headingFontSize],
    ["data-design-body-size", typography.bodyFontSize],
    ["data-design-heading-family", typography.headingFontFamily ?? typography.fontFamily],
    ["data-design-body-family", typography.bodyFontFamily ?? typography.fontFamily],
    ["data-design-heading-color", typography.headingColor ?? typography.color],
    ["data-design-body-color", typography.bodyColor ?? typography.color],
    ["data-design-heading-weight", typography.headingFontWeight ?? typography.fontWeight],
    ["data-design-body-weight", typography.bodyFontWeight ?? typography.fontWeight],
    ["data-design-heading-align", typography.headingAlignment ?? typography.alignment],
    ["data-design-body-align", typography.bodyAlignment ?? typography.alignment],
  ];
  if (Object.values(button).some(item => item !== undefined && item !== null && item !== "")) attributes["data-design-button"] = "true";
  if (Object.values(image).some(item => item !== undefined && item !== null && item !== "")) attributes["data-design-image"] = "true";
  if (Object.values(icon).some(item => item !== undefined && item !== null && item !== "")) attributes["data-design-icon"] = "true";
  if (Object.values(divider).some(item => item !== undefined && item !== null && item !== "")) attributes["data-design-divider"] = "true";
  if (Object.values(ornament).some(item => item !== undefined && item !== null && item !== "")) attributes["data-design-ornament"] = "true";
  if (finiteNumber(layout.elementGap, 0, 96) !== undefined) attributes["data-design-element-gap"] = "true";
  for (const [key, item] of flags) {
    if (item !== undefined && item !== null && item !== "") attributes[key] = "true";
  }
  return attributes;
}
