import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-accent/20 bg-surface px-6 py-3">
      <Link href="/" className="font-ui text-lg font-semibold text-primary">
        🐝 BeeCodeFi
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
