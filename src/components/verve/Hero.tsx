import { motion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { StatCounter } from "./StatCounter";
import verveLogo from "@/assets/verve-logo.png";
import collegeCrest from "@/assets/college-crest.png";

const HeroScene = lazy(() => import("./three/HeroScene"));

export function Hero() {
  const [mobile, setMobile] = useState(false);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    // Defer 3D mount slightly to keep first paint fast
    const t = setTimeout(() => setShow3D(true), 120);
    return () => {
      mq.removeEventListener("change", update);
      clearTimeout(t);
    };
  }, []);

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero grain pt-24 pb-16">
      {/* Aurora glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[1100px] max-h-[1100px] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute top-1/3 -left-32 w-[40vw] h-[40vw] max-w-[600px] rounded-full bg-[oklch(0.35_0.12_240)]/30 blur-[100px]" />
      </div>

      {/* 3D layer */}
      <div className="absolute inset-0 pointer-events-none">
        {show3D && (
          <Suspense fallback={null}>
            <div className="absolute inset-0 opacity-90">
              <HeroScene mobile={mobile} />
            </div>
          </Suspense>
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-xs uppercase tracking-[0.28em] text-gold mb-7"
        >
          <Sparkles className="w-3.5 h-3.5" />
          St. Xavier's College (Autonomous), Ranchi
        </motion.div>

        {/* Official collaboration lockup */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="mb-8 flex items-center justify-center gap-5 sm:gap-7"
        >
          <div className="relative">
            <span aria-hidden className="absolute -inset-3 rounded-2xl bg-gold/20 blur-xl opacity-70" />
            <img
              src={verveLogo}
              alt="VERVE"
              className="relative h-12 sm:h-16 w-auto"
              draggable={false}
            />
          </div>
          <span aria-hidden className="h-10 sm:h-12 w-px bg-gradient-to-b from-transparent via-gold/70 to-transparent" />
          <div className="relative">
            <span aria-hidden className="absolute -inset-2 rounded-full bg-gold/20 blur-xl opacity-70" />
            <img
              src={collegeCrest}
              alt="St. Xavier's College, Ranchi"
              className="relative h-12 w-12 sm:h-16 sm:w-16 object-contain rounded-full bg-white/95 p-1.5 ring-1 ring-[color:var(--glass-border-gold)]"
              draggable={false}
            />
          </div>
        </motion.div>


        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative font-display text-5xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[0.95] font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-10 -bottom-10 mx-auto max-w-3xl bg-gold/20 blur-[80px] opacity-70"
          />
          <span className="relative">VERVE</span>
          <span className="relative block mt-2 text-3xl sm:text-4xl md:text-5xl text-gradient-gold font-medium">
            Recruitment Portal 2026
          </span>
        </motion.h1>


        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-7 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground"
        >
          Join the Official Social Media & Digital Media Hub of St. Xavier's College, Ranchi.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-4 tagline-motto text-base sm:text-lg md:text-xl"
        >
          Creating Impact Through Digital Excellence
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#apply"
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-gold text-navy-deep font-semibold shadow-gold hover:shadow-gold-strong transition-all hover:scale-[1.03]"
          >
            Apply Now
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#departments"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl glass border border-[color:var(--glass-border-gold)] font-medium hover:border-gold transition-colors"
          >
            Explore Opportunities
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl py-6 px-4">
            <StatCounter value={12} suffix="+" label="Skill Domains" />
          </div>
          <div className="glass rounded-2xl py-6 px-4">
            <StatCounter value={4} label="Recognition Tiers" />
          </div>
          <div className="glass rounded-2xl py-6 px-4">
            <StatCounter value={5} label="Leadership Levels" />
          </div>
          <div className="glass rounded-2xl py-6 px-4 text-center">
            <div className="font-display text-4xl sm:text-5xl font-semibold text-gradient-gold">
              Official
            </div>
            <div className="mt-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Media Team
            </div>
          </div>

        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-gold to-transparent"
        />
      </div>
    </section>
  );
}
