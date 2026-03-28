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
import { adminNavs } from "@/config/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-primary">
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
          <SidebarGroupLabel className="text-primary-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavs.map((link) => {
                const isActive = pathname === link.href;

                const menu = (
                  <SidebarMenuButton
                    key={link.href}
                    className={cn(
                      "rounded-md transition-colors",
                      isActive
                        ? "bg-[#2f3135] text-primary-foreground hover:bg-[#2f3135] hover:text-primary-foreground"
                        : "text-primary-foreground hover:bg-[#a9cec2]",
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
