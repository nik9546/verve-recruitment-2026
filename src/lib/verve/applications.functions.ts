import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "./admin.server";

const STATUS_VALUES = [
  "pending",
  "shortlisted",
  "interview_scheduled",
  "selected",
  "rejected",
] as const;
export type ApplicationStatus = (typeof STATUS_VALUES)[number];

const submitSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  roll_number: z.string().trim().min(2).max(40),
  course: z.string().trim().min(2).max(120),
  semester: z.string().trim().min(1).max(10),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/),
  email: z.string().trim().email().max(255).toLowerCase(),
  departments: z.array(z.string().min(1).max(80)).length(3),
  motivation: z.string().trim().min(20).max(2000),
  availability: z.string().trim().min(1).max(40),
  commitment: z.boolean(),
  insight: z.string().max(500).nullable().optional(),
});

export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: settings } = await supabaseAdmin
      .from("recruitment_settings")
      .select("state, closes_at")
      .eq("id", 1)
      .maybeSingle();
    if (settings) {
      const closed =
        settings.state !== "open" ||
        new Date(settings.closes_at).getTime() <= Date.now();
      if (closed) {
        return { ok: false as const, error: "Applications are currently closed." };
      }
    }
    if (!data.commitment) {
      return { ok: false as const, error: "Active participation is required." };
    }

    const { error } = await supabaseAdmin.from("applications").insert(data);
    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (error.code === "23505" || msg.includes("duplicate")) {
        if (msg.includes("email"))
          return {
            ok: false as const,
            error: "You have already submitted an application.",
          };
        if (msg.includes("roll"))
          return {
            ok: false as const,
            error: "An application with this roll number already exists.",
          };
        return { ok: false as const, error: "A duplicate application already exists." };
      }
      console.error("submitApplication error", error);
      return {
        ok: false as const,
        error: "Could not save your application. Please try again.",
      };
    }
    return { ok: true as const };
  });

const listSchema = z.object({
  search: z.string().max(120).optional(),
  status: z.enum([...STATUS_VALUES, "all"] as const).optional(),
  department: z.string().max(80).optional(),
  semester: z.string().max(10).optional(),
  course: z.string().max(120).optional(),
});

export const listApplications = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => listSchema.parse(input ?? {}))
  .handler(async ({ data }) => {
    await requireAdmin();
    let q = supabaseAdmin
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (data.status && data.status !== "all") q = q.eq("status", data.status);
    if (data.semester) q = q.eq("semester", data.semester);
    if (data.course) q = q.ilike("course", `%${data.course}%`);
    if (data.department) q = q.contains("departments", [data.department]);
    if (data.search) {
      const s = data.search.replace(/[%,]/g, " ");
      q = q.or(
        `full_name.ilike.%${s}%,roll_number.ilike.%${s}%,email.ilike.%${s}%,course.ilike.%${s}%`,
      );
    }
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { applications: rows ?? [] };
  });

export const getApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { data: row, error } = await supabaseAdmin
      .from("applications")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { application: row };
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(STATUS_VALUES) }).parse(input),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { error } = await supabaseAdmin
      .from("applications")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const getApplicationStats = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const { data: rows, error } = await supabaseAdmin
      .from("applications")
      .select("status, semester, course, departments, created_at")
      .limit(5000);
    if (error) throw new Error(error.message);

    const total = rows?.length ?? 0;
    const counts: Record<ApplicationStatus, number> = {
      pending: 0,
      shortlisted: 0,
      interview_scheduled: 0,
      selected: 0,
      rejected: 0,
    };
    const bySem: Record<string, number> = {};
    const byCourse: Record<string, number> = {};
    const byDept: Record<string, number> = {};
    const byDay: Record<string, number> = {};
    for (const r of rows ?? []) {
      counts[r.status as ApplicationStatus] =
        (counts[r.status as ApplicationStatus] ?? 0) + 1;
      bySem[r.semester] = (bySem[r.semester] ?? 0) + 1;
      byCourse[r.course] = (byCourse[r.course] ?? 0) + 1;
      for (const d of (r.departments ?? []) as string[]) {
        byDept[d] = (byDept[d] ?? 0) + 1;
      }
      const day = new Date(r.created_at).toISOString().slice(0, 10);
      byDay[day] = (byDay[day] ?? 0) + 1;
    }
    return { total, counts, bySem, byCourse, byDept, byDay };
  },
);

export const exportApplicationsCsv = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw new Error(error.message);
    const headers = [
      "full_name",
      "roll_number",
      "course",
      "semester",
      "phone",
      "email",
      "departments",
      "status",
      "motivation",
      "availability",
      "commitment",
      "created_at",
    ];
    const esc = (v: unknown) => {
      const s =
        v === null || v === undefined
          ? ""
          : Array.isArray(v)
            ? v.join("; ")
            : String(v);
      return `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
    };
    const lines = [headers.join(",")];
    for (const r of data ?? []) {
      lines.push(
        headers
          .map((h) => esc((r as Record<string, unknown>)[h]))
          .join(","),
      );
    }
    return { csv: lines.join("\n"), count: data?.length ?? 0 };
  },
);
