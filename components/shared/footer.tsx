import { Icon } from "@iconify/react";
import { footer } from "./constants";

export function Footer() {
  return (
    <footer>
      <div className="max-w-7xl mx-auto size-full px-4 py-4 flex items-center justify-between gap-3 text-muted-foreground max-sm:flex-col sm:gap-6 sm:px-6">
        <p className="text-sm text-balance max-sm:text-center">
          &copy; {new Date().getFullYear()} {footer.copy}
        </p>
        <div className="flex items-center gap-5">
          {footer.socials.map((social) => (
            <a key={social.label} href={social.href}>
              <Icon icon={`simple-icons:${social.icon}`} className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
