import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useRecruitmentSettings, effectiveState } from "@/lib/verve/use-recruitment";

function diff(target: number) {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { d, h, m, s };
}

const pad = (n: number) => String(n).padStart(2, "0");

const STATE_COPY: Record<string, { eyebrow: string; title: React.ReactNode; body?: string }> = {
  open: {
    eyebrow: "Recruitment Window Open",
    title: <>Apply before the <span className="text-gradient-gold">window closes.</span></>,
  },
  closed: {
    eyebrow: "Applications Closed",
    title: <span className="text-gradient-gold">Applications Closed</span>,
    body: "Applications for VERVE Recruitment 2026 have officially closed. Thank you for your interest in becoming a part of VERVE.",
  },
  interview: {
    eyebrow: "Interview Phase",
    title: <span className="text-gradient-gold">Interview Phase Underway</span>,
    body: "Application submissions are now closed. The interview process is currently underway.",
  },
  results: {
    eyebrow: "Results Phase",
    title: <span className="text-gradient-gold">Results Published</span>,
    body: "Recruitment process completed. Thank you to all applicants who participated.",
  },
};

export function Countdown() {
  const { data: settings } = useRecruitmentSettings();
  const state = effectiveState(settings ?? undefined);
  const target = settings ? new Date(settings.closes_at).getTime() : 0;
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState<ReturnType<typeof diff>>(null);

  useEffect(() => {
    setMounted(true);
    if (!target) return;
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const copy = STATE_COPY[state];
  const showCountdown = state === "open" && target > 0;

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12 text-center"
        >
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60%] h-48 bg-gold/15 blur-3xl" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-[11px] uppercase tracking-[0.28em] text-gold mb-5">
              <Clock className="w-3.5 h-3.5" /> {copy.eyebrow}
            </div>
            <h3 className="font-display text-3xl sm:text-5xl font-semibold">{copy.title}</h3>
            {copy.body && (
              <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                {copy.body}
              </p>
            )}

            {showCountdown && (
              <div className="mt-10 grid grid-cols-4 gap-3 sm:gap-5 max-w-3xl mx-auto">
                {[
                  { v: t?.d, l: "Days" },
                  { v: t?.h, l: "Hours" },
                  { v: t?.m, l: "Minutes" },
                  { v: t?.s, l: "Seconds" },
                ].map((it) => (
                  <div key={it.l} className="glass rounded-2xl py-5 sm:py-7 px-2 border border-[color:var(--glass-border-gold)]">
                    <div className="font-display text-4xl sm:text-6xl font-semibold text-gradient-gold tabular-nums">
                      {mounted && t ? pad(it.v as number) : "--"}
                    </div>
                    <div className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      {it.l}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
