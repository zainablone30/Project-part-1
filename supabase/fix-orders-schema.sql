-- ============================================================
-- Fix / create the orders table with all required columns.
-- Safe to run multiple times (all operations are idempotent).
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create the table if it does not exist yet
CREATE TABLE IF NOT EXISTS public.orders (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       text        NOT NULL,
  restaurant_name text      NOT NULL,
  items         jsonb       NOT NULL DEFAULT '[]'::jsonb,
  subtotal      numeric     NOT NULL DEFAULT 0,
  delivery_fee  numeric     NOT NULL DEFAULT 50,
  total         numeric     NOT NULL DEFAULT 0,
  status        text        NOT NULL DEFAULT 'pending',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- 2. Add every optional column (no-op if the column already exists)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS restaurant_area     text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS restaurant_lat      numeric;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS restaurant_lng      numeric;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_lat        numeric;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_lng        numeric;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_minutes   integer DEFAULT 30;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_address    text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes               text;

-- 3. Add status constraint (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'orders' AND constraint_name = 'orders_status_check'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_status_check
      CHECK (status IN ('pending','confirmed','preparing','on_the_way','delivered','cancelled'));
  END IF;
END;
$$;

-- 4. updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS orders_set_updated_at ON public.orders;
CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Enable RLS + open policies (adjust for production)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select" ON public.orders;
CREATE POLICY "orders_select" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "orders_insert" ON public.orders;
CREATE POLICY "orders_insert" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "orders_update" ON public.orders;
CREATE POLICY "orders_update" ON public.orders FOR UPDATE USING (true);

-- 6. Enable realtime (ignore error if already enabled)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN duplicate_object THEN NULL;
END; $$;
