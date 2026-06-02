-- Enums
CREATE TYPE public.application_status AS ENUM ('pending', 'shortlisted', 'interview_scheduled', 'selected', 'rejected');
CREATE TYPE public.recruitment_state AS ENUM ('open', 'closed', 'interview', 'results');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 1. applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  course TEXT NOT NULL,
  semester TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  departments TEXT[] NOT NULL,
  motivation TEXT NOT NULL,
  availability TEXT NOT NULL,
  commitment BOOLEAN NOT NULL,
  insight TEXT,
  status public.application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT applications_roll_number_key UNIQUE (roll_number),
  CONSTRAINT applications_email_key UNIQUE (email)
);

CREATE INDEX applications_status_idx ON public.applications(status);
CREATE INDEX applications_created_at_idx ON public.applications(created_at DESC);

GRANT INSERT ON public.applications TO anon, authenticated;
GRANT ALL ON public.applications TO service_role;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
  ON public.applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE TRIGGER applications_set_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Migrate existing rows from verve_applications (dedupe by roll_number, keep newest)
INSERT INTO public.applications (
  id, full_name, roll_number, course, semester, phone, email,
  departments, motivation, availability, commitment, insight, created_at
)
SELECT DISTINCT ON (roll_number)
  id, full_name, roll_number, course, semester, phone, email,
  departments, motivation, availability, commitment, insight, created_at
FROM public.verve_applications
ORDER BY roll_number, created_at DESC
ON CONFLICT DO NOTHING;

-- Second pass: also dedupe any email collisions
DELETE FROM public.applications a
USING public.applications b
WHERE a.ctid < b.ctid AND a.email = b.email;

DROP TABLE public.verve_applications;

-- 2. recruitment_settings (singleton)
CREATE TABLE public.recruitment_settings (
  id INT PRIMARY KEY DEFAULT 1,
  cycle_name TEXT NOT NULL DEFAULT 'VERVE Recruitment 2026',
  opens_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closes_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '45 days'),
  interview_date TIMESTAMPTZ,
  results_date TIMESTAMPTZ,
  state public.recruitment_state NOT NULL DEFAULT 'open',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT recruitment_settings_singleton CHECK (id = 1)
);

GRANT SELECT ON public.recruitment_settings TO anon, authenticated;
GRANT ALL ON public.recruitment_settings TO service_role;

ALTER TABLE public.recruitment_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read recruitment settings"
  ON public.recruitment_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TRIGGER recruitment_settings_set_updated_at
  BEFORE UPDATE ON public.recruitment_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.recruitment_settings (id, cycle_name, closes_at, state)
VALUES (1, 'VERVE Recruitment 2026', '2026-07-15 23:59:59+05:30', 'open')
ON CONFLICT (id) DO NOTHING;