import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AdminShellProps {
  sidebar: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AdminShell({
  sidebar,
  header,
  footer,
  children,
  className,
}: AdminShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen w-full bg-background text-foreground",
        className,
      )}
    >
      <SidebarProvider>
        {sidebar}
        <div className="flex flex-1 flex-col bg-sidebar">
          {header}
          <main className="max-w-7xl mx-auto size-full p-6 flex-1">
            {children}
          </main>
          {footer}
        </div>
      </SidebarProvider>
    </div>
  );
}
