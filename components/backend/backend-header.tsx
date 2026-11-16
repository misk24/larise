import { BackendProfileMenu } from "@/components/backend/backend-profile-menu";
import { BackendThemeToggle } from "@/components/backend/backend-theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";

interface BackendHeaderProps {
  user: User;
  profile: Profile | null;
  role: "user" | "admin";
}

export function BackendHeader({ user, profile, role }: BackendHeaderProps) {
  const initials =
    profile?.full_name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    user.email?.[0].toUpperCase() ||
    (role === "admin" ? "A" : "U");
  const name = profile?.full_name || (role === "admin" ? "Admin" : "User");

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <SidebarTrigger className="size-9 text-muted-foreground" />
        <div className="flex shrink-0 items-center gap-1">
          <BackendThemeToggle />
          <BackendProfileMenu
            trigger={
              <Button variant="ghost" size="icon" className="size-9 rounded-full" aria-label={`Menu akun ${name}`}>
                <Avatar className="size-8">
                  <AvatarImage src={profile?.avatar_url || ""} alt={name} />
                  <AvatarFallback className="bg-secondary text-xs font-medium text-secondary-foreground">{initials}</AvatarFallback>
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
