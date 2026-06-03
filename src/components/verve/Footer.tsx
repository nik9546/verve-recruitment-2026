import { } from "lucide-react";
import verveLogo from "@/assets/verve-logo.png";
import collegeCrest from "@/assets/college-crest.png";

const QUICK_LINKS = [
  { href: "#about", label: "About VERVE" },
  { href: "#departments", label: "Opportunities" },
  { href: "#leadership", label: "Leadership" },
  { href: "#certification", label: "Certifications" },
  { href: "#process", label: "Recruitment Process" },
  { href: "#follow", label: "Follow VERVE" },
  { href: "#apply", label: "Apply Now" },
];

export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 bg-gradient-navy overflow-hidden">
      <div className="divider-gold mb-16" />
      <div className="mx-auto max-w-7xl px-6">
        {/* Brand lockup */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="flex items-center gap-6 sm:gap-7">
            <img
              src={verveLogo}
              alt="VERVE"
              className="h-10 sm:h-12 w-auto"
              style={{ filter: "drop-shadow(0 0 22px oklch(0.82 0.14 88 / 0.35))" }}
              draggable={false}
            />
            <span aria-hidden className="h-10 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
            <img
              src={collegeCrest}
              alt="St. Xavier's College, Ranchi"
              className="h-11 sm:h-12 w-11 sm:w-12 object-contain rounded-full bg-white/95 p-1.5 ring-1 ring-[color:var(--glass-border-gold)]"
              draggable={false}
            />
          </div>
          <div className="mt-6 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Official Social Media &amp; Digital Media Hub
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            St. Xavier's College (Autonomous), Ranchi
          </div>
          <p className="mt-5 tagline-motto text-lg sm:text-xl">
            Creating Impact Through Digital Excellence
          </p>
        </div>

        <div className="max-w-md mx-auto text-center">
          <div className="text-xs uppercase tracking-[0.28em] text-gold mb-4">Quick Links</div>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 pt-6 border-t border-[color:var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} VERVE — St. Xavier's College, Ranchi. All rights reserved.</div>
          <div className="uppercase tracking-[0.25em]">Recruitment Portal 2026</div>
        </div>
      </div>
    </footer>
  );
}
