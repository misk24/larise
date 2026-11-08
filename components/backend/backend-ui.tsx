import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

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
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
}

interface BackendSectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function BackendSectionHeader({
  title,
  description,
  action,
  className,
}: BackendSectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
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

export function BackendStatCard({
  label,
  value,
  description,
  icon: Icon,
  href,
  className,
}: BackendStatCardProps) {
  const content = (
    <Card
      className={cn(
        "h-full shadow-none transition-colors",
        href && "hover:bg-muted/40",
        className,
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">
            {value}
          </p>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {Icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon aria-hidden="true" className="size-5" />
          </span>
        ) : null}
      </CardContent>
    </Card>
  );

  return href ? (
    <Link
      href={href}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {content}
    </Link>
  ) : (
    content
  );
}

type BackendStatusTone = "neutral" | "success" | "warning" | "danger" | "info";

const statusToneClasses: Record<BackendStatusTone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  success:
    "border-emerald-600/20 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300",
  warning:
    "border-amber-600/20 bg-amber-600/10 text-amber-700 dark:text-amber-300",
  danger: "border-destructive/20 bg-destructive/10 text-destructive",
  info: "border-sky-600/20 bg-sky-600/10 text-sky-700 dark:text-sky-300",
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
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 px-2.5 py-1 font-medium capitalize",
        statusToneClasses[tone],
        className,
      )}
    >
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

export function BackendEmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: BackendEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-10 text-center",
        className,
      )}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="mb-3 size-9 text-muted-foreground/50"
        />
      ) : null}
      <h3 className="font-semibold">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function BackendTableShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("backend-table-container", className)}>{children}</div>
  );
}
