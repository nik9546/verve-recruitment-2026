import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { FileText, ScanSearch, MessagesSquare, CheckCircle2, Trophy, GraduationCap, type LucideIcon } from "lucide-react";

const STEPS: { title: string; desc: string; icon: LucideIcon }[] = [
  { title: "Application Submission", desc: "Share your details and pick 3 departments.", icon: FileText },
  { title: "Application Review", desc: "Our team reviews each application carefully.", icon: ScanSearch },
  { title: "Interview Round", desc: "Shortlisted candidates meet the panel.", icon: MessagesSquare },
  { title: "Selection Process", desc: "Final calibration across departments.", icon: CheckCircle2 },
  { title: "Final Results", desc: "Selected members are officially notified.", icon: Trophy },
  { title: "Orientation Session", desc: "Welcome aboard — meet your team & projects.", icon: GraduationCap },
];

export function Process() {
  return (
    <section id="process" className="relative py-28 sm:py-36 bg-gradient-navy">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Process"
          title={<>Recruitment <span className="text-gradient-gold">Process</span></>}
          subtitle="A simple, structured journey from application to onboarding."
        />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
                className="relative glass rounded-2xl p-6 sm:p-7 group hover:border-[color:var(--glass-border-gold)] transition-colors"
              >
                <div className="absolute -top-3 -right-3 w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold font-display font-bold text-navy-deep">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
