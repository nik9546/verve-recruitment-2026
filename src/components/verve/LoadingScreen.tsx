import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1800);
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

          <div className="relative text-center px-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-20 h-20 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold-strong mb-7"
              style={{ filter: "drop-shadow(0 0 40px oklch(0.82 0.14 88 / 0.5))" }}
            >
              <span className="font-display text-navy-deep font-bold text-3xl">V</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="font-display text-5xl sm:text-6xl font-semibold tracking-tight"
            >
              VERVE
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-2 text-base sm:text-lg text-gradient-gold font-medium"
            >
              Recruitment Portal 2026
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-6 text-xs sm:text-sm uppercase tracking-[0.4em] text-muted-foreground"
            >
              Create. Innovate. Lead. Inspire.
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="mt-10 mx-auto h-px max-w-xs bg-gradient-to-r from-transparent via-gold to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
