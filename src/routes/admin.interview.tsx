import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import {
  getPublicRecruitmentSettings,
  updateInterviewInfo,
} from "@/lib/verve/recruitment.functions";

export const Route = createFileRoute("/admin/interview")({
  component: InterviewAdminPage,
});

function toLocalDate(s?: string | null) {
  if (!s) return "";
  const d = new Date(s);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function InterviewAdminPage() {
  const get = useServerFn(getPublicRecruitmentSettings);
  const save = useServerFn(updateInterviewInfo);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["recruitment-settings"], queryFn: () => get() });

  const [form, setForm] = useState({
    interview_date: "",
    interview_time: "",
    interview_venue: "",
    interview_instructions: "",
    interview_published: false,
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (q.data) {
      setForm({
        interview_date: toLocalDate(q.data.interview_date),
        interview_time: q.data.interview_time ?? "",
        interview_venue: q.data.interview_venue ?? "",
        interview_instructions: q.data.interview_instructions ?? "",
        interview_published: Boolean(q.data.interview_published),
      });
    }
  }, [q.data]);

  const submit = async (publish?: boolean) => {
    setSaving(true);
    setMsg(null);
    try {
      await save({
        data: {
          interview_date: form.interview_date
            ? new Date(form.interview_date).toISOString()
            : null,
          interview_time: form.interview_time || null,
          interview_venue: form.interview_venue || null,
          interview_instructions: form.interview_instructions || null,
          interview_published:
            typeof publish === "boolean" ? publish : form.interview_published,
        },
      });
      if (typeof publish === "boolean") {
        setForm((f) => ({ ...f, interview_published: publish }));
      }
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
        <h1 className="font-display text-3xl sm:text-4xl font-semibold flex items-center gap-3">
          <CalendarClock className="w-7 h-7 text-gold" /> Interview Management
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Configure interview details. Toggle publish to control the public Interview Information section.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="glass-strong rounded-2xl p-6 sm:p-8 space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <F label="Interview Date">
            <input
              type="date"
              value={form.interview_date}
              onChange={(e) => setForm({ ...form, interview_date: e.target.value })}
              className={inp}
            />
          </F>
          <F label="Reporting Time">
            <input
              type="text"
              placeholder="e.g. 10:00 AM"
              value={form.interview_time}
              onChange={(e) => setForm({ ...form, interview_time: e.target.value })}
              className={inp}
            />
          </F>
        </div>
        <F label="Venue">
          <input
            type="text"
            placeholder="e.g. Seminar Hall, St. Xavier's College"
            value={form.interview_venue}
            onChange={(e) => setForm({ ...form, interview_venue: e.target.value })}
            className={inp}
          />
        </F>
        <F label="Instructions">
          <textarea
            rows={6}
            value={form.interview_instructions}
            onChange={(e) => setForm({ ...form, interview_instructions: e.target.value })}
            placeholder="Any additional instructions for applicants…"
            className={`${inp} resize-y min-h-[140px]`}
          />
        </F>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[color:var(--glass-border)]">
          <div className="text-sm">
            Status:{" "}
            <span className={form.interview_published ? "text-gold font-semibold" : "text-muted-foreground"}>
              {form.interview_published ? "Published" : "Unpublished"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => submit(false)}
              disabled={saving}
              className="px-4 py-2.5 rounded-lg glass border border-[color:var(--glass-border)] text-sm hover:border-[color:var(--glass-border-gold)] disabled:opacity-50"
            >
              Unpublish
            </button>
            <button
              type="button"
              onClick={() => submit(true)}
              disabled={saving}
              className="px-4 py-2.5 rounded-lg bg-gradient-gold text-navy-deep text-sm font-semibold shadow-gold disabled:opacity-50"
            >
              Publish
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2.5 rounded-lg glass-gold border border-[color:var(--glass-border-gold)] text-gold text-sm font-semibold disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
        {msg && <p className="text-sm text-gold">{msg}</p>}
      </form>
    </div>
  );
}

const inp =
  "w-full px-3 py-2.5 rounded-lg glass border border-[color:var(--glass-border)] focus:border-gold outline-none text-sm";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
