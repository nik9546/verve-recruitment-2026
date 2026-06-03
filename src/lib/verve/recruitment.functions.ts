import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "./admin.server";

export type RecruitmentState = "open" | "closed" | "interview" | "results";

export const getPublicRecruitmentSettings = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("recruitment_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
);

const updateSchema = z.object({
  cycle_name: z.string().trim().min(2).max(120),
  opens_at: z.string().min(1),
  closes_at: z.string().min(1),
  interview_date: z.string().nullable().optional(),
  results_date: z.string().nullable().optional(),
  state: z.enum(["open", "closed", "interview", "results"]),
});

export const updateRecruitmentSettings = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => updateSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { error } = await supabaseAdmin
      .from("recruitment_settings")
      .update({
        cycle_name: data.cycle_name,
        opens_at: data.opens_at,
        closes_at: data.closes_at,
        interview_date: data.interview_date || null,
        results_date: data.results_date || null,
        state: data.state,
      })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const interviewSchema = z.object({
  interview_date: z.string().nullable().optional(),
  interview_time: z.string().max(80).nullable().optional(),
  interview_venue: z.string().max(255).nullable().optional(),
  interview_instructions: z.string().max(4000).nullable().optional(),
  interview_published: z.boolean(),
});

export const updateInterviewInfo = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => interviewSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { error } = await supabaseAdmin
      .from("recruitment_settings")
      .update({
        interview_date: data.interview_date || null,
        interview_time: data.interview_time || null,
        interview_venue: data.interview_venue || null,
        interview_instructions: data.interview_instructions || null,
        interview_published: data.interview_published,
      })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
