import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "./user-menu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-accent/15 bg-surface/85 px-6 py-3 shadow-soft backdrop-blur-md">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 font-ui text-lg font-semibold text-text">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent font-mono text-sm text-white shadow-soft">
            {"</>"}
          </span>
          BeeCodeFi
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/" className="text-sm font-medium text-text/70 transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/courses" className="text-sm font-medium text-text/70 transition-colors hover:text-primary">
            Courses
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
