import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { DEPARTMENTS, deriveInsight } from "@/lib/verve/departments";
import { supabase } from "@/integrations/supabase/client";

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const AVAILABILITY = ["2–4 Hours", "4–6 Hours", "6–8 Hours", "8+ Hours"];

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(120),
  roll_number: z.string().trim().min(2, "Enter your roll number").max(40),
  course: z.string().trim().min(2, "Enter your department / course").max(120),
  semester: z.string().min(1, "Select your semester"),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  departments: z.array(z.string()).length(3, "Select exactly 3 departments"),
  motivation: z.string().trim().min(20, "Tell us a bit more (min 20 chars)").max(2000),
  availability: z.string().min(1, "Pick your availability"),
  commitment: z.literal("yes", { message: "Active participation is required" }),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onSuccess: () => void;
}

export function ApplicationForm({ onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      roll_number: "",
      course: "",
      semester: "",
      phone: "",
      email: "",
      departments: [],
      motivation: "",
      availability: "",
    },
  });

  const selected = watch("departments") ?? [];
  const insight = useMemo(() => deriveInsight(selected), [selected]);

  const toggleDept = (id: string) => {
    const current = selected;
    if (current.includes(id)) {
      setValue("departments", current.filter((x) => x !== id), { shouldValidate: true });
    } else if (current.length < 3) {
      setValue("departments", [...current, id], { shouldValidate: true });
    }
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const payload = {
        full_name: values.full_name,
        roll_number: values.roll_number,
        course: values.course,
        semester: values.semester,
        phone: values.phone,
        email: values.email,
        departments: values.departments,
        motivation: values.motivation,
        availability: values.availability,
        commitment: values.commitment === "yes",
        insight: deriveInsight(values.departments),
      };
      const { error } = await supabase.from("verve_applications").insert(payload);
      if (error) throw error;

      // Confetti
      const burst = (x: number) =>
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { x, y: 0.35 },
          colors: ["#d9b25b", "#f4d77a", "#ffffff", "#1a3a7a"],
        });
      burst(0.25);
      setTimeout(() => burst(0.5), 150);
      setTimeout(() => burst(0.75), 300);

      onSuccess();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="apply" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Application"
          title={<>Apply to <span className="text-gradient-gold">VERVE</span></>}
          subtitle="Beginners and experienced students are equally welcome. Selection is based on intent, fit, and potential."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-14 space-y-10">
          {/* Personal */}
          <div className="glass-strong rounded-3xl p-6 sm:p-10">
            <SectionLabel index="01" label="Personal Details" />
            <div className="mt-6 grid sm:grid-cols-2 gap-5">
              <Field label="Full Name" error={errors.full_name?.message}>
                <input {...register("full_name")} className={inputCls} placeholder="Jane Doe" autoComplete="name" />
              </Field>
              <Field label="Roll Number" error={errors.roll_number?.message}>
                <input {...register("roll_number")} className={inputCls} placeholder="e.g. 21BCA001" />
              </Field>
              <Field label="Department / Course" error={errors.course?.message}>
                <input {...register("course")} className={inputCls} placeholder="e.g. B.A. English" />
              </Field>
              <Field label="Semester" error={errors.semester?.message}>
                <select {...register("semester")} className={inputCls}>
                  <option value="">Select semester</option>
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Phone Number" error={errors.phone?.message}>
                <input {...register("phone")} className={inputCls} placeholder="+91 ..." inputMode="tel" autoComplete="tel" />
              </Field>
              <Field label="Email Address" error={errors.email?.message}>
                <input {...register("email")} type="email" className={inputCls} placeholder="you@email.com" autoComplete="email" />
              </Field>
            </div>
          </div>

          {/* Departments */}
          <div className="glass-strong rounded-3xl p-6 sm:p-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <SectionLabel index="02" label="Select Exactly 3 Departments" />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Selected:</span>
                <span className={`font-display font-bold text-lg ${selected.length === 3 ? "text-gold" : ""}`}>
                  {selected.length} / 3
                </span>
              </div>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {DEPARTMENTS.map((d) => {
                const isSelected = selected.includes(d.id);
                const isDisabled = !isSelected && selected.length >= 3;
                const Icon = d.icon;
                return (
                  <motion.button
                    key={d.id}
                    type="button"
                    onClick={() => !isDisabled && toggleDept(d.id)}
                    whileHover={!isDisabled ? { y: -4, rotateX: 2, rotateY: -2 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    disabled={isDisabled}
                    className={`relative text-left p-5 rounded-2xl transition-all border ${
                      isSelected
                        ? "glass-gold border-[color:var(--gold)] shadow-gold-strong"
                        : isDisabled
                          ? "glass opacity-35 cursor-not-allowed border-transparent"
                          : "glass border-[color:var(--glass-border)] hover:border-[color:var(--glass-border-gold)]"
                    }`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId={`check-${d.id}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold"
                      >
                        <CheckCircle2 className="w-4 h-4 text-navy-deep" />
                      </motion.div>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-gradient-gold" : "glass"}`}>
                        <Icon className={`w-4 h-4 ${isSelected ? "text-navy-deep" : "text-gold"}`} />
                      </div>
                      <span className="text-xl">{d.emoji}</span>
                    </div>
                    <div className="font-display text-base font-semibold leading-tight">{d.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{d.short}</div>
                  </motion.button>
                );
              })}
            </div>
            {errors.departments && (
              <FieldError message={errors.departments.message as string} />
            )}

            <AnimatePresence>
              {insight && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 glass-gold rounded-2xl p-5 sm:p-6 flex items-start gap-4 overflow-hidden relative"
                >
                  <div className="absolute inset-0 shimmer-gold opacity-20 pointer-events-none" />
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                    <Sparkles className="w-5 h-5 text-navy-deep" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-1">Smart Insight</div>
                    <p className="text-sm sm:text-base text-foreground">{insight}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Motivation + meta */}
          <div className="glass-strong rounded-3xl p-6 sm:p-10 space-y-6">
            <SectionLabel index="03" label="Tell Us About You" />

            <Field label="Why do you want to join VERVE?" error={errors.motivation?.message}>
              <textarea
                {...register("motivation")}
                rows={5}
                className={`${inputCls} resize-y min-h-[140px]`}
                placeholder="Share your motivation, interests, and what you want to contribute…"
              />
            </Field>

            <Field label="How many hours can you contribute weekly?" error={errors.availability?.message}>
              <Controller
                control={control}
                name="availability"
                render={({ field }) => (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AVAILABILITY.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => field.onChange(opt)}
                        className={`px-3 py-3 rounded-xl text-sm font-medium transition-all border ${
                          field.value === opt
                            ? "glass-gold border-[color:var(--gold)] text-gold shadow-gold"
                            : "glass border-[color:var(--glass-border)] hover:border-[color:var(--glass-border-gold)]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              />
            </Field>

            <Field label="Are you willing to actively participate in meetings, events, and team activities?" error={errors.commitment?.message}>
              <Controller
                control={control}
                name="commitment"
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-2 max-w-xs">
                    {(["yes", "no"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => field.onChange(opt)}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all border ${
                          field.value === opt
                            ? opt === "yes"
                              ? "glass-gold border-[color:var(--gold)] text-gold shadow-gold"
                              : "glass border-destructive/60 text-destructive"
                            : "glass border-[color:var(--glass-border)] hover:border-[color:var(--glass-border-gold)]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              />
            </Field>
          </div>

          {serverError && (
            <div className="glass rounded-xl p-4 flex items-start gap-3 border border-destructive/40">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm text-destructive">{serverError}</div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              By submitting, you agree to uphold VERVE's membership standards.
            </p>
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-gold text-navy-deep font-semibold shadow-gold disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:shadow-gold-strong enabled:hover:scale-[1.03] transition-all w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                </>
              ) : (
                <>Submit Application →</>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl glass border border-[color:var(--glass-border)] focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/30 outline-none transition-all text-foreground placeholder:text-muted-foreground/70";

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center font-display font-bold text-navy-deep">
        {index}
      </div>
      <h3 className="font-display text-xl sm:text-2xl font-semibold">{label}</h3>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      {children}
      {error && <FieldError message={error} />}
    </label>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 flex items-center gap-1.5 text-xs text-destructive"
    >
      <AlertCircle className="w-3.5 h-3.5" />
      {message}
    </motion.div>
  );
}
