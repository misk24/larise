"use client";

import { useId, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DesignGroup = "icon" | "divider" | "ornament" | "layout";

function readGroup(json: string, group: DesignGroup): Record<string, unknown> {
  try {
    const root: unknown = JSON.parse(json);
    if (!root || typeof root !== "object" || Array.isArray(root)) return {};
    const design = (root as Record<string, unknown>).design;
    if (!design || typeof design !== "object" || Array.isArray(design)) return {};
    const value = (design as Record<string, unknown>)[group];
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function writeValue(json: string, group: DesignGroup, key: string, value: unknown): string {
  try {
    const root: unknown = JSON.parse(json);
    if (!root || typeof root !== "object" || Array.isArray(root)) return json;
    const record = root as Record<string, unknown>;
    const currentDesign = record.design && typeof record.design === "object" && !Array.isArray(record.design)
      ? record.design as Record<string, unknown>
      : {};
    const currentGroup = currentDesign[group] && typeof currentDesign[group] === "object" && !Array.isArray(currentDesign[group])
      ? currentDesign[group] as Record<string, unknown>
      : {};
    const nextGroup = { ...currentGroup };
    if (value === undefined || value === "") delete nextGroup[key];
    else nextGroup[key] = value;
    const nextRoot = { ...record, design: { ...currentDesign, [group]: nextGroup } };
    return JSON.stringify(nextRoot, null, 2);
  } catch {
    return json;
  }
}

const POSITIONS = [
  { value: "top-left", label: "Atas kiri" },
  { value: "top-right", label: "Atas kanan" },
  { value: "bottom-left", label: "Bawah kiri" },
  { value: "bottom-right", label: "Bawah kanan" },
];
const DIVIDER_STYLES = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Putus-putus" },
  { value: "dotted", label: "Titik-titik" },
];

export function ThemeDecorationControls({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const uid = useId();
  const icon = readGroup(value, "icon");
  const divider = readGroup(value, "divider");
  const ornament = readGroup(value, "ornament");
  const layout = readGroup(value, "layout");
  const update = (group: DesignGroup, key: string, next: unknown) => onChange(writeValue(value, group, key, next));
  const fieldId = (group: DesignGroup, key: string) => `${uid}-${group}-${key}`;

  const numberField = (label: string, group: DesignGroup, key: string, current: unknown, min: number, max: number, step = 1) => (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId(group, key)}>{label}</Label>
      <Input id={fieldId(group, key)} type="number" inputMode="decimal" min={min} max={max} step={step} className="tabular-nums" value={typeof current === "number" ? current : ""} onChange={(event) => update(group, key, event.target.value === "" ? undefined : Number(event.target.value))} />
    </div>
  );
  const colorField = (label: string, group: DesignGroup, key: string, current: unknown, placeholder = "#8b7565") => {
    const color = typeof current === "string" ? current : "";
    return (
      <div className="space-y-1.5">
        <Label htmlFor={fieldId(group, key)}>{label}</Label>
        <div className="relative">
          {/* The swatch is a visual echo of the typed value; an invalid value simply paints nothing. */}
          <span aria-hidden="true" className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 rounded-full border" style={{ backgroundColor: color || "transparent" }} />
          <Input id={fieldId(group, key)} className="pl-9" value={color} placeholder={placeholder} maxLength={64} onChange={(event) => update(group, key, event.target.value)} />
        </div>
      </div>
    );
  };
  const selectField = (label: string, group: DesignGroup, key: string, current: unknown, fallback: string, options: { value: string; label: string }[]) => (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId(group, key)}>{label}</Label>
      <Select value={typeof current === "string" ? current : fallback} onValueChange={(next) => update(group, key, next)}>
        <SelectTrigger id={fieldId(group, key)} className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
  const group = (title: string, children: ReactNode) => (
    <fieldset className="space-y-3 rounded-lg border bg-muted/20 p-4">
      <legend className="px-1 text-sm font-medium">{title}</legend>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );

  return (
    <section className="space-y-4 border-t pt-4" aria-labelledby={`${uid}-title`}>
      <div>
        <h6 id={`${uid}-title`} className="text-sm font-semibold">Elemen dekoratif dan jarak</h6>
        <p className="text-xs text-muted-foreground">Semua kolom opsional. Kolom yang dikosongkan memakai nilai bawaan tema.</p>
      </div>
      {group("Ikon", <>
        {colorField("Warna", "icon", "color", icon.color)}
        {numberField("Ukuran (px)", "icon", "size", icon.size, 12, 96)}
        {numberField("Ketebalan garis", "icon", "strokeWidth", icon.strokeWidth, 1, 4, 0.25)}
      </>)}
      {group("Divider", <>
        {colorField("Warna", "divider", "color", divider.color)}
        {selectField("Gaya", "divider", "style", divider.style, "solid", DIVIDER_STYLES)}
        {numberField("Ketebalan (px)", "divider", "thickness", divider.thickness, 1, 8)}
        {numberField("Lebar (%)", "divider", "width", divider.width, 10, 100)}
        {numberField("Jarak (px)", "divider", "spacing", divider.spacing, 0, 160)}
      </>)}
      {group("Ornamen", <>
        {colorField("Warna", "ornament", "color", ornament.color)}
        {selectField("Posisi", "ornament", "position", ornament.position, "top-right", POSITIONS)}
        {numberField("Ukuran (px)", "ornament", "size", ornament.size, 8, 160)}
        {numberField("Opacity (0 sampai 1)", "ornament", "opacity", ornament.opacity, 0, 1, 0.05)}
      </>)}
      {group("Tata letak", <>
        {numberField("Jarak antar-elemen (px)", "layout", "elementGap", layout.elementGap, 0, 96)}
      </>)}
    </section>
  );
}
