import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getAdminCredential,
  getAdminSession,
  getAdminSessionSecret,
  verifyAdminPassword,
} from "./admin.server";

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ password: z.string().min(1).max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const credential = getAdminCredential();
    if (!credential) {
      return { ok: false as const, error: "Admin password not configured on the server." };
    }
    const valid = await verifyAdminPassword(data.password, credential.value);
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

export const getAdminAuthHealth = createServerFn({ method: "GET" }).handler(async () => {
  const secret = getAdminSessionSecret();
  return {
    ok: true as const,
    sessionSecretSource: secret.source,
    runtimeSessionSecret: secret.runtime,
    adminCredentialConfigured: Boolean(getAdminCredential()),
  };
});
