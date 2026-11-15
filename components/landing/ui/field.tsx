"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// 16px text stops iOS Safari from zooming the page when an input is focused.
const inputStyles =
  "min-h-12 w-full rounded-[4px] border border-fg/55 bg-surface px-4 text-base text-fg transition-colors placeholder:text-fg/70 focus-visible:border-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger";

export interface FieldProps extends React.ComponentProps<"input"> {
  id: string;
  label: string;
  error?: string;
}

function FieldFrame({ id, label, error, children }: Pick<FieldProps, "id" | "label" | "error"> & { children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-fg">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function a11y(id: string, error?: string) {
  return { "aria-invalid": error ? true : undefined, "aria-describedby": error ? `${id}-error` : undefined } as const;
}

export function Field({ id, label, error, className, ...props }: FieldProps) {
  return (
    <FieldFrame id={id} label={label} error={error}>
      <input id={id} name={id} className={cn(inputStyles, className)} {...a11y(id, error)} {...props} />
    </FieldFrame>
  );
}

export function PasswordField({ id, label, error, className, ...props }: Omit<FieldProps, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <FieldFrame id={id} label={label} error={error}>
      <div className="relative">
        <input id={id} name={id} type={visible ? "text" : "password"} className={cn(inputStyles, "pr-12", className)} {...a11y(id, error)} {...props} />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-pressed={visible}
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          disabled={props.disabled}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-fg/70 transition-colors hover:text-fg disabled:opacity-50"
        >
          {visible ? <EyeOffIcon aria-hidden="true" className="size-4" /> : <EyeIcon aria-hidden="true" className="size-4" />}
        </button>
      </div>
    </FieldFrame>
  );
}

// First message per field, keyed by the schema field name (which is also the input id).
export function getFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function focusField(id?: string) {
  if (id) document.getElementById(id)?.focus();
}
