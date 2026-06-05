import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getPublicRecruitmentSettings, updateRecruitmentSettings } from "@/lib/verve/recruitment.functions";
import { changeAdminPassword } from "@/lib/verve/admin.functions";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

const STATES = [
  { v: "open", l: "Applications Open" },
  { v: "closed", l: "Applications Closed" },
  { v: "interview", l: "Interview Phase" },
  { v: "results", l: "Results Published" },
] as const;

function toLocal(s?: string | null) {
  if (!s) return "";
  const d = new Date(s);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocal(s: string) {
  if (!s) return null;
  return new Date(s).toISOString();
}

function SettingsPage() {
  const get = useServerFn(getPublicRecruitmentSettings);
  const update = useServerFn(updateRecruitmentSettings);
  const qc = useQueryClient();

  const q = useQuery({ queryKey: ["recruitment-settings"], queryFn: () => get() });

  const [form, setForm] = useState({
    cycle_name: "",
    opens_at: "",
    closes_at: "",
    interview_date: "",
    results_date: "",
    state: "open" as (typeof STATES)[number]["v"],
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (q.data) {
      setForm({
        cycle_name: q.data.cycle_name,
        opens_at: toLocal(q.data.opens_at),
        closes_at: toLocal(q.data.closes_at),
        interview_date: toLocal(q.data.interview_date),
        results_date: toLocal(q.data.results_date),
        state: q.data.state,
      });
    }
  }, [q.data]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    try {
      await update({
        data: {
          cycle_name: form.cycle_name,
          opens_at: fromLocal(form.opens_at) || new Date().toISOString(),
          closes_at: fromLocal(form.closes_at) || new Date().toISOString(),
          interview_date: fromLocal(form.interview_date),
          results_date: fromLocal(form.results_date),
          state: form.state,
        },
      });
      setMsg("Saved.");
      qc.invalidateQueries({ queryKey: ["recruitment-settings"] });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">Recruitment Settings</h1>
        <p className="mt-2 text-muted-foreground text-sm">Configure the active recruitment window. Changes apply instantly to the public site.</p>
      </div>

      <form onSubmit={onSave} className="glass-strong rounded-2xl p-6 sm:p-8 space-y-5">
        <F label="Recruitment Cycle Name">
          <input value={form.cycle_name} onChange={(e) => setForm({ ...form, cycle_name: e.target.value })} required className={inp} />
        </F>
        <div className="grid sm:grid-cols-2 gap-5">
          <F label="Application Opening Date">
            <input type="datetime-local" value={form.opens_at} onChange={(e) => setForm({ ...form, opens_at: e.target.value })} required className={inp} />
          </F>
          <F label="Application Closing Date">
            <input type="datetime-local" value={form.closes_at} onChange={(e) => setForm({ ...form, closes_at: e.target.value })} required className={inp} />
          </F>
          <F label="Interview Date (optional)">
            <input type="datetime-local" value={form.interview_date} onChange={(e) => setForm({ ...form, interview_date: e.target.value })} className={inp} />
          </F>
          <F label="Result Announcement Date (optional)">
            <input type="datetime-local" value={form.results_date} onChange={(e) => setForm({ ...form, results_date: e.target.value })} className={inp} />
          </F>
        </div>
        <F label="Recruitment Status">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STATES.map((s) => (
              <button
                key={s.v}
                type="button"
                onClick={() => setForm({ ...form, state: s.v })}
                className={`px-3 py-2.5 rounded-lg text-sm border ${
                  form.state === s.v
                    ? "glass-gold border-gold text-gold"
                    : "glass border-[color:var(--glass-border)] hover:border-[color:var(--glass-border-gold)]"
                }`}
              >
                {s.l}
              </button>
            ))}
          </div>
        </F>
        {msg && <p className="text-sm text-gold">{msg}</p>}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-navy-deep font-semibold shadow-gold disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>

      <ChangePasswordCard />
    </div>
  );
}

function ChangePasswordCard() {
  const change = useServerFn(changeAdminPassword);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) {
      setMsg({ type: "err", text: "New password must be at least 8 characters." });
      return;
    }
    if (next !== confirm) {
      setMsg({ type: "err", text: "New password and confirmation do not match." });
      return;
    }
    setSaving(true);
    try {
      const res = await change({ data: { currentPassword: current, newPassword: next } });
      if (res.ok) {
        setMsg({ type: "ok", text: "Password updated successfully." });
        setCurrent(""); setNext(""); setConfirm("");
      } else {
        setMsg({ type: "err", text: res.error });
      }
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="glass-strong rounded-2xl p-6 sm:p-8 space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold">Change Admin Password</h2>
        <p className="mt-1 text-muted-foreground text-sm">Update the password used to sign in at /admin/login.</p>
      </div>
      <PwField label="Current Password" value={current} onChange={setCurrent} visible={show.current} onToggle={() => setShow((s) => ({ ...s, current: !s.current }))} autoComplete="current-password" />
      <PwField label="New Password" value={next} onChange={setNext} visible={show.next} onToggle={() => setShow((s) => ({ ...s, next: !s.next }))} autoComplete="new-password" />
      <PwField label="Confirm New Password" value={confirm} onChange={setConfirm} visible={show.confirm} onToggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))} autoComplete="new-password" />
      {msg && (
        <p className={`text-sm ${msg.type === "ok" ? "text-gold" : "text-red-400"}`}>{msg.text}</p>
      )}
      <button
        type="submit"
        disabled={saving || !current || !next || !confirm}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-navy-deep font-semibold shadow-gold disabled:opacity-50"
      >
        {saving ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}

function PwField({
  label, value, onChange, visible, onToggle, autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
  onToggle: () => void;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="block mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          className={`${inp} pr-11`}
        />
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-11 text-muted-foreground hover:text-gold transition-colors"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </label>
  );
}

const inp = "w-full px-3 py-2.5 rounded-lg glass border border-[color:var(--glass-border)] focus:border-gold outline-none text-sm";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
