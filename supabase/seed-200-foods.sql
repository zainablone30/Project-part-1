-- Run once in the Supabase SQL editor.
-- Expected schema:
--   restaurants: id (uuid/bigserial), name (text NOT NULL), area (text NOT NULL)
--   foods: id, restaurant_id (FK → restaurants.id), name, name_urdu, category,
--          price (int), rating (numeric), delivery_time (text), discount (int nullable),
--          is_spicy (bool), is_veg (bool), is_homemade (bool), is_ai_recommended (bool),
--          description (text), image_url (text)

with restaurant_seed(name, area) as (
  values
    ('Lahore Tandoor House',    'Gulberg III'),
    ('Karahi Junction',         'Johar Town'),
    ('Andaaz-e-Lahore',         'DHA Phase 5'),
    ('Biryani Darbar',          'Model Town'),
    ('Chai Shai Corner',        'Liberty Market'),
    ('Protein Plate PK',        'MM Alam Road'),
    ('Nihari Nights',           'Anarkali'),
    ('Paratha Studio',          'Iqbal Town'),
    ('Daal Chawal Co.',         'Garden Town'),
    ('Tikka Town',              'Faisal Town'),
    ('Roll Express',            'Bahria Town'),
    ('Healthy Handi',           'Wapda Town'),
    ('Desi Breakfast Club',     'Cantt'),
    ('Burger Bazaar',           'Fortress Stadium'),
    ('BBQ Baithak',             'Township'),
    ('Soup and Khichdi House',  'Muslim Town'),
    ('Spice Route Lahore',      'Mall Road'),
    ('Home Chef Rasoi',         'Askari 10'),
    ('Late Night Dastarkhan',   'PIA Road'),
    ('Sweet and Savory Cafe',   'Shadman')
),

inserted_restaurants as (
  insert into restaurants (name, area)
  select name, area from restaurant_seed
  returning id, name
),

numbered_restaurants as (
  select id, row_number() over (order by name) as rn
  from inserted_restaurants
),

dish_seed(
  name, name_urdu, category, base_price,
  spicy, veg, homemade, protein, light_food, chai_time,
  image_url
) as (
  values
    ('Chicken Biryani',        'Chicken Biryani',        'Rice',       420,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800'),
    ('Beef Biryani',           'Beef Biryani',           'Rice',       520,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800'),
    ('Vegetable Biryani',      'Vegetable Biryani',      'Rice',       340,  false, true,  false, false, false, false, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'),
    ('Chicken Karahi',         'Chicken Karahi',         'Karahi',    1150,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'),
    ('Mutton Karahi',          'Mutton Karahi',          'Karahi',    1850,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'),
    ('White Chicken Karahi',   'White Chicken Karahi',   'Karahi',    1250,  false, false, false, true,  false, false, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'),
    ('Chicken Tikka',          'Chicken Tikka',          'BBQ',        520,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800'),
    ('Malai Boti',             'Malai Boti',             'BBQ',        680,  false, false, false, true,  false, false, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800'),
    ('Seekh Kebab',            'Seekh Kebab',            'BBQ',        460,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800'),
    ('Chapli Kebab',           'Chapli Kebab',           'BBQ',        560,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800'),
    ('Beef Nihari',            'Beef Nihari',            'Curry',      620,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800'),
    ('Chicken Haleem',         'Chicken Haleem',         'Curry',      380,  false, false, true,  true,  true,  false, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800'),
    ('Daal Chawal',            'Daal Chawal',            'Comfort',    280,  false, true,  true,  false, true,  false, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'),
    ('Chicken Khichdi',        'Chicken Khichdi',        'Comfort',    360,  false, false, true,  true,  true,  false, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'),
    ('Plain Khichdi',          'Plain Khichdi',          'Comfort',    260,  false, true,  true,  false, true,  false, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'),
    ('Daal Soup',              'Daal Soup',              'Soup',       240,  false, true,  true,  false, true,  false, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800'),
    ('Chicken Corn Soup',      'Chicken Corn Soup',      'Soup',       320,  false, false, false, true,  true,  false, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800'),
    ('Grilled Chicken Breast', 'Grilled Chicken Breast', 'Healthy',    740,  false, false, false, true,  true,  false, 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800'),
    ('Chicken Caesar Bowl',    'Chicken Caesar Bowl',    'Healthy',    690,  false, false, false, true,  true,  false, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800'),
    ('Egg White Omelette',     'Egg White Omelette',     'Breakfast',  360,  false, false, false, true,  true,  true,  'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800'),
    ('Masala Omelette',        'Masala Omelette',        'Breakfast',  320,  true,  false, true,  true,  false, true,  'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800'),
    ('Aloo Paratha',           'Aloo Paratha',           'Breakfast',  260,  true,  true,  true,  false, false, true,  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800'),
    ('Chicken Cheese Paratha', 'Chicken Cheese Paratha', 'Breakfast',  420,  true,  false, false, true,  false, true,  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800'),
    ('Plain Paratha with Chai','Plain Paratha with Chai','Breakfast',  210,  false, true,  true,  false, false, true,  'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800'),
    ('Karak Chai',             'Karak Chai',             'Beverage',   120,  false, true,  false, false, false, true,  'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800'),
    ('Doodh Patti',            'Doodh Patti',            'Beverage',   140,  false, true,  false, false, false, true,  'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800'),
    ('Samosa Plate',           'Samosa Plate',           'Snack',      180,  true,  true,  false, false, false, true,  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800'),
    ('Chicken Roll Paratha',   'Chicken Roll Paratha',   'Rolls',      360,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800'),
    ('Zinger Burger',          'Zinger Burger',          'Fast Food',  520,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'),
    ('Beef Smash Burger',      'Beef Smash Burger',      'Fast Food',  680,  false, false, false, true,  false, false, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'),
    ('Chicken Pulao',          'Chicken Pulao',          'Rice',       390,  false, false, true,  true,  false, false, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'),
    ('Kabuli Pulao',           'Kabuli Pulao',           'Rice',       620,  false, false, false, true,  false, false, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'),
    ('Palak Paneer',           'Palak Paneer',           'Vegetarian', 480,  false, true,  true,  true,  true,  false, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'),
    ('Chana Masala',           'Chana Masala',           'Vegetarian', 320,  true,  true,  true,  true,  false, true,  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800'),
    ('Mixed Sabzi',            'Mixed Sabzi',            'Vegetarian', 300,  false, true,  true,  false, true,  false, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'),
    ('Fish Tikka',             'Fish Tikka',             'Seafood',    780,  true,  false, false, true,  true,  false, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'),
    ('Fried Fish',             'Fried Fish',             'Seafood',    720,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'),
    ('Prawn Masala',           'Prawn Masala',           'Seafood',    980,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'),
    ('Club Sandwich',          'Club Sandwich',          'Snack',      460,  false, false, false, true,  false, true,  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800'),
    ('Chicken Shawarma',       'Chicken Shawarma',       'Rolls',      330,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800'),
    ('Fruit Chaat',            'Fruit Chaat',            'Healthy',    260,  false, true,  false, false, true,  true,  'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800'),
    ('Greek Yogurt Bowl',      'Greek Yogurt Bowl',      'Healthy',    520,  false, true,  false, true,  true,  false, 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800'),
    ('Protein Smoothie',       'Protein Smoothie',       'Healthy',    560,  false, true,  false, true,  true,  false, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800'),
    ('Loaded Fries',           'Loaded Fries',           'Fast Food',  440,  true,  true,  false, false, false, false, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800'),
    ('Chicken Wings',          'Chicken Wings',          'Fast Food',  590,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800'),
    ('Kheer Cup',              'Kheer Cup',              'Dessert',    240,  false, true,  true,  false, false, true,  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'),
    ('Gulab Jamun',            'Gulab Jamun',            'Dessert',    220,  false, true,  false, false, false, true,  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'),
    ('Rabri Falooda',          'Rabri Falooda',          'Dessert',    420,  false, true,  false, false, false, true,  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'),
    ('Chicken Handi',          'Chicken Handi',          'Curry',     1050,  true,  false, false, true,  false, false, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'),
    ('Dum Qeema',              'Dum Qeema',              'Curry',      650,  true,  false, true,  true,  false, false, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800')
),

variants(label, price_delta) as (
  values
    ('Classic',       0),
    ('House Special', 90),
    ('Family Taste',  160),
    ('Premium',       240)
),

-- Number each dish×variant combo once so derived columns all share the same rn.
numbered_dishes as (
  select
    row_number() over (order by d.name, v.label) as rn,
    case when v.label = 'Classic' then d.name
         else v.label || ' ' || d.name
    end          as name,
    d.name_urdu,
    d.category,
    (d.base_price + v.price_delta)::integer as price,
    d.spicy,
    d.veg,
    d.homemade,
    d.protein,
    d.light_food,
    d.chai_time,
    d.image_url
  from dish_seed d
  cross join variants v
),

-- Derive all computed columns from the single rn — no repeated window calls.
expanded_dishes as (
  select
    rn,
    name,
    name_urdu,
    category,
    price,
    greatest(3.8, round(4.0 + ((rn % 10)::numeric * 0.09), 1))::numeric(3,1) as rating,
    case
      when chai_time  then '15-20 min'
      when light_food then '20-25 min'
      when protein    then '25-35 min'
      else                 '30-40 min'
    end as delivery_time,
    case
      when rn % 7  = 0 then 15
      when rn % 11 = 0 then 20
      else null
    end::integer as discount,
    spicy    as is_spicy,
    veg      as is_veg,
    homemade as is_homemade,
    (rn % 5 = 0)::boolean as is_ai_recommended,
    concat(
      case when light_food then 'Light and easy option. '    else '' end,
      case when protein    then 'Protein-forward pick. '     else '' end,
      case when chai_time  then 'Great with chai or nashta. ' else '' end,
      case when spicy      then 'Bold spicy flavor.' else 'Mild balanced flavor.' end
    ) as description,
    image_url
  from numbered_dishes
)

insert into foods (
  restaurant_id,
  name,
  name_urdu,
  category,
  price,
  rating,
  delivery_time,
  discount,
  is_spicy,
  is_veg,
  is_homemade,
  is_ai_recommended,
  description,
  image_url
)
select
  nr.id  as restaurant_id,
  ed.name,
  ed.name_urdu,
  ed.category,
  ed.price,
  ed.rating,
  ed.delivery_time,
  ed.discount,
  ed.is_spicy,
  ed.is_veg,
  ed.is_homemade,
  ed.is_ai_recommended,
  ed.description,
  ed.image_url
from expanded_dishes ed
join numbered_restaurants nr on nr.rn = ((ed.rn - 1) % 20) + 1;
