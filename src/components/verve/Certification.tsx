import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { Award, Gem } from "lucide-react";

const TIERS = [
  { name: "White", duration: "6 Months", note: "Active Contribution", gradient: "from-[oklch(0.95_0.005_250)] to-[oklch(0.78_0.01_250)]", text: "text-navy-deep", icon: Award },
  { name: "Silver", duration: "1 Year", note: "Active Contribution", gradient: "from-[oklch(0.92_0.01_260)] to-[oklch(0.72_0.02_260)]", text: "text-navy-deep", icon: Award },
  { name: "Gold", duration: "1.5 Years", note: "Active Contribution", gradient: "from-[oklch(0.92_0.10_92)] to-[oklch(0.70_0.13_75)]", text: "text-navy-deep", icon: Award },
  { name: "Diamond", duration: "2 Years", note: "+ Medal", gradient: "from-[oklch(0.92_0.06_220)] to-[oklch(0.65_0.12_240)]", text: "text-white", icon: Gem },
];

export function Certification() {
  return (
    <section id="certification" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Recognition"
          title={<>Certification & <span className="text-gradient-gold">Recognition</span></>}
          subtitle="Earn formal recognition for consistency, professionalism, and the quality of your contribution."
        />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIERS.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl glass overflow-hidden"
              >
                <div className={`h-32 bg-gradient-to-br ${t.gradient} relative flex items-center justify-center`}>
                  <div className="absolute inset-0 shimmer-gold opacity-40" />
                  <Icon className={`w-12 h-12 ${t.text} relative z-10`} strokeWidth={1.5} />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-[0.28em] text-gold mb-2">Tier {i + 1}</div>
                  <h3 className="font-display text-2xl font-semibold">{t.name} Certificate</h3>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <div className="font-semibold text-foreground">{t.duration}</div>
                    <div>{t.note}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-10 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          Certificates are awarded based on active participation, professionalism, consistency, contribution quality, and commitment.
        </p>
      </div>
    </section>
  );
}
