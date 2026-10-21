"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/actions/auth";
import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface BackendProfileMenuProps {
  trigger: ReactNode;
  user: User;
  profile: Profile | null;
  role: "user" | "admin";
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
}

export function BackendProfileMenu({
  trigger,
  user,
  profile,
  role,
  defaultOpen,
  align = "end",
}: BackendProfileMenuProps) {
  const isAdmin = role === "admin";
  const fallbackName = isAdmin ? "Admin" : "User";
  const initials =
    profile?.full_name?.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2) ||
    user.email?.[0].toUpperCase() ||
    (isAdmin ? "A" : "U");
  const basePath = isAdmin ? "/admin" : "/dashboard";

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-sidebar" align={align}>
        <DropdownMenuLabel className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || fallbackName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 size-2 rounded-full bg-green-600" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <span className="text-lg font-semibold text-foreground">
              {profile?.full_name || fallbackName}
            </span>
            <p className="max-w-full truncate text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {!isAdmin && (
            <DropdownMenuItem asChild className="px-4 py-2 text-muted-foreground focus:rounded-md focus:bg-accent/10">
              <Link href="/dashboard/account" className="flex items-center gap-2">
                <UserIcon className="size-5" />
                <span>My Account</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild className="px-4 py-2 text-muted-foreground focus:rounded-md focus:bg-accent/10">
            <Link href={`${basePath}/settings`} className="flex items-center gap-2">
              <SettingsIcon className="size-5" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="px-4 py-2 text-muted-foreground focus:rounded-md focus:bg-accent/10"
          onClick={() => signOut()}
        >
          <LogOutIcon className="size-5" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
