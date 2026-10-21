import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BackendProfileMenu } from "@/components/backend/backend-profile-menu";
import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";
import type { ReactNode } from "react";

interface BackendHeaderProps {
  breadcrumbs: ReactNode;
  user: User;
  profile: Profile | null;
  role: "user" | "admin";
}

export function BackendHeader({ breadcrumbs, user, profile, role }: BackendHeaderProps) {
  const initials =
    profile?.full_name?.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2) ||
    user.email?.[0].toUpperCase() ||
    (role === "admin" ? "A" : "U");

  return (
    <header className="sticky top-0 z-50 border-b bg-sidebar">
      <div className={role === "user"
        ? "mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2"
        : "mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2.5"}>
        <div className="flex min-w-0 items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:bg-accent/10" />
          <Separator orientation="vertical" className="hidden h-4! sm:block" />
          <div className="min-w-0">{breadcrumbs}</div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <BackendProfileMenu
            trigger={
              <Button variant="ghost" size="icon" className="size-9.5 rounded-full">
                <Avatar className="size-9.5">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || (role === "admin" ? "Admin" : "User")} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            }
            user={user}
            profile={profile}
            role={role}
          />
        </div>
      </div>
    </header>
  );
}
