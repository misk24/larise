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
import { userNavs } from "@/config/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        <SidebarHeader>
          <div
            className={cn(
              "p-2 transition-all duration-300 overflow-hidden",
              collapsed ? "opacity-0 scale-90" : "opacity-100 scale-100",
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
              {userNavs.map((link) => {
                const isActive = pathname === link.href;

                const menu = (
                  <SidebarMenuButton
                    key={link.href}
                    className={cn(
                      "rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                    asChild
                  >
                    <Link
                      href={link.href}
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                      className="flex items-center gap-4 px-4 py-5"
                    >
                      <link.icon className="size-5" />
                      <p>{link.label}</p>
                    </Link>
                  </SidebarMenuButton>
                );

                if (!collapsed) return menu;

                return (
                  <SidebarMenuItem key={link.href}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>{menu}</TooltipTrigger>
                        <TooltipContent side="right">
                          {link.label}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
