import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SuccessModal({ open, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
        >
          <div className="absolute inset-0 bg-navy-deep/80 backdrop-blur-xl" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative glass-strong rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full glass flex items-center justify-center hover:border-gold/60 transition-colors" aria-label="Close">
              <X className="w-4 h-4" />
            </button>

            <div className="absolute inset-x-0 -top-24 h-48 bg-gold/15 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 shimmer-gold opacity-15 pointer-events-none" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative mx-auto w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold-strong"
            >
              <CheckCircle2 className="w-10 h-10 text-navy-deep" strokeWidth={2.5} />
              <div className="absolute inset-0 rounded-full pulse-gold" />
            </motion.div>

            <h3 className="mt-7 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Welcome to <span className="text-gradient-gold">VERVE</span>.
            </h3>
            <p className="mt-4 text-base text-muted-foreground">
              Thank you for applying to VERVE. Your application has been successfully submitted.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Shortlisted candidates will be contacted for the interview process.
            </p>

            <button
              onClick={onClose}
              className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-navy-deep font-semibold shadow-gold hover:shadow-gold-strong transition-all"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
