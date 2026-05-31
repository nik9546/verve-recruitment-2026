
CREATE TABLE public.verve_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  roll_number text NOT NULL,
  course text NOT NULL,
  semester text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  departments text[] NOT NULL,
  motivation text NOT NULL,
  availability text NOT NULL,
  commitment boolean NOT NULL,
  insight text,
  CONSTRAINT verve_applications_departments_len CHECK (array_length(departments, 1) = 3),
  CONSTRAINT verve_applications_motivation_len CHECK (char_length(motivation) BETWEEN 20 AND 2000),
  CONSTRAINT verve_applications_email_len CHECK (char_length(email) BETWEEN 3 AND 255)
);

GRANT INSERT ON public.verve_applications TO anon, authenticated;
GRANT ALL ON public.verve_applications TO service_role;

ALTER TABLE public.verve_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
  ON public.verve_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
