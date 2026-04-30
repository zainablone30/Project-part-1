-- Run this in your Supabase SQL Editor
-- Adds allergens column to foods and populates it based on food names/descriptions/categories

ALTER TABLE foods
  ADD COLUMN IF NOT EXISTS allergens text[] DEFAULT '{}'::text[];

-- ── Dairy ──────────────────────────────────────────────────────────────────
UPDATE foods
SET allergens = array_append(allergens, 'Dairy')
WHERE (
  name        ILIKE ANY(ARRAY['%kheer%','%halwa%','%lassi%','%dahi%','%raita%','%paneer%',
                               '%malai%','%khoya%','%cream%','%butter%','%milk%','%rabri%',
                               '%firni%','%payasam%','%barfi%','%kulfi%','%shahi%'])
  OR description ILIKE ANY(ARRAY['%milk%','%cream%','%butter%','%dahi%','%khoya%','%malai%',
                                  '%paneer%','%rabri%'])
  OR category = 'Dessert'
)
AND NOT 'Dairy' = ANY(COALESCE(allergens, '{}'));

-- ── Gluten ─────────────────────────────────────────────────────────────────
UPDATE foods
SET allergens = array_append(allergens, 'Gluten')
WHERE (
  name        ILIKE ANY(ARRAY['%paratha%','%naan%','%roti%','%bread%','%pasta%','%roll%',
                               '%puri%','%kulcha%','%bhatura%','%samosa%','%spring roll%',
                               '%tikki%','%patty%','%burger%','%pizza%','%pita%'])
  OR description ILIKE ANY(ARRAY['%flour%','%wheat%','%maida%','%atta%'])
  OR category IN ('Breakfast', 'Rolls', 'Fast Food')
)
AND NOT 'Gluten' = ANY(COALESCE(allergens, '{}'));

-- ── Eggs ───────────────────────────────────────────────────────────────────
UPDATE foods
SET allergens = array_append(allergens, 'Eggs')
WHERE (
  name        ILIKE ANY(ARRAY['%egg%','%anday%',' anda %','%omelet%','%omelette%','%anda%'])
  OR description ILIKE ANY(ARRAY['%egg%','%anday%','%omelet%'])
)
AND NOT 'Eggs' = ANY(COALESCE(allergens, '{}'));

-- ── Nuts ───────────────────────────────────────────────────────────────────
UPDATE foods
SET allergens = array_append(allergens, 'Nuts')
WHERE (
  name        ILIKE ANY(ARRAY['%badam%','%kaju%','%pista%','%akhrot%','%almond%','%cashew%',
                               '%pistachio%','%walnut%','%peanut%','% nut %','%mixed nut%'])
  OR description ILIKE ANY(ARRAY['%badam%','%kaju%','%pista%','%almond%','%cashew%','%nut%'])
)
AND NOT 'Nuts' = ANY(COALESCE(allergens, '{}'));

-- ── Seafood ────────────────────────────────────────────────────────────────
UPDATE foods
SET allergens = array_append(allergens, 'Seafood')
WHERE (
  name        ILIKE ANY(ARRAY['%fish%','%mahi%','%jhinga%','%prawn%','%shrimp%','%machli%',
                               '%tuna%','%salmon%','%crab%'])
  OR description ILIKE ANY(ARRAY['%fish%','%prawn%','%shrimp%','%seafood%','%jhinga%'])
  OR category = 'Seafood'
)
AND NOT 'Seafood' = ANY(COALESCE(allergens, '{}'));

-- ── Sesame ─────────────────────────────────────────────────────────────────
UPDATE foods
SET allergens = array_append(allergens, 'Sesame')
WHERE (
  name        ILIKE ANY(ARRAY['%til%','%sesame%','%tahini%'])
  OR description ILIKE ANY(ARRAY['%til%','%sesame%','%tahini%'])
)
AND NOT 'Sesame' = ANY(COALESCE(allergens, '{}'));
