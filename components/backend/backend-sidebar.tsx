"use client";

import { Logo } from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface BackendNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface BackendSidebarProps {
  items: BackendNavItem[];
}

export function BackendSidebar({ items }: BackendSidebarProps) {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        <SidebarHeader>
          <div
            className={cn(
              "overflow-hidden p-2 transition-all duration-300",
              collapsed ? "scale-90 opacity-0" : "scale-100 opacity-100",
            )}
          >
            <Logo variant="footer" />
          </div>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    item.href !== "/admin" &&
                    pathname.startsWith(`${item.href}/`));
                const menu = (
                  <SidebarMenuButton
                    className={cn(
                      "rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                    asChild
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (isMobile) setOpenMobile(false);
                      }}
                      className="flex items-center gap-4 px-4 py-5"
                    >
                      <item.icon className="size-5" />
                      <p>{item.label}</p>
                    </Link>
                  </SidebarMenuButton>
                );

                return (
                  <SidebarMenuItem key={item.href}>
                    {collapsed ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>{menu}</TooltipTrigger>
                          <TooltipContent side="right">{item.label}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      menu
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
