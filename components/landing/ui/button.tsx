import * as React from "react";
import { cn } from "@/lib/utils";

export type LandingButtonVariant = "primary" | "secondary" | "text" | "icon";
export type LandingButtonSize = "sm" | "md" | "lg" | "icon";

const baseStyles =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A58A67] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F6F1] disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<LandingButtonVariant, string> = {
  primary:
    "border-[#29271F] bg-[#29271F] text-[#FAF8F3] hover:border-[#51483B] hover:bg-[#51483B]",
  secondary:
    "border-[#29271F]/25 bg-transparent text-[#29271F] hover:border-[#A58A67] hover:bg-[#A58A67]/10",
  text: "border-transparent bg-transparent text-[#29271F] hover:text-[#927653]",
  icon:
    "border-[#29271F]/20 bg-transparent text-[#29271F] hover:border-[#A58A67] hover:bg-[#A58A67]/10",
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
