import { Instagram, Facebook, Youtube, Mail, MapPin } from "lucide-react";

const QUICK_LINKS = [
  { href: "#about", label: "About VERVE" },
  { href: "#departments", label: "Opportunities" },
  { href: "#leadership", label: "Leadership" },
  { href: "#certification", label: "Certifications" },
  { href: "#process", label: "Recruitment Process" },
  { href: "#apply", label: "Apply Now" },
];

const SOCIALS = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 bg-gradient-navy overflow-hidden">
      <div className="divider-gold mb-16" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-4 gap-12 items-start">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                <span className="font-display text-navy-deep font-bold text-lg">V</span>
              </div>
              <div>
                <div className="font-display text-2xl font-semibold tracking-tight">VERVE</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Official Social Media &amp; Digital Media Hub
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              St. Xavier's College (Autonomous), Ranchi.
            </p>
            <p className="mt-4 tagline-motto text-xl sm:text-2xl leading-snug max-w-md">
              Creating Impact Through Digital Excellence
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:border-[color:var(--glass-border-gold)] hover:shadow-gold transition-all"
                  >
                    <Icon className="w-4 h-4 text-gold" />
                  </a>
                );
              })}
            </div>
          </div>

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
            <div className="text-xs uppercase tracking-[0.28em] text-gold mb-4">Reach</div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>St. Xavier's College (Autonomous), Ranchi</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>verve@sxcran.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-gold shrink-0" />
                <span>@verve.sxcran</span>
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
