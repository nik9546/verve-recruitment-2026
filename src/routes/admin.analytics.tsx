import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { getApplicationStats } from "@/lib/verve/applications.functions";
import { DEPARTMENTS } from "@/lib/verve/departments";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsPage,
});

const COLORS = ["#d9b25b", "#f4d77a", "#1a4a6e", "#5cbdb9", "#c44569", "#9b72cf"];

function AnalyticsPage() {
  const stats = useServerFn(getApplicationStats);
  const q = useQuery({ queryKey: ["admin", "stats"], queryFn: () => stats() });

  const toArr = (rec?: Record<string, number>) =>
    Object.entries(rec ?? {}).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const statusData = toArr(q.data?.counts as Record<string, number> | undefined).map((d) => ({
    ...d,
    name: d.name.replace(/_/g, " "),
  }));
  const semData = toArr(q.data?.bySem);
  const courseData = toArr(q.data?.byCourse).slice(0, 10);
  const deptData = toArr(q.data?.byDept).map((d) => ({
    ...d,
    name: DEPARTMENTS.find((x) => x.id === d.name)?.name ?? d.name,
  }));
  const dailyData = Object.entries(q.data?.byDay ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">Analytics</h1>
        <p className="mt-2 text-muted-foreground text-sm">{q.data?.total ?? 0} total applications</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Applications by Status">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={100} label>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Applications by Department">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#d9b25b" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Applications by Semester">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={semData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#f4d77a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top Courses">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={courseData} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#5cbdb9" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Daily Application Trend" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#d9b25b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-strong rounded-2xl p-5 ${className}`}>
      <div className="text-xs uppercase tracking-wider text-gold mb-3">{title}</div>
      {children}
    </div>
  );
}
