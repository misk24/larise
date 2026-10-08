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

export function AdminShell({ sidebar, header, footer, children, className }: AdminShellProps) {
  return (
    <div className={cn("backend-shell flex w-full", className)}>
      <SidebarProvider>
        {sidebar}
        <div className="min-w-0 flex flex-1 flex-col">
          {header}
          <main className="backend-page">{children}</main>
          {footer}
        </div>
      </SidebarProvider>
    </div>
  );
}
