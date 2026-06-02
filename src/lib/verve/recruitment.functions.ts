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
