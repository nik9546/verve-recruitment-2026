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

async function sha256Hex(value: string) {
  const input = new TextEncoder().encode(value);
  const digest = new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", input));
  return Array.from(digest, (b) => b.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export async function hashAdminPassword(value: string) {
  return sha256Hex(value);
}

export async function verifyAdminPassword(input: string, expected: string) {
  const inputHash = await sha256Hex(input);
  const expectedHash =
    expected.length === 64 && /^[0-9a-f]+$/i.test(expected)
      ? expected.toLowerCase()
      : await sha256Hex(expected);
  return constantTimeEqual(inputHash, expectedHash);
}

export async function getStoredAdminPasswordHash(): Promise<string | null> {
  try {
    const admin = await getSupabaseAdmin();
    const { data, error } = await admin
      .from("admin_credentials")
      .select("password_hash")
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      console.error("getStoredAdminPasswordHash error", error);
      return null;
    }
    return data?.password_hash ?? null;
  } catch (error) {
    console.error("getStoredAdminPasswordHash exception", error);
    return null;
  }
}

export async function setStoredAdminPasswordHash(hash: string) {
  const admin = await getSupabaseAdmin();
  const { error } = await admin
    .from("admin_credentials")
    .upsert({ id: 1, password_hash: hash, updated_at: new Date().toISOString() });
  if (error) throw error;
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

export type AdminResetSession = { otp?: string; expiresAt?: number; verified?: boolean };

export async function getAdminResetSession() {
  const secret = getAdminSessionSecret();
  return useSession<AdminResetSession>({
    password: secret.value,
    name: "verve_admin_reset",
    maxAge: 60 * 15,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  });
}

export function generateOtp() {
  const bytes = new Uint8Array(4);
  globalThis.crypto.getRandomValues(bytes);
  const n = ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
  return String(n % 1000000).padStart(6, "0");
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.data.isAdmin) {
    throw new Error("Unauthorized");
  }
  return session;
}
