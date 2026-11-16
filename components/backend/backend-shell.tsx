"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState, useSyncExternalStore, type ReactNode } from "react";

interface BackendShellProps {
  sidebar: ReactNode;
  header: ReactNode;
  breadcrumbs: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  variant: "dashboard" | "admin";
  /** Desktop sidebar preference, read from the sidebar_state cookie by the layout. */
  defaultOpen?: boolean;
  className?: string;
}

const SIDEBAR_COOKIE = "sidebar_state";
// Desktop shows the full sidebar; tablets (md to lg) start as an icon rail; phones use a sheet.
const WIDE_QUERY = "(min-width: 1024px)";

function subscribeWide(onChange: () => void) {
  const mql = window.matchMedia(WIDE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export function BackendShell({
  sidebar,
  header,
  breadcrumbs,
  footer,
  children,
  defaultOpen = true,
  className,
}: BackendShellProps) {
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE_QUERY).matches, () => true);
  const [desktopOpen, setDesktopOpen] = useState(defaultOpen);
  const [tabletOpen, setTabletOpen] = useState(false);

  function handleOpenChange(next: boolean) {
    if (!wide) return setTabletOpen(next);
    setDesktopOpen(next);
    // Only a deliberate desktop choice is remembered; tablet collapse never overwrites it.
    document.cookie = `${SIDEBAR_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }

  return (
    <div className={cn("backend-shell flex w-full min-h-screen bg-background", className)}>
      <SidebarProvider open={wide ? desktopOpen : tabletOpen} onOpenChange={handleOpenChange}>
        {sidebar}
        <div className="flex min-w-0 flex-1 flex-col">
          {header}
          <main className="backend-page">
            <div className="mb-6 min-w-0">{breadcrumbs}</div>
            {children}
          </main>
          {footer}
        </div>
      </SidebarProvider>
    </div>
  );
}
