import { SectionHeading } from "./SectionHeading";
import { GlassCard } from "./GlassCard";
import { ShieldCheck } from "lucide-react";

const POLICIES = [
  "Maintain professionalism",
  "Respect deadlines",
  "Participate actively in projects and events",
  "Collaborate positively with teammates",
  "Represent the institution responsibly",
  "Maintain discipline in online and offline activities",
  "Contribute consistently toward VERVE initiatives",
];

export function Policies() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Membership"
          title={<>Membership <span className="text-gradient-gold">Expectations</span></>}
          subtitle="Joining VERVE is a commitment to standards. Here's what every member upholds."
        />
        <div className="mt-16 grid sm:grid-cols-2 gap-5">
          {POLICIES.map((p, i) => (
            <GlassCard key={p} transition={{ duration: 0.55, delay: i * 0.05 }}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl glass-gold flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-1">Policy {String(i + 1).padStart(2, "0")}</div>
                  <p className="text-base font-medium">{p}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
