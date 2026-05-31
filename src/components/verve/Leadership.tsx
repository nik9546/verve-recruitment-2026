import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { Crown } from "lucide-react";

const STAGES = [
  { name: "Member", desc: "Onboarding & contributing to live projects." },
  { name: "Core Contributor", desc: "Owning recurring deliverables and quality." },
  { name: "Team Coordinator", desc: "Coordinating squads across departments." },
  { name: "Department Head", desc: "Leading an entire department's vision." },
  { name: "Executive Leadership", desc: "Setting direction for all of VERVE." },
];

const CRITERIA = ["Performance", "Discipline", "Attendance", "Creativity", "Initiative", "Contribution", "Teamwork"];

export function Leadership() {
  return (
    <section id="leadership" className="relative py-28 sm:py-36 bg-gradient-navy">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Leadership"
          title={<>Leadership Opportunities at <span className="text-gradient-gold">VERVE</span></>}
          subtitle="Recognition follows dedication, creativity, initiative, teamwork, and consistent commitment."
        />

        <div className="mt-16 relative">
          {/* spine */}
          <div className="absolute left-5 sm:left-1/2 sm:-translate-x-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />

          <div className="space-y-7">
            {STAGES.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className={`relative flex items-start gap-5 sm:gap-0 ${
                  i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                <div className="sm:w-1/2 sm:px-8">
                  <div className="glass rounded-2xl p-5 sm:p-6 ml-12 sm:ml-0">
                    <div className="flex items-center gap-2 mb-1 text-xs uppercase tracking-[0.25em] text-gold">
                      Stage {i + 1}
                      {i === STAGES.length - 1 && <Crown className="w-3.5 h-3.5" />}
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-semibold">{s.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
                {/* node */}
                <div className="absolute left-5 sm:left-1/2 sm:-translate-x-1/2 top-6 w-3 h-3 rounded-full bg-gold shadow-gold pulse-gold" />
                <div className="hidden sm:block sm:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 glass rounded-2xl p-6 sm:p-8 text-center"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Awarded On</div>
          <div className="flex flex-wrap justify-center gap-2">
            {CRITERIA.map((c) => (
              <span key={c} className="px-4 py-2 rounded-full glass-gold text-sm">
                {c}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
