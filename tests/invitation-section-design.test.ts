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
});
