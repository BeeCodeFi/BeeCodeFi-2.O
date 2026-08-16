import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-primary text-bg shadow-soft hover:shadow-card hover:brightness-105 active:brightness-95",
  secondary:
    "bg-accent text-bg shadow-soft hover:shadow-card hover:brightness-105 active:brightness-95",
  ghost: "bg-transparent text-text border hover:bg-surface hover:border-accent/40",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ease-out will-change-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  ),
);
Button.displayName = "Button";
