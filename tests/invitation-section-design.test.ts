import { describe, expect, it } from "vitest";
import { validateSectionDesign } from "@/lib/validation/section-design";
import {
  getSectionDesignAttributes,
  getSectionDesignStyle,
} from "@/components/invitation/sections/section-design";

describe("invitation section design", () => {
  it("keeps existing section styling untouched when no design is configured", () => {
    expect(getSectionDesignStyle(undefined)).toEqual({});
    expect(getSectionDesignAttributes(undefined)).toEqual({});
  });

  it("creates bounded typography and layout tokens", () => {
    const style = getSectionDesignStyle({
      typography: {
        headingFontSize: 52,
        bodyFontSize: 18,
        headingColor: "#34251f",
        headingAlignment: "left",
      },
      layout: { paddingTop: 96, paddingBottom: 120 },
    }) as Record<string, string>;

    expect(style["--section-heading-size"]).toBe("52px");
    expect(style["--section-body-size"]).toBe("18px");
    expect(style["--section-heading-color"]).toBe("#34251f");
    expect(style["--section-heading-align"]).toBe("left");
    expect(style.paddingTop).toBe("96px");
    expect(style.paddingBottom).toBe("120px");
  });

  it("rejects unsafe background URLs and out-of-range values", () => {
    const style = getSectionDesignStyle({
      background: { type: "image", value: "javascript:alert(1)" },
      typography: { headingFontSize: 500 },
      button: { borderRadius: 200 },
    }) as Record<string, string>;

    expect(style.backgroundImage).toBeUndefined();
    expect(style["--section-heading-size"]).toBeUndefined();
    expect(style["--section-button-radius"]).toBeUndefined();
    const attributes = getSectionDesignAttributes({
      typography: { headingFontSize: 500 },
      image: { aspectRatio: "square" },
    });
    expect(attributes["data-design-heading-size"]).toBeUndefined();
    expect(attributes["data-design-image-ratio"]).toBe("true");
    expect(attributes["data-design-image-fit"]).toBeUndefined();
  });

  it("exposes scoped button and image controls only when configured", () => {
    const attributes = getSectionDesignAttributes({
      button: { borderRadius: 12 },
      image: { aspectRatio: "portrait" },
    });

    expect(attributes["data-design-button"]).toBe("true");
    expect(attributes["data-design-image"]).toBe("true");
  });

  it("supports constrained button and gallery image tokens", () => {
    const style = getSectionDesignStyle({
      button: {
        backgroundColor: "#654321",
        textColor: "#ffffff",
        borderRadius: 16,
        paddingX: 24,
      },
      image: {
        borderRadius: 20,
        aspectRatio: "landscape",
        objectFit: "contain",
        objectPosition: "top",
      },
    }) as Record<string, string>;

    expect(style["--section-button-bg"]).toBe("#654321");
    expect(style["--section-button-text"]).toBe("#ffffff");
    expect(style["--section-button-radius"]).toBe("16px");
    expect(style["--section-button-px"]).toBe("24px");
    expect(style["--section-image-radius"]).toBe("20px");
    expect(style["--section-image-ratio"]).toBe("4 / 3");
    expect(style["--section-image-fit"]).toBe("contain");
    expect(style["--section-image-position"]).toBe("top");
  });

  it("creates decorative icon, divider, ornament, and element-gap tokens", () => {
    const design = {
      icon: { color: "#8b7565", size: 28, strokeWidth: 1.5 },
      divider: { color: "#c8b8a8", thickness: 2, width: 60, style: "dotted", spacing: 24 },
      ornament: { color: "#b89b7b", size: 44, opacity: 0.2, position: "bottom-right" },
      layout: { elementGap: 32 },
    };
    const style = getSectionDesignStyle(design) as Record<string, string>;
    const attributes = getSectionDesignAttributes(design);

    expect(style["--section-icon-color"]).toBe("#8b7565");
    expect(style["--section-icon-size"]).toBe("28px");
    expect(style["--section-icon-stroke"]).toBe("1.5");
    expect(style["--section-divider-style"]).toBe("dotted");
    expect(style["--section-divider-width"]).toBe("60%");
    expect(style["--section-ornament-position"]).toBe("bottom-right");
    expect(style["--section-element-gap"]).toBe("32px");
    expect(attributes["data-design-icon"]).toBe("true");
    expect(attributes["data-design-divider"]).toBe("true");
    expect(attributes["data-design-ornament"]).toBe("true");
    expect(attributes["data-design-element-gap"]).toBe("true");
  });

  it("validates design configuration at the API boundary", () => {
    expect(validateSectionDesign({
      design: {
        icon: { color: "#ffffff", size: 24 },
        divider: { style: "dashed", width: 80 },
        ornament: { opacity: 0.15, position: "top-left" },
        layout: { elementGap: 24 },
      },
    }).success).toBe(true);

    expect(validateSectionDesign({
      design: { background: { type: "image", value: "javascript:alert(1)" } },
    }).success).toBe(false);
    expect(validateSectionDesign({
      design: { ornament: { opacity: 3 } },
    }).success).toBe(false);
    expect(validateSectionDesign({
      design: { icon: { onload: "alert(1)" } },
    }).success).toBe(false);
  });

});
