import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

interface BackendHeaderProps {
  breadcrumbs: ReactNode;
  profileMenu: ReactNode;
  variant: "dashboard" | "admin";
}

export function BackendHeader({
  breadcrumbs,
  profileMenu,
  variant,
}: BackendHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-sidebar">
      <div
        className={
          variant === "dashboard"
            ? "mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2"
            : "mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2.5"
        }
      >
        <div className="flex min-w-0 items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:bg-accent/10" />
          <Separator orientation="vertical" className="hidden h-4! sm:block" />
          <div className="min-w-0">{breadcrumbs}</div>
        </div>
        <div className="flex shrink-0 items-center gap-4">{profileMenu}</div>
      </div>
    </header>
  );
}

export function BackendProfileTrigger({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Button variant="ghost" size="icon" className="size-9.5 rounded-full">
      {children}
    </Button>
  );
}
