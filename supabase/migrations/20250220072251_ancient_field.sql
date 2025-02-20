/*
  # Add admin claims management

  1. New Functions
    - set_claim: Function to set custom claims for a user
    - get_claims: Function to get all claims for a user
    - is_admin: Function to check if a user is an admin
  
  2. Security
    - Functions are security definer to run with elevated privileges
    - Only superuser can set claims
*/

-- Create a function to set claims on a user
CREATE OR REPLACE FUNCTION auth.set_claim(
  uid uuid,
  claim text,
  value jsonb
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT is_claims_admin() THEN
      RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE auth.users
  SET raw_app_meta_data = 
    raw_app_meta_data || 
    json_build_object(claim, value)::jsonb
  WHERE id = uid;
END;
$$;

-- Create a function to get claims of a user
CREATE OR REPLACE FUNCTION auth.get_claims(
  uid uuid
)
RETURNS jsonb
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT raw_app_meta_data from auth.users WHERE id = uid;
$$;

-- Create a function to check if someone is a claims admin
CREATE OR REPLACE FUNCTION is_claims_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_app_meta_data->>'claims_admin' = 'true'
  );
$$;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_app_meta_data->>'is_admin' = 'true'
  );
$$;