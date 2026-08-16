import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-accent/15 bg-surface/85 px-6 py-3 shadow-soft backdrop-blur-md">
      <Link
        href="/"
        className="font-ui text-lg font-semibold text-primary transition-transform duration-150 hover:scale-[1.03]"
      >
        🐝 BeeCodeFi
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="/auth/login"
          className="text-sm font-medium text-text/80 transition-colors hover:text-primary"
        >
          Sign in
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
