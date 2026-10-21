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
  className,
}: BackendShellProps) {
  return (
    <div
      className={cn(
        "backend-shell flex w-full",
        "min-h-screen bg-background",
        className,
      )}
    >
      <SidebarProvider>
        {sidebar}
        <div className="min-w-0 flex flex-1 flex-col">
          {header}
          <main
            className="backend-page"
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
