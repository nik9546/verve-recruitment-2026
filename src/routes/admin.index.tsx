import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Users, Clock, Star, CheckCircle2, XCircle, CalendarClock } from "lucide-react";
import { getApplicationStats } from "@/lib/verve/applications.functions";
import { getPublicRecruitmentSettings } from "@/lib/verve/recruitment.functions";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const STATUS_CARDS = [
  { key: "total", label: "Total Applications", icon: Users },
  { key: "pending", label: "Pending", icon: Clock },
  { key: "shortlisted", label: "Shortlisted", icon: Star },
  { key: "interview_scheduled", label: "Interview Scheduled", icon: CalendarClock },
  { key: "selected", label: "Selected", icon: CheckCircle2 },
  { key: "rejected", label: "Rejected", icon: XCircle },
] as const;

const STATE_LABEL: Record<string, string> = {
  open: "Applications Open",
  closed: "Applications Closed",
  interview: "Interview Phase",
  results: "Results Published",
};

function Dashboard() {
  const stats = useServerFn(getApplicationStats);
  const settings = useServerFn(getPublicRecruitmentSettings);

  const statsQ = useQuery({ queryKey: ["admin", "stats"], queryFn: () => stats() });
  const cfgQ = useQuery({ queryKey: ["recruitment-settings"], queryFn: () => settings() });

  const daysRemaining = cfgQ.data
    ? Math.max(0, Math.ceil((new Date(cfgQ.data.closes_at).getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Overview of the current recruitment cycle.</p>
      </div>

      {/* Recruitment overview */}
      <div className="glass-strong rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline gap-3 justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-gold">Current Cycle</div>
            <div className="font-display text-2xl font-semibold mt-1">{cfgQ.data?.cycle_name ?? "—"}</div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full glass-gold text-xs uppercase tracking-wider text-gold">
            {cfgQ.data ? STATE_LABEL[cfgQ.data.state] : "—"}
          </span>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <Info label="Opens" value={fmtDate(cfgQ.data?.opens_at)} />
          <Info label="Closes" value={fmtDate(cfgQ.data?.closes_at)} />
          <Info label="Interview" value={fmtDate(cfgQ.data?.interview_date)} />
          <Info label="Results" value={fmtDate(cfgQ.data?.results_date)} />
        </div>
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div>
            <div className="text-muted-foreground text-xs uppercase tracking-wider">Days Remaining</div>
            <div className="font-display text-3xl font-semibold text-gradient-gold">{daysRemaining}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs uppercase tracking-wider">Total Applications</div>
            <div className="font-display text-3xl font-semibold">{statsQ.data?.total ?? 0}</div>
          </div>
          <Link to="/admin/settings" className="ml-auto text-sm text-gold hover:underline">Edit recruitment →</Link>
        </div>
      </div>

      {/* Status counters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATUS_CARDS.map((c) => {
          const value =
            c.key === "total"
              ? statsQ.data?.total ?? 0
              : (statsQ.data?.counts as Record<string, number> | undefined)?.[c.key] ?? 0;
          const Icon = c.icon;
          return (
            <div key={c.key} className="glass rounded-2xl p-5">
              <Icon className="w-5 h-5 text-gold" />
              <div className="mt-3 font-display text-3xl font-semibold">{value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/admin/applications" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-gold text-navy-deep font-semibold shadow-gold">
          View All Applicants
        </Link>
        <Link to="/admin/analytics" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass border border-[color:var(--glass-border-gold)]">
          Analytics
        </Link>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground text-xs uppercase tracking-wider">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function fmtDate(s?: string | null) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}
