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
import { Profile } from "@/types/database";
import { User } from "@supabase/supabase-js";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  trigger: ReactNode;
  user: User;
  profile: Profile | null;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

export function AdminProfile({
  trigger,
  user,
  profile,
  defaultOpen,
  align = "end",
}: Props) {
  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    user.email?.[0].toUpperCase() ||
    "U";

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 bg-sidebar" align={align || "end"}>
        <DropdownMenuLabel className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage
                src={profile?.avatar_url || ""}
                alt={profile?.full_name || "Admin"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="absolute right-0 bottom-0 size-2 rounded-full bg-green-600" />
          </div>

          <div className="flex flex-1 flex-col items-start">
            <span className="text-foreground text-lg font-semibold">
              {profile?.full_name || "Admin"}
            </span>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="px-4 py-2 focus:bg-secondary focus:rounded-md text-muted-foreground">
            <UserIcon className="size-5" />
            <p>My Account</p>
          </DropdownMenuItem>

          <DropdownMenuItem className="px-4 py-2 focus:bg-secondary focus:rounded-md text-muted-foreground">
            <SettingsIcon className="size-5" />
            <p>Settings</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="px-4 py-2 focus:bg-secondary focus:rounded-md text-muted-foreground"
          onClick={() => signOut()}
        >
          <LogOutIcon className="size-5" />
          <p>Logout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
