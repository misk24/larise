import * as React from "react";
import { cn } from "@/lib/utils";

export type LandingButtonVariant = "primary" | "secondary" | "text" | "icon";
export type LandingButtonSize = "sm" | "md" | "lg" | "icon";

const baseStyles =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<LandingButtonVariant, string> = {
  primary:
    "border-fg bg-fg text-background hover:border-fg/85 hover:bg-fg/85",
  secondary:
    "border-fg/25 bg-transparent text-fg hover:border-gold hover:bg-gold/10",
  text: "border-transparent bg-transparent text-fg hover:text-gold-deep",
  icon:
    "border-fg/20 bg-transparent text-fg hover:border-gold hover:bg-gold/10",
};

const sizeStyles: Record<LandingButtonSize, string> = {
  sm: "min-h-9 px-3.5 text-xs",
  md: "min-h-11 px-5",
  lg: "min-h-12 px-6 text-sm",
  icon: "size-10 p-0",
};

export function landingButtonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: LandingButtonVariant;
  size?: LandingButtonSize;
  className?: string;
} = {}) {
  return cn(baseStyles, "rounded-[4px]", variantStyles[variant], sizeStyles[size], className);
}

export interface LandingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LandingButtonVariant;
  size?: LandingButtonSize;
}

export function LandingButton({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: LandingButtonProps) {
  return (
    <button
      type={type}
      className={landingButtonStyles({ variant, size, className })}
      {...props}
    />
  );
}
