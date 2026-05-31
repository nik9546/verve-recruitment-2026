import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { DEPARTMENTS } from "@/lib/verve/departments";

export function Departments() {
  return (
    <section id="departments" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Departments"
          title={<>Departments & <span className="text-gradient-gold">Opportunities</span></>}
          subtitle="Twelve specialized domains. Pick the ones where you want to create impact."
        />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEPARTMENTS.map((d, i) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 6) * 0.05 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl glass p-6 sm:p-7 overflow-hidden transition-colors hover:border-[color:var(--glass-border-gold)]"
              >
                <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gold/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-2xl">{d.emoji}</span>
                </div>
                <h3 className="font-display text-lg font-semibold leading-snug">{d.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.short}</p>
                <div className="mt-5 pt-4 border-t border-[color:var(--glass-border)] flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  <span>{d.category}</span>
                  <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
