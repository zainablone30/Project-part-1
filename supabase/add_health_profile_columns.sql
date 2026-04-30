-- Run this in your Supabase SQL Editor
-- Adds allergies and profile_completed columns to the profiles table

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS allergies text[] DEFAULT '{}'::text[];

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS profile_completed boolean DEFAULT false;
