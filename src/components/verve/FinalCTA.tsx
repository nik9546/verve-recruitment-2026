import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-14 text-center"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80%] h-72 bg-gold/15 blur-[100px]" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-[11px] uppercase tracking-[0.28em] text-gold mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Final Call
            </div>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-balance">
              Ready to Represent the Digital Identity of{" "}
              <span className="text-gradient-gold">St. Xavier's College?</span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
              Join a team where creativity meets leadership, ideas become impact, and contribution becomes recognition. Whether you are a beginner eager to learn or someone with existing skills, VERVE provides the platform to grow, create, and lead.
            </p>

            <motion.a
              href="#apply"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="group mt-10 inline-flex items-center gap-3 px-9 py-5 rounded-2xl bg-gradient-gold text-navy-deep font-semibold text-base sm:text-lg shadow-gold-strong relative overflow-hidden"
              style={{ filter: "drop-shadow(0 0 30px oklch(0.82 0.14 88 / 0.45))" }}
            >
              <span className="absolute inset-0 shimmer-gold opacity-30" />
              <span className="relative">Apply to VERVE</span>
              <ArrowRight className="relative w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
