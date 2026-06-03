import { CalendarClock, MapPin, Clock, Info, RefreshCw } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { useRecruitmentSettings } from "@/lib/verve/use-recruitment";

function formatDate(s?: string | null) {
  if (!s) return null;
  try {
    return new Date(s).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return s;
  }
}

function formatUpdated(s?: string | null) {
  if (!s) return null;
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

export function InterviewInfo() {
  const { data } = useRecruitmentSettings();
  const published = Boolean(data?.interview_published);
  const date = formatDate(data?.interview_date);
  const time = data?.interview_time?.trim();
  const venue = data?.interview_venue?.trim();
  const instructions = data?.interview_instructions?.trim();
  const updated = formatUpdated(data?.updated_at);

  return (
    <section id="interview" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Interview"
          title={<>Interview <span className="text-gradient-gold">Information</span></>}
          subtitle="Stay updated with the official interview schedule for VERVE Recruitment 2026."
        />

        <div className="mt-14 glass-strong rounded-3xl p-8 sm:p-12">
          {!published ? (
            <div className="text-center">
              <div className="mx-auto mb-6 w-14 h-14 rounded-2xl glass-gold flex items-center justify-center">
                <CalendarClock className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-gradient-gold">
                Interview details will be announced soon.
              </h3>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                The interview schedule, venue, reporting time, and important instructions
                will be published here once finalized. Stay connected with VERVE's official
                social media platforms and visit this portal regularly for recruitment updates.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                  <CalendarClock className="w-5 h-5 text-navy-deep" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Official Schedule</div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold">Interview Schedule</h3>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
                <InfoCard icon={CalendarClock} label="Date" value={date ?? "To be announced"} />
                <InfoCard icon={Clock} label="Reporting Time" value={time || "To be announced"} />
                <InfoCard icon={MapPin} label="Venue" value={venue || "To be announced"} />
              </div>

              {instructions && (
                <div className="mt-6 glass rounded-2xl p-6 border border-[color:var(--glass-border-gold)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-gold" />
                    <span className="text-xs uppercase tracking-[0.28em] text-gold">Instructions</span>
                  </div>
                  <p className="text-sm sm:text-base text-foreground/90 whitespace-pre-line leading-relaxed">
                    {instructions}
                  </p>
                </div>
              )}

              {updated && (
                <div className="mt-6 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                  <RefreshCw className="w-3 h-3" />
                  Last Updated: {updated}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-2xl p-5 border border-[color:var(--glass-border)]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-lg glass-gold flex items-center justify-center">
          <Icon className="w-4 h-4 text-gold" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
      </div>
      <div className="font-display text-base sm:text-lg font-semibold text-foreground">
        {value}
      </div>
    </div>
  );
}
