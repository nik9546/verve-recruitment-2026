import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { listApplications, exportApplicationsCsv } from "@/lib/verve/applications.functions";
import { DEPARTMENTS } from "@/lib/verve/departments";

export const Route = createFileRoute("/admin/applications")({
  component: ApplicantsPage,
});

const STATUSES = ["all", "pending", "shortlisted", "interview_scheduled", "selected", "rejected"] as const;

function ApplicantsPage() {
  const list = useServerFn(listApplications);
  const exportCsv = useServerFn(exportApplicationsCsv);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");

  const query = useQuery({
    queryKey: ["admin", "applications", { search, status, department, semester, course }],
    queryFn: () =>
      list({
        data: {
          search: search || undefined,
          status,
          department: department || undefined,
          semester: semester || undefined,
          course: course || undefined,
        },
      }),
  });

  const apps = query.data?.applications ?? [];

  const onExport = async () => {
    const { csv } = await exportCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `verve-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const departmentOptions = useMemo(() => DEPARTMENTS.map((d) => ({ id: d.id, name: d.name })), []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">Applicants</h1>
          <p className="mt-1 text-muted-foreground text-sm">{apps.length} record{apps.length === 1 ? "" : "s"}</p>
        </div>
        <button onClick={onExport} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-[color:var(--glass-border-gold)] text-sm hover:shadow-gold transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="glass-strong rounded-2xl p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <label className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, roll, email, course…"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg glass border border-[color:var(--glass-border)] focus:border-gold outline-none text-sm"
          />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={selectCls}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All Statuses" : prettyStatus(s)}</option>
          ))}
        </select>
        <select value={department} onChange={(e) => setDepartment(e.target.value)} className={selectCls}>
          <option value="">All Departments</option>
          {departmentOptions.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <select value={semester} onChange={(e) => setSemester(e.target.value)} className={selectCls}>
            <option value="">All Sem</option>
            {["1","2","3","4","5","6","7","8"].map((s) => <option key={s} value={s}>Sem {s}</option>)}
          </select>
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Course"
            className={selectCls}
          />
        </div>
      </div>

      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--glass-bg)] text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <Th>Name</Th>
                <Th>Roll No.</Th>
                <Th>Course</Th>
                <Th>Sem</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
                <Th>Departments</Th>
                <Th>Status</Th>
                <Th>Submitted</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {query.isLoading && (
                <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">Loading…</td></tr>
              )}
              {!query.isLoading && apps.length === 0 && (
                <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">No applications found.</td></tr>
              )}
              {apps.map((a) => (
                <tr key={a.id} className="border-t border-[color:var(--glass-border)] hover:bg-[color:var(--glass-bg)]">
                  <Td className="font-medium">{a.full_name}</Td>
                  <Td>{a.roll_number}</Td>
                  <Td>{a.course}</Td>
                  <Td>{a.semester}</Td>
                  <Td>{a.phone}</Td>
                  <Td>{a.email}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(a.departments as string[]).map((d) => (
                        <span key={d} className="px-1.5 py-0.5 text-[10px] rounded-md glass border border-[color:var(--glass-border)]">
                          {DEPARTMENTS.find((x) => x.id === d)?.name ?? d}
                        </span>
                      ))}
                    </div>
                  </Td>
                  <Td><StatusBadge status={a.status} /></Td>
                  <Td>{new Date(a.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <Link
                      to="/admin/applications/$id"
                      params={{ id: a.id }}
                      className="text-gold text-xs hover:underline"
                    >
                      View
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const selectCls =
  "w-full px-3 py-2.5 rounded-lg glass border border-[color:var(--glass-border)] focus:border-gold outline-none text-sm";

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="text-left px-3 py-3 whitespace-nowrap font-medium">{children}</th>;
}
function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-3 align-top ${className}`}>{children}</td>;
}

export function prettyStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    shortlisted: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    interview_scheduled: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    selected: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    rejected: "bg-red-500/15 text-red-300 border-red-500/30",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${map[status] ?? "glass"}`}>
      {prettyStatus(status)}
    </span>
  );
}
