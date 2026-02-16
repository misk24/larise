import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardShellProps {
  sidebar: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardShell({
  sidebar,
  header,
  footer,
  children,
  className,
}: DashboardShellProps) {
  return (
    <div className={cn("flex min-h-screen w-full bg-primary/10", className)}>
      <SidebarProvider>
        {sidebar}
        <div className="min-w-0 flex flex-1 flex-col">
          {header}
          <main className="max-w-7xl mx-auto w-full min-w-0 p-6 flex flex-1 flex-col overflow-hidden">
            {children}
          </main>
          {footer}
        </div>
      </SidebarProvider>
    </div>
  );
}
