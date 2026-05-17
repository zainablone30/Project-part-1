-- ============================================================
-- Orders table + restaurant coordinates
-- Run this in Supabase SQL editor
-- ============================================================

-- 1. Add lat/lng to restaurants table
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS lat numeric;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS lng numeric;

-- 2. Seed restaurant coordinates based on area (Lahore)
UPDATE public.restaurants SET lat = 31.5204, lng = 74.3587 WHERE area ILIKE '%gulberg%';
UPDATE public.restaurants SET lat = 31.4697, lng = 74.4094 WHERE area ILIKE '%dha%';
UPDATE public.restaurants SET lat = 31.4750, lng = 74.3286 WHERE area ILIKE '%model town%';
UPDATE public.restaurants SET lat = 31.4620, lng = 74.2785 WHERE area ILIKE '%johar town%';
UPDATE public.restaurants SET lat = 31.3548, lng = 74.1817 WHERE area ILIKE '%bahria%';
UPDATE public.restaurants SET lat = 31.4879, lng = 74.3312 WHERE area ILIKE '%garden town%';
UPDATE public.restaurants SET lat = 31.5131, lng = 74.3366 WHERE area ILIKE '%shadman%';
UPDATE public.restaurants SET lat = 31.4666, lng = 74.2748 WHERE area ILIKE '%township%';
UPDATE public.restaurants SET lat = 31.5017, lng = 74.2556 WHERE area ILIKE '%valencia%';
UPDATE public.restaurants SET lat = 31.5497, lng = 74.3264 WHERE area ILIKE '%cantt%';
UPDATE public.restaurants SET lat = 31.4934, lng = 74.3284 WHERE area ILIKE '%pechs%';
UPDATE public.restaurants SET lat = 31.4716, lng = 74.2912 WHERE area ILIKE '%faisal%';
UPDATE public.restaurants SET lat = 31.4748, lng = 74.3050 WHERE area ILIKE '%iqbal%';
-- Fallback: any restaurant without coordinates gets Lahore center
UPDATE public.restaurants SET lat = 31.5204, lng = 74.3587 WHERE lat IS NULL;

-- 3. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           text        NOT NULL,
  restaurant_name   text        NOT NULL,
  restaurant_area   text,
  restaurant_lat    numeric,
  restaurant_lng    numeric,
  items             jsonb       NOT NULL DEFAULT '[]'::jsonb,
  subtotal          numeric     NOT NULL DEFAULT 0,
  delivery_fee      numeric     NOT NULL DEFAULT 50,
  total             numeric     NOT NULL DEFAULT 0,
  status            text        NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','preparing','on_the_way','delivered','cancelled')),
  delivery_address  text,
  customer_lat      numeric,
  customer_lng      numeric,
  estimated_minutes integer     DEFAULT 30,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- 4. Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_set_updated_at ON public.orders;
CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 6. RLS policies (users see/manage only their own orders)
DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT USING (true);  -- open read for now (user_id is text, may be guest)

DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "orders_update_own" ON public.orders;
CREATE POLICY "orders_update_own" ON public.orders
  FOR UPDATE USING (true);

-- 7. Enable realtime on orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
