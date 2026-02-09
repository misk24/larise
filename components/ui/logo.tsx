import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoVariant = "default" | "footer";

interface LogoProps {
  variant?: LogoVariant;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

export function Logo({
  variant = "default",
  width = 150,
  height = 50,
  className,
  alt = "Logo",
}: LogoProps) {
  const src =
    variant === "footer" ? "/images/logo-dark.png" : "/images/logo-light.png";

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("w-auto h-6 object-contain", className)}
      priority
    />
  );
}
