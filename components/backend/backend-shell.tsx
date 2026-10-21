import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BackendShellProps {
  sidebar: ReactNode;
  header: ReactNode;
  breadcrumbs: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  variant: "dashboard" | "admin";
  className?: string;
}

export function BackendShell({
  sidebar,
  header,
  breadcrumbs,
  footer,
  children,
  variant,
  className,
}: BackendShellProps) {
  return (
    <div
      className={cn(
        "backend-shell flex w-full",
        variant === "dashboard" && "min-h-screen bg-primary/10",
        className,
      )}
    >
      <SidebarProvider>
        {sidebar}
        <div className="min-w-0 flex flex-1 flex-col">
          {header}
          <main
            className={
              variant === "dashboard"
                ? "mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col overflow-hidden p-6"
                : "backend-page"
            }
          >
            <div className="mb-6 min-w-0">{breadcrumbs}</div>
            {children}
          </main>
          {footer}
        </div>
      </SidebarProvider>
    </div>
  );
}
