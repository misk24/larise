import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TriangleAlertIcon, type LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

interface BackendPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function BackendPageHeader({
  title,
  description,
  actions,
  className,
}: BackendPageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

interface BackendSectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function BackendSectionHeader({ title, description, action, className }: BackendSectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="min-w-0 space-y-1">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * One connected strip of key figures instead of four separate cards.
 * The 1px gap over a border-coloured background draws the dividers, so it stays
 * correct at 2 columns (phones) and 4 columns (desktop). Expects four children.
 */
export function BackendStatGrid({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border xl:grid-cols-4", className)}
      {...props}
    />
  );
}

interface BackendStatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  href?: string;
  className?: string;
}

/** A single figure inside `BackendStatGrid`. The number leads; the icon is a quiet label marker. */
export function BackendStatCard({ label, value, description, icon: Icon, href, className }: BackendStatCardProps) {
  const cellClasses = cn("flex min-w-0 flex-col gap-2 bg-card p-4 sm:p-5", className);
  const content = (
    <>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        {Icon ? <Icon aria-hidden="true" className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </p>
      <p className="text-3xl font-semibold tabular-nums tracking-tight">{value}</p>
      {description ? <p className="truncate text-xs text-muted-foreground">{description}</p> : null}
    </>
  );

  return href ? (
    <Link
      href={href}
      className={cn(cellClasses, "outline-hidden transition-colors hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring")}
    >
      {content}
    </Link>
  ) : (
    <div className={cellClasses}>{content}</div>
  );
}

type BackendStatusTone = "neutral" | "success" | "warning" | "danger" | "info";

const statusToneClasses: Record<BackendStatusTone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  success: "border-success/20 bg-success-muted text-success",
  warning: "border-warning/20 bg-warning-muted text-warning",
  danger: "border-destructive/20 bg-destructive-muted text-destructive",
  info: "border-info/20 bg-info-muted text-info",
};

export function BackendStatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BackendStatusTone;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 px-2.5 py-1 font-medium", statusToneClasses[tone], className)}>
      {children}
    </Badge>
  );
}

interface BackendEmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export function BackendEmptyState({ title, description, icon: Icon, action, className }: BackendEmptyStateProps) {
  return (
    <div className={cn("flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-10 text-center", className)}>
      {Icon ? (
        <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      ) : null}
      <h3 className="font-semibold">{title}</h3>
      {description ? <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

interface BackendErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Inline failure notice for a data block that could not load. */
export function BackendErrorState({ title = "Data gagal dimuat", description, action, className }: BackendErrorStateProps) {
  return (
    <div role="alert" className={cn("flex flex-col gap-3 rounded-xl border border-destructive/20 bg-destructive-muted p-4 sm:flex-row sm:items-center", className)}>
      <TriangleAlertIcon aria-hidden="true" className="size-5 shrink-0 text-destructive" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function BackendTableShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("backend-table-container", className)}>{children}</div>;
}
