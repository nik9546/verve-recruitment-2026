import { Instagram, Facebook, Mail, MapPin } from "lucide-react";
import verveLogo from "@/assets/verve-logo.png";
import collegeCrest from "@/assets/college-crest.png";
import { INSTAGRAM_URL, FACEBOOK_URL } from "./FollowVerve";

const QUICK_LINKS = [
  { href: "#about", label: "About VERVE" },
  { href: "#departments", label: "Opportunities" },
  { href: "#leadership", label: "Leadership" },
  { href: "#certification", label: "Certifications" },
  { href: "#process", label: "Recruitment Process" },
  { href: "#apply", label: "Apply Now" },
];

const SOCIALS = [
  { icon: Instagram, href: INSTAGRAM_URL, label: "Instagram" },
  { icon: Facebook, href: FACEBOOK_URL, label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 bg-gradient-navy overflow-hidden">
      <div className="divider-gold mb-16" />
      <div className="mx-auto max-w-7xl px-6">
        {/* Brand lockup */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="flex items-center gap-6 sm:gap-8">
            <img
              src={verveLogo}
              alt="VERVE"
              className="h-14 sm:h-16 w-auto"
              style={{ filter: "drop-shadow(0 0 22px oklch(0.82 0.14 88 / 0.35))" }}
              draggable={false}
            />
            <span aria-hidden className="h-12 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
            <img
              src={collegeCrest}
              alt="St. Xavier's College, Ranchi"
              className="h-14 sm:h-16 w-14 sm:w-16 object-contain rounded-full bg-white/95 p-1.5 ring-1 ring-[color:var(--glass-border-gold)]"
              draggable={false}
            />
          </div>
          <div className="mt-6 font-display text-3xl font-semibold tracking-tight">VERVE</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Official Social Media &amp; Digital Media Hub
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            St. Xavier's College (Autonomous), Ranchi
          </div>
          <p className="mt-5 tagline-motto text-lg sm:text-xl">
            Creating Impact Through Digital Excellence
          </p>

          <div className="mt-7 flex items-center gap-3">
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-11 h-11 rounded-full glass border border-[color:var(--glass-border-gold)] flex items-center justify-center hover:shadow-gold-strong hover:scale-[1.06] transition-all"
                >
                  <Icon className="w-4 h-4 text-gold" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-12 items-start max-w-3xl mx-auto">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-gold mb-4">Quick Links</div>
            <ul className="space-y-2 text-sm">
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

          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-gold mb-4">Contact</div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>St. Xavier's College (Autonomous), Ranchi</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>verve@sxcran.org</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-[color:var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} VERVE — St. Xavier's College, Ranchi. All rights reserved.</div>
          <div className="uppercase tracking-[0.25em]">Recruitment Portal 2026</div>
        </div>
      </div>
    </footer>
  );
}
