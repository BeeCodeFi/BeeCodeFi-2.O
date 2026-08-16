import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-accent/15 bg-surface p-5 shadow-soft transition-all duration-300 ${className}`}
      {...props}
    />
  );
}
