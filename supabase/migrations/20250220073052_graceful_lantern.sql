/*
  # Setup initial claims admin
  
  1. Changes
    - Set claims_admin flag for initial admin user
    - Set is_admin flag for initial admin user
  
  Note: This migration should only be run once to bootstrap the claims system
*/

-- Set up the initial claims admin and admin user directly
UPDATE auth.users
SET raw_app_meta_data = 
  COALESCE(raw_app_meta_data, '{}'::jsonb) || 
  json_build_object(
    'claims_admin', true,
    'is_admin', true
  )::jsonb
WHERE id = '25df391b-6926-47ab-bc7b-3750a4294b6f';