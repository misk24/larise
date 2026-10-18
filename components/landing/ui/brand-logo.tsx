import Image from "next/image";

interface BrandLogoProps {
  variant?: "header" | "footer";
  width?: number;
  height?: number;
  className?: string;
}

export function BrandLogo({
  variant = "header",
  width = 150,
  height = 50,
  className,
}: BrandLogoProps) {
  return (
    <Image
      src={variant === "footer" ? "/images/logo-dark.png" : "/images/logo-light.png"}
      alt="LARISÉ"
      width={width}
      height={height}
      className={["h-6 w-auto object-contain", className].filter(Boolean).join(" ")}
      priority={variant === "header"}
    />
  );
}
