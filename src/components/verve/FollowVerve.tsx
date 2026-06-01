import { motion } from "framer-motion";
import { Instagram, Facebook } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export const INSTAGRAM_URL =
  "https://www.instagram.com/sxcranchi.official?igsh=M2dscnFlbHU2NXJp";
export const FACEBOOK_URL = "https://www.facebook.com/share/17PTnJRL6X/";

export function SocialIconButton({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: typeof Instagram;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className="group relative w-14 h-14 rounded-full glass border border-[color:var(--glass-border-gold)] flex items-center justify-center overflow-hidden hover:shadow-gold-strong transition-shadow"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-gold/0 group-hover:bg-gold/15 transition-colors"
      />
      <span
        aria-hidden
        className="absolute -inset-2 rounded-full bg-gold/20 opacity-0 blur-xl group-hover:opacity-60 transition-opacity"
      />
      <Icon className="relative w-5 h-5 text-gold group-hover:text-[color:var(--gold-bright,_oklch(0.9_0.16_88))] transition-colors" />
    </motion.a>
  );
}

export function FollowVerve() {
  return (
    <section id="follow" className="relative py-24 bg-gradient-navy overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[700px] aspect-square rounded-full bg-gold/8 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <SectionHeading eyebrow="Stay Connected" title="Follow VERVE" />
        <p className="mt-4 text-muted-foreground">
          Stay connected with VERVE through our official social media platforms.
        </p>
        <div className="mt-10 flex items-center justify-center gap-5">
          <SocialIconButton href={INSTAGRAM_URL} label="Instagram" Icon={Instagram} />
          <SocialIconButton href={FACEBOOK_URL} label="Facebook" Icon={Facebook} />
        </div>
      </div>
    </section>
  );
}
