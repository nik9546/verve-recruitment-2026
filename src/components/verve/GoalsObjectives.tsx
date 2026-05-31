import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const GOALS = [
  "Strengthen the college's digital presence",
  "Ensure timely and authentic communication",
  "Promote institutional achievements",
  "Highlight events and student accomplishments",
  "Encourage leadership, creativity, and teamwork",
  "Build a strong professional digital identity",
];

const OBJECTIVES = [
  "Managing official social media platforms",
  "Creating promotional content",
  "Event photography and videography",
  "Content writing and storytelling",
  "Research and documentation",
  "Event promotion and communication",
  "Maintaining institutional branding",
];

export function GoalsObjectives() {
  return (
    <section className="relative py-28 sm:py-36 bg-gradient-navy">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10">
        <div className="glass rounded-3xl p-8 sm:p-10">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Section 07</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-8">Goals of <span className="text-gradient-gold">VERVE</span></h2>
          <ul className="space-y-4">
            {GOALS.map((g, i) => (
              <motion.li
                key={g}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-navy-deep" strokeWidth={3} />
                </div>
                <span className="text-base text-muted-foreground">{g}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-3xl p-8 sm:p-10">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Section 08</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-8">Objectives of <span className="text-gradient-gold">VERVE</span></h2>
          <ul className="space-y-4">
            {OBJECTIVES.map((o, i) => (
              <motion.li
                key={o}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full glass-gold flex items-center justify-center text-gold text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span className="text-base text-muted-foreground">{o}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
