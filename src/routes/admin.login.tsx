import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { Shield, Loader2 } from "lucide-react";
import { adminLogin } from "@/lib/verve/admin.functions";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useServerFn(adminLogin);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            className="w-full px-4 py-3 rounded-xl glass border border-[color:var(--glass-border)] focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/30 outline-none"
            placeholder="Enter password"
          />
        </div>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="mt-7 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-navy-deep font-semibold shadow-gold disabled:opacity-50 hover:shadow-gold-strong transition-all"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign in"}
        </button>
      </form>
    </div>
  );
}
