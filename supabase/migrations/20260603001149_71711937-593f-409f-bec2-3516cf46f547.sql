
ALTER TABLE public.recruitment_settings
  ADD COLUMN IF NOT EXISTS interview_time text,
  ADD COLUMN IF NOT EXISTS interview_venue text,
  ADD COLUMN IF NOT EXISTS interview_instructions text,
  ADD COLUMN IF NOT EXISTS interview_published boolean NOT NULL DEFAULT false;

-- Relax departments check to 1..3 if a constraint exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'applications_departments_length_chk'
  ) THEN
    ALTER TABLE public.applications DROP CONSTRAINT applications_departments_length_chk;
  END IF;
END $$;

ALTER TABLE public.applications
  ADD CONSTRAINT applications_departments_length_chk
  CHECK (array_length(departments, 1) BETWEEN 1 AND 3);
