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
import { LogOut, Settings, User } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

export function AdminProfile({ trigger, defaultOpen, align = "end" }: Props) {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-sidebar" align={align || "end"}>
        <DropdownMenuLabel className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage
                src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
                alt="John Doe"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="absolute right-0 bottom-0 size-2 rounded-full bg-green-600" />
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-foreground text-lg font-semibold">
              John Doe
            </span>
            <p className="text-muted-foreground">john.doe@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="px-4 py-2 focus:bg-accent/10 focus:rounded-md text-muted-foreground">
            <User className="size-5" />
            <p>My Account</p>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2 focus:bg-accent/10 focus:rounded-md text-muted-foreground">
            <Settings className="size-5" />
            <p>Settings</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="px-4 py-2 focus:bg-accent/10 focus:rounded-md text-muted-foreground"
          onClick={() => signOut()}
        >
          <LogOut className="size-5" />
          <p>Logout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
