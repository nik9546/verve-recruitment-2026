import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LayoutDashboard, Users, Settings, BarChart3, LogOut, Shield } from "lucide-react";
import { checkAdminAuth, adminLogout } from "@/lib/verve/admin.functions";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const { isAdmin } = await checkAdminAuth();
    if (!isAdmin) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <p className="text-destructive">Admin error: {error.message}</p>
        <Link to="/admin/login" className="text-gold underline mt-2 inline-block">Go to login</Link>
      </div>
    </div>
  ),
});

function AdminLayout() {
  const router = useRouter();
  if (router.state.location.pathname === "/admin/login") {
    return <Outlet />;
  }
  return <AdminShell />;
}

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/applications", label: "Applicants", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Recruitment", icon: Settings },
] as const;

function AdminShell() {
  const navigate = useNavigate();
  const logout = useServerFn(adminLogout);

  const onLogout = async () => {
    await logout();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-hero text-foreground">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-navy-deep/70 border-b border-[color:var(--glass-border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/admin" className="flex items-center gap-2 font-display font-semibold">
            <Shield className="w-5 h-5 text-gold" />
            <span>VERVE Admin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.exact ?? false }}
                className="px-3 py-1.5 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-[color:var(--glass-bg)] transition-colors [&.active]:text-gold [&.active]:bg-[color:var(--glass-bg)]"
              >
                <span className="inline-flex items-center gap-2"><n.icon className="w-4 h-4" />{n.label}</span>
              </Link>
            ))}
          </nav>
          <button onClick={onLogout} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-[color:var(--glass-border)] text-sm hover:border-[color:var(--glass-border-gold)]">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
        <nav className="md:hidden flex overflow-x-auto px-4 pb-3 gap-2 border-t border-[color:var(--glass-border)]">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact ?? false }}
              className="shrink-0 px-3 py-1.5 text-xs rounded-lg glass border border-[color:var(--glass-border)] text-muted-foreground [&.active]:text-gold [&.active]:border-[color:var(--glass-border-gold)]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <Outlet />
      </main>
    </div>
  );
}
