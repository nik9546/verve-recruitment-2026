import { useSession } from "@tanstack/react-start/server";

const SESSION_NAME = "verve_admin_session";
const MIN_SECRET_LENGTH = 64;
const SESSION_SECRET_ENV_NAMES = [
  "SESSION_SECRET",
  "ADMIN_SESSION_SECRET",
  "ENCRYPTION_KEY",
  "JWT_SECRET",
  "LOVABLE_API_KEY",
] as const;
const ADMIN_CREDENTIAL_ENV_NAMES = ["ADMIN_SECRET", "ADMIN_PASSWORD"] as const;

let runtimeSessionSecret: string | undefined;

export type AdminSession = { isAdmin?: boolean; loggedInAt?: number };

function isStrongSecret(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length >= MIN_SECRET_LENGTH;
}

function generateRuntimeSecret() {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function getAdminSessionSecret() {
  for (const name of SESSION_SECRET_ENV_NAMES) {
    const value = process.env[name]?.trim();
    if (isStrongSecret(value)) return { value, source: name, runtime: false };
  }

  runtimeSessionSecret ??= generateRuntimeSecret();
  console.error(
    `Admin auth warning: none of ${SESSION_SECRET_ENV_NAMES.join(
      ", ",
    )} is configured with at least ${MIN_SECRET_LENGTH} characters. Using a secure runtime-only fallback; sessions may reset between deployments.`,
  );
  return { value: runtimeSessionSecret, source: "runtime-generated", runtime: true };
}

export function getAdminCredential() {
  for (const name of ADMIN_CREDENTIAL_ENV_NAMES) {
    const value = process.env[name];
    if (value && value.length > 0) return { value, source: name };
  }
  return null;
}

async function sha256(value: string) {
  const input = new TextEncoder().encode(value);
  return new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", input));
}

export async function verifyAdminPassword(input: string, expected: string) {
  const [a, b] = await Promise.all([sha256(input), sha256(expected)]);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return diff === 0;
}

export async function getSupabaseAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function getSessionConfig() {
  const secret = getAdminSessionSecret();
  return {
    password: secret.value,
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
