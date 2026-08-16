import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-accent/20 bg-surface p-4 shadow-sm ${className}`}
      {...props}
    />
  );
}
