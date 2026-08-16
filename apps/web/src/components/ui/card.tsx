import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-accent/15 bg-surface p-4 shadow-soft transition-shadow duration-200 ${className}`}
      {...props}
    />
  );
}
