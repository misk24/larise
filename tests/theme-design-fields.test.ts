import { describe, expect, it } from "vitest";
import { validateSectionDesign } from "@/lib/validation/section-design";
import {
  DESIGN_PANELS,
  SECTION_TYPES,
  STARTER_SECTION_TYPES,
  clearDesign,
  countDesignValues,
  nextSectionKey,
  parseContent,
  readDesignValue,
  writeDesignValue,
  type DesignField,
} from "@/lib/theme-design-fields";

const sample = (field: DesignField): unknown => {
  if (field.kind === "number") return field.min;
  if (field.kind === "color") return "#112233";
  if (field.kind === "select") return field.options[field.options.length - 1].value;
  if (field.group === "background" && field.key === "value") return "#ffffff";
  if (field.group === "background" && field.key === "position") return "center";
  return "Georgia, serif";
};

describe("theme design fields", () => {
  it("only offers fields the server schema accepts", () => {
    for (const panel of DESIGN_PANELS) {
      for (const field of panel.fields) {
        let content = writeDesignValue({}, field.group, field.key, sample(field));
        if (field.group === "background" && field.key === "value") content = writeDesignValue(content, "background", "type", "color");
        const result = validateSectionDesign(content);
        expect(result.success, `${field.group}.${field.key}`).toBe(true);
      }
    }
  });

  it("uses section types the admin API allows", () => {
    expect(SECTION_TYPES.map((type) => type.value)).toEqual(
      ["cover", "opening", "quote", "couple", "event", "location", "gallery", "rsvp", "gift", "closing"],
    );
  });

  it("starts new themes from unique, allowed section types with cover first", () => {
    const allowed = SECTION_TYPES.map((type) => type.value) as string[];
    expect(new Set(STARTER_SECTION_TYPES).size).toBe(STARTER_SECTION_TYPES.length);
    expect(STARTER_SECTION_TYPES.every((type) => allowed.includes(type))).toBe(true);
    expect(STARTER_SECTION_TYPES[0]).toBe("cover");
  });

  it("sets and reads one value without touching the rest of the content", () => {
    const content = { title: "Halo", design: { layout: { paddingTop: 40 } } };
    const next = writeDesignValue(content, "typography", "headingFontSize", 48);
    expect(next.title).toBe("Halo");
    expect(readDesignValue(next, "typography", "headingFontSize")).toBe(48);
    expect(readDesignValue(next, "layout", "paddingTop")).toBe(40);
    expect(content.design).toEqual({ layout: { paddingTop: 40 } });
  });

  it("removes emptied keys, groups, and the design object", () => {
    let content = writeDesignValue({ title: "Halo" }, "button", "borderRadius", 12);
    content = writeDesignValue(content, "button", "borderRadius", Number.NaN);
    expect(content).toEqual({ title: "Halo" });
    content = writeDesignValue(content, "typography", "headingColor", "#000");
    content = writeDesignValue(content, "typography", "headingColor", "");
    expect("design" in content).toBe(false);
  });

  it("counts and clears design values", () => {
    let content = writeDesignValue({ title: "Halo" }, "layout", "paddingTop", 10);
    content = writeDesignValue(content, "icon", "size", 24);
    expect(countDesignValues(content)).toBe(2);
    const layout = DESIGN_PANELS.find((panel) => panel.id === "layout")!;
    expect(countDesignValues(content, layout.fields)).toBe(1);
    expect(clearDesign(content)).toEqual({ title: "Halo" });
  });

  it("parses only JSON objects", () => {
    expect(parseContent('{"a":1}')).toEqual({ a: 1 });
    expect(parseContent("[1]")).toBeNull();
    expect(parseContent("nope")).toBeNull();
  });

  it("generates unique section keys", () => {
    expect(nextSectionKey("event", [])).toBe("event");
    expect(nextSectionKey("event", ["event"])).toBe("event-2");
    expect(nextSectionKey("event", ["event", "event-2"])).toBe("event-3");
  });
});
