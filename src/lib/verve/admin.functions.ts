import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getAdminSession } from "./admin.server";

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ password: z.string().min(1).max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return { ok: false as const, error: "Admin password not configured on the server." };
    }
    if (data.password !== expected) {
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
  const session = await getAdminSession();
  return { isAdmin: Boolean(session.data.isAdmin) };
});
