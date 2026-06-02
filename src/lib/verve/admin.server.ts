import { useSession } from "@tanstack/react-start/server";

const SESSION_NAME = "verve_admin_session";

export type AdminSession = { isAdmin?: boolean; loggedInAt?: number };

function getSessionConfig() {
  const password = process.env.ADMIN_SESSION_SECRET;
  if (!password) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }
  return {
    password,
    name: SESSION_NAME,
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export async function getAdminSession() {
  return useSession<AdminSession>(getSessionConfig());
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.data.isAdmin) {
    throw new Error("Unauthorized");
  }
  return session;
}
