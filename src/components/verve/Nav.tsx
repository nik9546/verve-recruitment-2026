import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#why", label: "Why Join" },
  { href: "#departments", label: "Departments" },
  { href: "#leadership", label: "Leadership" },
  { href: "#certification", label: "Certificates" },
  { href: "#process", label: "Process" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div
            className={`flex items-center justify-between gap-4 rounded-2xl px-4 sm:px-5 py-3 transition-all ${
              scrolled ? "glass-strong" : "glass"
            }`}
          >
            <a href="#top" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                <span className="font-display text-navy-deep font-bold text-lg">V</span>
              </div>
              <div className="leading-tight">
                <div className="font-display font-semibold tracking-tight text-base">VERVE</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground hidden sm:block">
                  Recruitment 2026
                </div>
              </div>
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-colors hover:bg-[color:var(--glass-bg)]"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#apply"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-gold text-navy-deep font-semibold text-sm shadow-gold hover:shadow-gold-strong transition-all hover:scale-[1.03]"
              >
                Apply Now
              </a>
              <button
                onClick={() => setOpen((v) => !v)}
                className="lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {open ? (
                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X className="w-5 h-5 text-gold" />
                    </motion.div>
                  ) : (
                    <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-navy-deep/85 backdrop-blur-xl" />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative pt-28 px-6 flex flex-col gap-2"
            >
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                  className="font-display text-3xl tracking-tight py-3 border-b border-[color:var(--glass-border)]"
                >
                  {l.label}
                </motion.a>
              ))}
              <a
                href="#apply"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-gradient-gold text-navy-deep font-semibold shadow-gold"
              >
                Apply Now →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
