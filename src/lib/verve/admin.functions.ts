import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  generateOtp,
  getAdminCredential,
  getAdminResetSession,
  getAdminSession,
  getAdminSessionSecret,
  getStoredAdminPasswordHash,
  hashAdminPassword,
  setStoredAdminPasswordHash,
  verifyAdminPassword,
} from "./admin.server";

const OTP_TTL_MS = 5 * 60 * 1000;

async function resolveExpectedPassword(): Promise<string | null> {
  const stored = await getStoredAdminPasswordHash();
  if (stored) return stored;
  const env = getAdminCredential();
  return env?.value ?? null;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ password: z.string().min(1).max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const expected = await resolveExpectedPassword();
    if (!expected) {
      return { ok: false as const, error: "Admin password not configured on the server." };
    }
    const valid = await verifyAdminPassword(data.password, expected);
    if (!valid) {
      await new Promise((r) => setTimeout(r, 400));
      return { ok: false as const, error: "Incorrect password." };
    }
    const session = await getAdminSession();
    await session.update({ isAdmin: true, loggedInAt: Date.now() });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAdminSession();
  await session.clear();
  return { ok: true as const };
});

export const checkAdminAuth = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const session = await getAdminSession();
    return { isAdmin: Boolean(session.data.isAdmin) };
  } catch (error) {
    console.error("checkAdminAuth failed", error);
    return { isAdmin: false, error: "Admin session could not be verified." };
  }
});

export const changeAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        currentPassword: z.string().min(1).max(200),
        newPassword: z
          .string()
          .min(8, "New password must be at least 8 characters")
          .max(200),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.isAdmin) {
      return { ok: false as const, error: "Not signed in as admin." };
    }
    const expected = await resolveExpectedPassword();
    if (!expected) {
      return { ok: false as const, error: "Admin password not configured on the server." };
    }
    const valid = await verifyAdminPassword(data.currentPassword, expected);
    if (!valid) {
      await new Promise((r) => setTimeout(r, 400));
      return { ok: false as const, error: "Current password is incorrect." };
    }
    if (data.currentPassword === data.newPassword) {
      return { ok: false as const, error: "New password must be different." };
    }
    const newHash = await hashAdminPassword(data.newPassword);
    try {
      await setStoredAdminPasswordHash(newHash);
    } catch (error) {
      console.error("changeAdminPassword save failed", error);
      return { ok: false as const, error: "Could not save new password." };
    }
    return { ok: true as const };
  });

export const getAdminAuthHealth = createServerFn({ method: "GET" }).handler(async () => {
  const secret = getAdminSessionSecret();
  const stored = await getStoredAdminPasswordHash();
  return {
    ok: true as const,
    sessionSecretSource: secret.source,
    runtimeSessionSecret: secret.runtime,
    adminCredentialConfigured: Boolean(stored) || Boolean(getAdminCredential()),
    passwordSource: stored ? ("database" as const) : ("environment" as const),
  };
});
