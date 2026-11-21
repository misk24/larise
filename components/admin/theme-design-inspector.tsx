"use client";

import { useId } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DESIGN_PANELS,
  clearDesign,
  countDesignValues,
  readDesignValue,
  writeDesignValue,
  type DesignField,
  type SectionContent,
} from "@/lib/theme-design-fields";

const HEX = /^#[\da-f]{6}$/i;

function Field({ field, content, onChange, id }: { field: DesignField; content: SectionContent; onChange: (next: SectionContent) => void; id: string }) {
  const current = readDesignValue(content, field.group, field.key);
  const set = (value: unknown) => onChange(writeDesignValue(content, field.group, field.key, value));
  const label = (
    <Label htmlFor={id} className="flex items-baseline justify-between gap-2">
      <span>{field.label}</span>
      {field.hint ? <span className="text-xs font-normal text-muted-foreground">{field.hint}</span> : null}
    </Label>
  );

  if (field.kind === "select") {
    const none = field.key === "type" && field.group === "background";
    return (
      <div className={field.wide ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
        {label}
        <Select value={typeof current === "string" ? current : field.fallback} onValueChange={(value) => set(none && value === "none" ? undefined : value)}>
          <SelectTrigger id={id} className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>{field.options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    );
  }

  if (field.kind === "number") {
    return (
      <div className="space-y-1.5">
        {label}
        <Input id={id} type="number" inputMode="decimal" className="tabular-nums" min={field.min} max={field.max} step={field.step ?? 1}
          value={typeof current === "number" ? current : ""} placeholder="Bawaan"
          onChange={(event) => set(event.target.value === "" ? undefined : Number(event.target.value))} />
      </div>
    );
  }

  const text = typeof current === "string" ? current : "";
  if (field.kind === "color") {
    return (
      <div className="space-y-1.5">
        {label}
        <div className="flex items-center gap-2">
          {/* The native picker only understands #rrggbb; other valid CSS colors stay editable as text. */}
          <input type="color" aria-label={`${field.label}, pilih warna`} value={HEX.test(text) ? text : "#000000"}
            onChange={(event) => set(event.target.value)}
            className="size-9 shrink-0 cursor-pointer rounded-md border bg-transparent p-1 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50" />
          <Input id={id} value={text} placeholder={field.placeholder} maxLength={64} onChange={(event) => set(event.target.value)} />
        </div>
      </div>
    );
  }

  return (
    <div className={field.wide ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
      {label}
      <Input id={id} value={text} placeholder={field.placeholder} maxLength={field.maxLength} onChange={(event) => set(event.target.value)} />
    </div>
  );
}

export function ThemeDesignInspector({ content, onChange }: { content: SectionContent; onChange: (next: SectionContent) => void }) {
  const uid = useId();
  const total = countDesignValues(content);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {total ? `${total} nilai diatur. Kolom kosong memakai gaya bawaan.` : "Semua kolom opsional. Kolom kosong memakai gaya bawaan."}
        </p>
        {total ? <Button type="button" variant="ghost" size="sm" onClick={() => onChange(clearDesign(content))}>Atur ulang semua</Button> : null}
      </div>
      <Accordion type="multiple" defaultValue={["background", "typography"]} className="rounded-lg border">
        {DESIGN_PANELS.map((panel) => {
          const count = countDesignValues(content, panel.fields);
          return (
            <AccordionItem key={panel.id} value={panel.id} className="px-4 last:border-b-0">
              <AccordionTrigger className="py-3 hover:no-underline">
                <span className="flex min-w-0 flex-col items-start gap-0.5 text-left">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {panel.title}
                    {count ? <Badge variant="secondary" className="tabular-nums">{count}<span className="sr-only"> nilai diatur</span></Badge> : null}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">{panel.description}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {panel.fields.map((field) => (
                    <Field key={`${field.group}.${field.key}`} id={`${uid}-${field.group}-${field.key}`} field={field} content={content} onChange={onChange} />
                  ))}
                </div>
                {count ? (
                  <Button type="button" variant="outline" size="sm" onClick={() => onChange(panel.fields.reduce((next, field) => writeDesignValue(next, field.group, field.key, undefined), content))}>
                    Atur ulang {panel.title.toLowerCase()}
                  </Button>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
