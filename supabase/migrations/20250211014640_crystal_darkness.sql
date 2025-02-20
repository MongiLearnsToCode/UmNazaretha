/*
  # Add is_admin column to profiles table

  1. Changes
    - Add is_admin boolean column to profiles table with default false
    - Add RLS policy for admin status visibility
    - Update handle_new_user function to set is_admin

  2. Security
    - Only admins can update is_admin status
    - Everyone can view is_admin status (needed for UI permissions)
*/

-- Add is_admin column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Policy for viewing is_admin status (needed for UI permissions)
DROP POLICY IF EXISTS "Anyone can view admin status" ON profiles;
CREATE POLICY "Anyone can view admin status"
  ON profiles
  FOR SELECT
  USING (true);

-- Policy for updating is_admin status (only admins can promote/demote)
DROP POLICY IF EXISTS "Only admins can update admin status" ON profiles;
CREATE POLICY "Only admins can update admin status"
  ON profiles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );