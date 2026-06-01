import { Instagram, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 bg-gradient-navy overflow-hidden">
      <div className="divider-gold mb-16" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-3 gap-10 items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                <span className="font-display text-navy-deep font-bold text-lg">V</span>
              </div>
              <div>
                <div className="font-display text-2xl font-semibold tracking-tight">VERVE</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Est. Excellence</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Official Social Media & Digital Media Hub of St. Xavier's College (Autonomous), Ranchi.
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="text-xs uppercase tracking-[0.28em] text-gold mb-3">Reach</div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold shrink-0" />
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

          <div className="md:text-right">
            <div className="text-xs uppercase tracking-[0.28em] text-gold mb-3">Tagline</div>
            <p className="font-display text-xl sm:text-2xl text-balance leading-snug">
              Creating Impact Through <span className="text-gradient-gold">Digital Excellence.</span>
            </p>
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
