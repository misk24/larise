"use client";

import { useId, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type DesignGroupName = "background" | "typography" | "layout" | "button" | "image" | "icon" | "divider" | "ornament";
type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject => !!value && typeof value === "object" && !Array.isArray(value);

export function parseContent(json: string): { ok: true; value: JsonObject } | { ok: false; error: string } {
  try {
    const value: unknown = JSON.parse(json);
    if (!isObject(value)) return { ok: false, error: "Konten default harus berupa objek JSON." };
    return { ok: true, value };
  } catch {
    return { ok: false, error: "Konten default harus berupa JSON yang valid." };
  }
}

export function readDesign(content: JsonObject): JsonObject {
  return isObject(content.design) ? content.design : {};
}

/**
 * Sets one design value. An empty value (undefined, "" or NaN) removes the key, and a group left
 * empty is removed too, so clearing a field falls back to the section's built-in styling instead
 * of saving a value the server would reject (for example `0` for a font size).
 */
export function writeDesignValue(json: string, group: DesignGroupName, key: string, value: unknown): string {
  const parsed = parseContent(json);
  if (!parsed.ok) return json;
  const design = { ...readDesign(parsed.value) };
  const nextGroup = { ...(isObject(design[group]) ? design[group] : {}) };
  const empty = value === undefined || value === "" || (typeof value === "number" && Number.isNaN(value));
  if (empty) delete nextGroup[key];
  else nextGroup[key] = value;
  if (Object.keys(nextGroup).length) design[group] = nextGroup;
  else delete design[group];
  const next = { ...parsed.value };
  if (Object.keys(design).length) next.design = design;
  else delete next.design;
  return JSON.stringify(next, null, 2);
}

/** What every field needs: the parsed design object and a setter. */
export type DesignControl = {
  design: JsonObject;
  set: (group: DesignGroupName, key: string, value: unknown) => void;
  disabled?: boolean;
};

const groupOf = (ctl: DesignControl, group: DesignGroupName): JsonObject => (isObject(ctl.design[group]) ? ctl.design[group] : {});

type FieldProps = { ctl: DesignControl; group: DesignGroupName; name: string; label: string; hint?: string; className?: string };

function Field({ label, hint, htmlFor, hintId, className, children }: { label: string; hint?: string; htmlFor: string; hintId: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p id={hintId} className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function DesignTextField({ ctl, group, name, label, hint, className, placeholder, maxLength = 100 }: FieldProps & { placeholder?: string; maxLength?: number }) {
  const id = useId();
  const current = groupOf(ctl, group)[name];
  return (
    <Field label={label} hint={hint} htmlFor={id} hintId={`${id}-hint`} className={className}>
      <Input id={id} value={typeof current === "string" ? current : ""} placeholder={placeholder} maxLength={maxLength} disabled={ctl.disabled} aria-describedby={hint ? `${id}-hint` : undefined} onChange={(event) => ctl.set(group, name, event.target.value)} />
    </Field>
  );
}

export function DesignNumberField({ ctl, group, name, label, hint, className, min, max, step = 1, unit }: FieldProps & { min: number; max: number; step?: number; unit?: string }) {
  const id = useId();
  const current = groupOf(ctl, group)[name];
  return (
    <Field label={unit ? `${label} (${unit})` : label} hint={hint} htmlFor={id} hintId={`${id}-hint`} className={className}>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        className="tabular-nums"
        value={typeof current === "number" ? current : ""}
        placeholder="Bawaan"
        disabled={ctl.disabled}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => ctl.set(group, name, event.target.value === "" ? undefined : Number(event.target.value))}
        onBlur={() => {
          if (typeof current === "number" && (current < min || current > max)) ctl.set(group, name, Math.min(max, Math.max(min, current)));
        }}
      />
    </Field>
  );
}

function pickerValue(color: string): string {
  if (/^#[\da-f]{6}$/i.test(color)) return color.toLowerCase();
  const short = /^#([\da-f])([\da-f])([\da-f])$/i.exec(color);
  return short ? `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toLowerCase() : "#000000";
}

/** Text input for any valid CSS colour plus a native colour picker for the common hex case. */
export function DesignColorField({ ctl, group, name, label, hint, className, placeholder = "#8b7565" }: FieldProps & { placeholder?: string }) {
  const id = useId();
  const current = groupOf(ctl, group)[name];
  const color = typeof current === "string" ? current : "";
  return (
    <Field label={label} hint={hint} htmlFor={id} hintId={`${id}-hint`} className={className}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label}: pemilih warna`}
          value={pickerValue(color)}
          disabled={ctl.disabled}
          onChange={(event) => ctl.set(group, name, event.target.value)}
          className="size-9 shrink-0 cursor-pointer rounded-md border bg-transparent p-1 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Input id={id} value={color} placeholder={placeholder} maxLength={64} disabled={ctl.disabled} aria-describedby={hint ? `${id}-hint` : undefined} onChange={(event) => ctl.set(group, name, event.target.value)} />
      </div>
    </Field>
  );
}

const DEFAULT_VALUE = "__default";

/** Select with an explicit "Bawaan" option, so an unset value is never shown as if it were chosen. */
export function DesignSelectField({ ctl, group, name, label, hint, className, options, defaultLabel = "Bawaan" }: FieldProps & { options: { value: string; label: string }[]; defaultLabel?: string }) {
  const id = useId();
  const current = groupOf(ctl, group)[name];
  const value = typeof current === "string" || typeof current === "number" ? String(current) : DEFAULT_VALUE;
  // Keeps a stored value the preset list does not know (for example "20% 40%") visible instead of blank.
  const known = options.some((option) => option.value === value);
  return (
    <Field label={label} hint={hint} htmlFor={id} hintId={`${id}-hint`} className={className}>
      <Select value={value} disabled={ctl.disabled} onValueChange={(next) => ctl.set(group, name, next === DEFAULT_VALUE ? undefined : /^\d+$/.test(next) ? Number(next) : next)}>
        <SelectTrigger id={id} className="w-full" aria-describedby={hint ? `${id}-hint` : undefined}><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={DEFAULT_VALUE}>{defaultLabel}</SelectItem>
          {!known && value !== DEFAULT_VALUE ? <SelectItem value={value}>{value}</SelectItem> : null}
          {options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </Field>
  );
}

export function DesignRangeField({ ctl, group, name, label, hint, className, min, max, step }: FieldProps & { min: number; max: number; step: number }) {
  const id = useId();
  const current = groupOf(ctl, group)[name];
  const value = typeof current === "number" ? current : 0;
  return (
    <Field label={label} hint={hint} htmlFor={id} hintId={`${id}-hint`} className={className}>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={ctl.disabled}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(event) => ctl.set(group, name, Number(event.target.value) === 0 ? undefined : Number(event.target.value))}
          className="h-9 min-w-0 flex-1 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
        <output htmlFor={id} className="w-10 text-right text-sm tabular-nums text-muted-foreground">{value}</output>
      </div>
    </Field>
  );
}

/** A titled block of fields. Plain dividers instead of nested cards keep the panel calm. */
export function DesignGroup({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="space-y-3 border-b pb-5 last:border-b-0 last:pb-0">
      <div className="space-y-0.5">
        <h5 className="text-sm font-semibold">{title}</h5>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}
