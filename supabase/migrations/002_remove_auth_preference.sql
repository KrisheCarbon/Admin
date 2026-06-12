-- Run in Supabase SQL editor to remove stored login preference.
-- Login method is chosen on the UI each time (password or OTP).

ALTER TABLE public.users DROP COLUMN IF EXISTS auth_preference;
