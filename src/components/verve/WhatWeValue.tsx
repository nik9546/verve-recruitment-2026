import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import {
  Sparkles,
  Repeat,
  Shield,
  Rocket,
  Users,
  Crown,
  Smile,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

const VALUES: { label: string; icon: LucideIcon; desc: string }[] = [
  { label: "Creativity", icon: Sparkles, desc: "Original thinking that breaks the scroll." },
  { label: "Consistency", icon: Repeat, desc: "Showing up — week after week." },
  { label: "Responsibility", icon: Shield, desc: "Owning outcomes, not just tasks." },
  { label: "Initiative", icon: Rocket, desc: "Acting before being asked." },
  { label: "Teamwork", icon: Users, desc: "Winning together, lifting others." },
  { label: "Leadership Potential", icon: Crown, desc: "Inspiring people around you." },
  { label: "Positive Attitude", icon: Smile, desc: "Energy that's contagious." },
  { label: "Willingness to Learn", icon: GraduationCap, desc: "Curiosity over ego." },
];

export function WhatWeValue() {
  return (
    <section id="values" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="What We Value"
          title={<>What We <span className="text-gradient-gold">Value</span></>}
          subtitle="At VERVE, we do not look only for experience. We value students who are willing to learn, contribute, collaborate, and grow."
        />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl glass p-5 overflow-hidden hover:border-[color:var(--glass-border-gold)] transition-colors"
              >
                <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gold/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-11 h-11 rounded-xl glass-gold flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <div className="font-display text-lg font-semibold">{v.label}</div>
                <div className="mt-1 text-sm text-muted-foreground">{v.desc}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
