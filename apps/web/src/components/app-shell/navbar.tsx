import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "./user-menu";

export function Navbar() {
  return (
    <header className="animate-fade-in-down sticky top-0 z-40 flex items-center justify-between border-b border-accent/15 bg-surface/85 px-6 py-3.5 shadow-soft backdrop-blur-md">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-ui text-lg font-bold text-text transition-opacity hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent font-mono text-sm font-bold text-white shadow-glow transition-all duration-300 group-hover:shadow-glow-lg group-hover:scale-105">
            {"</>"}
          </span>
          <span className="tracking-tight">BeeCodeFi</span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/courses", label: "Courses" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-text/65 transition-colors duration-200 hover:text-primary
                         after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
