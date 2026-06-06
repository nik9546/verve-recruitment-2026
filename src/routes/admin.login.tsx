import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Shield, Loader2, Eye, EyeOff, X, KeyRound, CheckCircle2 } from "lucide-react";
import {
  adminLogin,
  requestPasswordReset,
  resetPasswordWithOtp,
  verifyResetOtp,
} from "@/lib/verve/admin.functions";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useServerFn(adminLogin);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ data: { password } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      navigate({ to: "/admin" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md glass-strong rounded-3xl p-8 sm:p-10 text-center">
        <div className="mx-auto mb-5 w-14 h-14 rounded-2xl glass-gold flex items-center justify-center">
          <Shield className="w-6 h-6 text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">VERVE Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">Authorized access only.</p>
        <div className="mt-8 text-left">
          <label className="block mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">Admin Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full px-4 py-3 pr-11 rounded-xl glass border border-[color:var(--glass-border)] focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/30 outline-none"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] rounded-md p-0.5"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        {info && <p className="mt-4 text-sm text-gold">{info}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="mt-7 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-navy-deep font-semibold shadow-gold disabled:opacity-50 hover:shadow-gold-strong transition-all"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign in"}
        </button>
        <button
          type="button"
          onClick={() => { setForgotOpen(true); setError(null); }}
          className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors"
        >
          Forgot password?
        </button>
      </form>

      {forgotOpen && (
        <ForgotPasswordModal
          onClose={() => setForgotOpen(false)}
          onSuccess={(msg) => { setForgotOpen(false); setInfo(msg); setPassword(""); }}
        />
      )}
    </div>
  );
}

type Step = "request" | "otp" | "reset" | "done";

function ForgotPasswordModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (msg: string) => void }) {
  const request = useServerFn(requestPasswordReset);
  const verify = useServerFn(verifyResetOtp);
  const reset = useServerFn(resetPasswordWithOtp);

  const [step, setStep] = useState<Step>("request");
  const [serverOtp, setServerOtp] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [otpInput, setOtpInput] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tick.current = setInterval(() => setNow(Date.now()), 1000);
    return () => { if (tick.current) clearInterval(tick.current); };
  }, []);

  const remainingMs = expiresAt ? Math.max(0, expiresAt - now) : 0;
  const remaining = useMemo(() => {
    const s = Math.floor(remainingMs / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }, [remainingMs]);
  const expired = expiresAt !== null && remainingMs <= 0;

  const generate = async () => {
    setBusy(true); setError(null);
    try {
      const res = await request();
      if (!res.ok) { setError("Could not start reset."); return; }
      setServerOtp(res.otp);
      setExpiresAt(res.expiresAt);
      setOtp(res.otp);
      setStep("otp");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start reset.");
    } finally { setBusy(false); }
  };

  const submitOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (expired) { setError("Code expired. Request a new one."); return; }
    setBusy(true); setError(null);
    try {
      const res = await verify({ data: { otp: otpInput.trim() } });
      if (!res.ok) { setError(res.error); return; }
      setStep("reset");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally { setBusy(false); }
  };

  const submitReset = async (e: FormEvent) => {
    e.preventDefault();
    if (newPwd.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPwd !== confirmPwd) { setError("Passwords do not match."); return; }
    setBusy(true); setError(null);
    try {
      const res = await reset({ data: { otp: otpInput.trim(), newPassword: newPwd } });
      if (!res.ok) { setError(res.error); return; }
      setStep("done");
      setTimeout(() => onSuccess("Password updated. Sign in with your new password."), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reset failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md glass-strong rounded-3xl p-6 sm:p-8">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-2xl glass-gold flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-gold" />
          </div>
          <h2 className="font-display text-xl font-semibold">Reset Admin Password</h2>
          <p className="mt-1 text-xs text-muted-foreground">Recovery panel — for the authorized admin only.</p>
        </div>

        {step === "request" && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Generate a one-time 6-digit code. It will be displayed below and remain valid for 5 minutes.
            </p>
            <button
              onClick={generate}
              disabled={busy}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-navy-deep font-semibold shadow-gold disabled:opacity-50"
            >
              {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : "Generate code"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <form onSubmit={submitOtp} className="mt-6 space-y-4">
            <div className="rounded-xl glass border border-[color:var(--glass-border-gold)] p-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Your code</p>
              <p className="mt-1 font-mono text-3xl tracking-[0.4em] text-gold select-all">{serverOtp}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Expires in <span className={expired ? "text-destructive" : "text-foreground"}>{remaining}</span>
              </p>
            </div>
            <div className="text-left">
              <label className="block mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">Enter code</label>
              <input
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 rounded-xl glass border border-[color:var(--glass-border)] focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/30 outline-none font-mono tracking-[0.3em] text-center text-lg"
              />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={generate}
                disabled={busy}
                className="flex-1 px-4 py-2.5 rounded-xl glass border border-[color:var(--glass-border)] text-sm hover:border-[color:var(--glass-border-gold)] disabled:opacity-50"
              >
                Regenerate
              </button>
              <button
                type="submit"
                disabled={busy || otpInput.length !== 6 || expired}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-gold text-navy-deep font-semibold shadow-gold disabled:opacity-50"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
              </button>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={submitReset} className="mt-6 space-y-4 text-left">
            <PasswordField
              label="New password"
              value={newPwd}
              onChange={setNewPwd}
              show={showNew}
              onToggle={() => setShowNew((s) => !s)}
              placeholder="At least 8 characters"
            />
            <PasswordField
              label="Confirm password"
              value={confirmPwd}
              onChange={setConfirmPwd}
              show={showConfirm}
              onToggle={() => setShowConfirm((s) => !s)}
              placeholder="Re-enter new password"
            />
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <button
              type="submit"
              disabled={busy || !newPwd || !confirmPwd}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-navy-deep font-semibold shadow-gold disabled:opacity-50"
            >
              {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Update password"}
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="mt-6 text-center">
            <CheckCircle2 className="mx-auto w-10 h-10 text-gold" />
            <p className="mt-3 font-medium">Password updated</p>
            <p className="mt-1 text-sm text-muted-foreground">You can now sign in with your new password.</p>
          </div>
        )}

        {step !== "done" && (
          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function PasswordField({
  label, value, onChange, show, onToggle, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-11 rounded-xl glass border border-[color:var(--glass-border)] focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/30 outline-none"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-md p-0.5"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
