"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export function BackendThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-9 text-muted-foreground" aria-label="Ubah tema tampilan">
          {/* Both icons render and CSS picks one, so there is no hydration flash. */}
          <SunIcon aria-hidden="true" className="size-4.5 dark:hidden" />
          <MoonIcon aria-hidden="true" className="hidden size-4.5 dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">Terang</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Gelap</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">Sistem</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
