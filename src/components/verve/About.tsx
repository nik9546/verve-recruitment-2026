import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";

const Globe = lazy(() => import("./three/Globe"));

export function About() {
  return (
    <section id="about" className="relative py-28 sm:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="About" title={<>What is <span className="text-gradient-gold">VERVE</span>?</>} />

        <div className="mt-16 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="space-y-5 text-base sm:text-lg leading-relaxed text-muted-foreground"
          >
            <p>
              <span className="text-foreground font-semibold">VERVE</span> is the Official Social Media and Digital Media Hub of St. Xavier's College (Autonomous), Ranchi.
            </p>
            <p>
              We are responsible for managing the institution's digital presence, official communications, event promotions, media coverage, branding initiatives, content creation, and digital storytelling.
            </p>
            <p>
              VERVE serves as a platform where students gain practical experience in leadership, media management, communication, creativity, digital innovation, event execution, and teamwork.
            </p>
            <div className="pt-4 flex flex-wrap gap-2">
              {["Branding", "Storytelling", "Leadership", "Innovation", "Community"].map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full glass text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="relative aspect-square max-w-md mx-auto w-full"
          >
            <div className="absolute inset-0 rounded-full bg-gold/10 blur-3xl" />
            <Suspense fallback={<div className="absolute inset-0 rounded-full glass" />}>
              <Globe />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
