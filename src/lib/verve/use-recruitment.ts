import { useQuery } from "@tanstack/react-query";
import { getPublicRecruitmentSettings } from "./recruitment.functions";

export type EffectiveState = "open" | "closed" | "interview" | "results";

export function useRecruitmentSettings() {
  return useQuery({
    queryKey: ["recruitment-settings"],
    queryFn: () => getPublicRecruitmentSettings(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function effectiveState(
  settings: { state: EffectiveState; closes_at: string } | null | undefined,
): EffectiveState {
  if (!settings) return "open";
  if (settings.state === "open" && new Date(settings.closes_at).getTime() <= Date.now()) {
    return "closed";
  }
  return settings.state;
}
