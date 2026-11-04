"use client";

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

export function ThemeDecorationControls({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const icon = readGroup(value, "icon");
  const divider = readGroup(value, "divider");
  const ornament = readGroup(value, "ornament");
  const layout = readGroup(value, "layout");
  const update = (group: DesignGroup, key: string, next: unknown) => onChange(writeValue(value, group, key, next));
  const numberField = (label: string, group: DesignGroup, key: string, current: unknown, min: number, max: number, step = 1) => (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input type="number" min={min} max={max} step={step} value={typeof current === "number" ? current : ""} onChange={(event) => update(group, key, event.target.value === "" ? undefined : Number(event.target.value))} />
    </div>
  );
  const colorField = (label: string, group: DesignGroup, key: string, current: unknown, placeholder = "#8b7565") => (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input value={typeof current === "string" ? current : ""} placeholder={placeholder} maxLength={64} onChange={(event) => update(group, key, event.target.value)} />
    </div>
  );
  return (
    <section className="space-y-3 border-t pt-4" aria-labelledby="decoration-controls-title">
      <div>
        <h6 id="decoration-controls-title" className="text-sm font-semibold">Elemen dekoratif & jarak</h6>
        <p className="text-xs text-muted-foreground">Pengaturan bersifat opsional dan hanya aktif pada elemen yang mendukungnya.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {colorField("Warna ikon", "icon", "color", icon.color)}
        {numberField("Ukuran ikon (px)", "icon", "size", icon.size, 12, 96)}
        {numberField("Ketebalan garis ikon", "icon", "strokeWidth", icon.strokeWidth, 1, 4, 0.25)}
        {colorField("Warna divider", "divider", "color", divider.color)}
        {numberField("Ketebalan divider (px)", "divider", "thickness", divider.thickness, 1, 8)}
        {numberField("Lebar divider (%)", "divider", "width", divider.width, 10, 100)}
        <div className="space-y-1">
          <Label>Gaya divider</Label>
          <Select value={typeof divider.style === "string" ? divider.style : "solid"} onValueChange={(next) => update("divider", "style", next)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {numberField("Jarak divider (px)", "divider", "spacing", divider.spacing, 0, 160)}
        {colorField("Warna ornament", "ornament", "color", ornament.color)}
        {numberField("Ukuran ornament (px)", "ornament", "size", ornament.size, 8, 160)}
        {numberField("Opacity ornament (0–1)", "ornament", "opacity", ornament.opacity, 0, 1, 0.05)}
        <div className="space-y-1">
          <Label>Posisi ornament</Label>
          <Select value={typeof ornament.position === "string" ? ornament.position : "top-right"} onValueChange={(next) => update("ornament", "position", next)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="top-left">Atas kiri</SelectItem>
              <SelectItem value="top-right">Atas kanan</SelectItem>
              <SelectItem value="bottom-left">Bawah kiri</SelectItem>
              <SelectItem value="bottom-right">Bawah kanan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {numberField("Jarak antar-elemen (px)", "layout", "elementGap", layout.elementGap, 0, 96)}
      </div>
    </section>
  );
}
