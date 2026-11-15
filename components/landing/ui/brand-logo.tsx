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
  const classes = ["h-6 w-auto object-contain", className].filter(Boolean);

  if (variant === "footer") {
    return <Image src="/images/logo-dark.png" alt="LARISÉ" width={width} height={height} className={classes.join(" ")} />;
  }

  // The header sits on a surface that flips with the theme, so it carries both logos and CSS picks one.
  return (
    <>
      <Image src="/images/logo-light.png" alt="LARISÉ" width={width} height={height} className={[...classes, "[html[data-theme=dark]_&]:hidden"].join(" ")} priority />
      <Image src="/images/logo-dark.png" alt="" aria-hidden="true" width={width} height={height} className={[...classes, "hidden [html[data-theme=dark]_&]:block"].join(" ")} />
    </>
  );
}
