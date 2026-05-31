import { GlassCard } from "./GlassCard";
import { SectionHeading } from "./SectionHeading";
import { Check } from "lucide-react";

const BENEFITS = [
  "Build Confidence",
  "Develop Leadership Skills",
  "Gain Real Event Experience",
  "Work on Official College Projects",
  "Build a Professional Portfolio",
  "Network with Talented Students",
  "Learn Industry-Relevant Skills",
  "Gain Recognition & Certification",
  "Become Part of the College's Official Digital Identity",
];

export function WhyJoin() {
  return (
    <section id="why" className="relative py-28 sm:py-36 bg-gradient-navy">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Why Join"
          title={<>Why Join <span className="text-gradient-gold">VERVE</span>?</>}
          subtitle="Practical experience, real responsibility, and an aspirational platform to grow on every dimension that matters."
        />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) => (
            <GlassCard key={b} transition={{ duration: 0.55, delay: i * 0.04 }}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                  <Check className="w-5 h-5 text-navy-deep" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold leading-snug">{b}</h3>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
