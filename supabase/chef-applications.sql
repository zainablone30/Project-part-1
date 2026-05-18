-- ============================================================
-- Chef applications table
-- Run in Supabase SQL editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.chef_applications (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  whatsapp    text        NOT NULL,
  city        text        NOT NULL,
  specialty   text        NOT NULL,
  experience  text,
  description text,
  status      text        NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Open insert (anyone can apply), only admin reads via service role
ALTER TABLE public.chef_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chef_applications_insert" ON public.chef_applications;
CREATE POLICY "chef_applications_insert" ON public.chef_applications
  FOR INSERT WITH CHECK (true);

-- No SELECT policy for users — admin uses service key to read applications
