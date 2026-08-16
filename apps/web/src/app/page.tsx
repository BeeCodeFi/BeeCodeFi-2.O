import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-start gap-6 px-6 py-24">
      <h1 className="text-4xl font-semibold text-text">Free Premium Education For Everyone</h1>
      <p className="text-lg text-text/80">
        Read → Practice in editor → Quiz exhaustively → Build a mini-project → Push to GitHub.
        One tight loop per concept, with progress tracked end-to-end.
      </p>
      <div className="flex gap-3">
        <Link href="/auth/register">
          <Button>Get started</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
      </div>
    </section>
  );
}
