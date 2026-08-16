import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-primary text-bg shadow-soft hover:shadow-card hover:brightness-105 active:brightness-95 active:scale-[0.98]",
  secondary:
    "bg-accent text-bg shadow-soft hover:shadow-card hover:brightness-105 active:brightness-95 active:scale-[0.98]",
  ghost:
    "bg-transparent text-text border border-accent/25 hover:bg-surface-hover hover:border-accent/50 active:scale-[0.98]",
  danger:
    "bg-error/10 text-error border border-error/30 hover:bg-error/20 active:scale-[0.98]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 ease-spring will-change-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  ),
);
Button.displayName = "Button";
