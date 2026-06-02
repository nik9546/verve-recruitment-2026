import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getApplication, updateApplicationStatus } from "@/lib/verve/applications.functions";
import { DEPARTMENTS } from "@/lib/verve/departments";
import { StatusBadge, prettyStatus } from "./admin.applications";

export const Route = createFileRoute("/admin/applications/$id")({
  component: ApplicantProfile,
});

const STATUSES = ["pending", "shortlisted", "interview_scheduled", "selected", "rejected"] as const;

function ApplicantProfile() {
  const { id } = Route.useParams();
  const get = useServerFn(getApplication);
  const update = useServerFn(updateApplicationStatus);
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["admin", "application", id],
    queryFn: () => get({ data: { id } }),
  });

  const a = q.data?.application;

  const setStatus = async (status: (typeof STATUSES)[number]) => {
    await update({ data: { id, status } });
    qc.invalidateQueries({ queryKey: ["admin"] });
  };

  if (q.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!a) return <p>Application not found. <Link to="/admin/applications" className="text-gold underline">Back</Link></p>;

  return (
    <div className="space-y-8">
      <Link to="/admin/applications" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
        <ArrowLeft className="w-4 h-4" /> Back to applicants
      </Link>

      <div className="glass-strong rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">{a.full_name}</h1>
            <div className="mt-2 text-sm text-muted-foreground">{a.roll_number} · {a.course} · Sem {a.semester}</div>
          </div>
          <StatusBadge status={a.status} />
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-5 text-sm">
          <Info label="Email" value={a.email} />
          <Info label="Phone" value={a.phone} />
          <Info label="Availability" value={a.availability} />
          <Info label="Commitment" value={a.commitment ? "Yes" : "No"} />
          <Info label="Submitted" value={new Date(a.created_at).toLocaleString()} />
          <Info label="Last update" value={new Date(a.updated_at).toLocaleString()} />
        </div>

        <div className="mt-7">
          <div className="text-xs uppercase tracking-wider text-gold mb-2">Preferred Departments</div>
          <div className="flex flex-wrap gap-2">
            {(a.departments as string[]).map((d, i) => (
              <span key={d} className="px-3 py-1.5 rounded-lg glass border border-[color:var(--glass-border-gold)] text-sm">
                {i + 1}. {DEPARTMENTS.find((x) => x.id === d)?.name ?? d}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <div className="text-xs uppercase tracking-wider text-gold mb-2">Motivation</div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{a.motivation}</p>
        </div>

        {a.insight && (
          <div className="mt-7">
            <div className="text-xs uppercase tracking-wider text-gold mb-2">Insight</div>
            <p className="text-sm text-muted-foreground">{a.insight}</p>
          </div>
        )}
      </div>

      <div className="glass-strong rounded-2xl p-6 sm:p-8">
        <div className="text-xs uppercase tracking-wider text-gold mb-4">Update Status</div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                a.status === s
                  ? "glass-gold border-gold text-gold shadow-gold"
                  : "glass border-[color:var(--glass-border)] hover:border-[color:var(--glass-border-gold)]"
              }`}
            >
              {prettyStatus(s)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-muted-foreground text-xs uppercase tracking-wider">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
