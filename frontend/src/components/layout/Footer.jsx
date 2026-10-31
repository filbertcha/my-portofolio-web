import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight } from "lucide-react";

const links = [
  { label: "About", hash: "about" },
  { label: "Projects", hash: "projects" },
  { label: "Experience", hash: "experience" },
  { label: "Contact", hash: "contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="shell flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <nav
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
          aria-label="Footer navigation"
        >
          {links.map((link) => (
            <Link
              key={link.hash}
              to={`/#${link.hash}`}
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-between gap-5 sm:justify-end">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-700">
            © {new Date().getFullYear()}
          </p>

          <Link
            to="/admin"
            className="inline-flex items-center gap-1 text-xs text-zinc-600 transition-colors hover:text-zinc-300"
          >
            Admin
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </Link>

          <Link
            to="/#top"
            aria-label="Back to top"
            title="Back to top"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-500 transition-colors hover:border-accent-400/30 hover:text-accent-300"
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
