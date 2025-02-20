/*
  # Set admin user

  1. Changes
    - Set admin status for specific user
  
  2. Security
    - Only updates single user record
*/

DO $$ 
BEGIN
  UPDATE profiles 
  SET is_admin = true 
  WHERE id = '25df391b-6926-47ab-bc7b-3750a4294b6f';
END $$;