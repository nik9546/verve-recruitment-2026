import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import verveLogo from "@/assets/verve-logo.png";
import collegeCrest from "@/assets/college-crest.png";

export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-hero overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-gold/15 blur-[120px]" />
          </div>

          <div className="relative text-center px-6 max-w-xl">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mb-7"
              style={{ filter: "drop-shadow(0 0 40px oklch(0.82 0.14 88 / 0.45))" }}
            >
              <img
                src={verveLogo}
                alt="VERVE"
                className="h-14 sm:h-16 w-auto mx-auto select-none"
                draggable={false}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-base sm:text-lg text-gradient-gold font-medium"
            >
              Recruitment Portal 2026
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-5 tagline-motto text-sm sm:text-base"
            >
              Creating Impact Through Digital Excellence
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="mt-8 mx-auto h-px max-w-xs bg-gradient-to-r from-transparent via-gold to-transparent"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-8 flex flex-col items-center gap-3"
            >
              <img
                src={collegeCrest}
                alt="St. Xavier's College, Ranchi"
                className="h-14 w-14 object-contain rounded-full bg-white/95 p-1.5 ring-1 ring-[color:var(--glass-border-gold)]"
                style={{ filter: "drop-shadow(0 0 18px oklch(0.82 0.14 88 / 0.35))" }}
                draggable={false}
              />
              <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                The Official Voice of
                <br />
                <span className="text-foreground/90 tracking-[0.18em]">
                  St. Xavier's College (Autonomous), Ranchi
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
