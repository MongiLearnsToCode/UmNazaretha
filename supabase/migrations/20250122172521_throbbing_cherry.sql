/*
  # Channel Scheduler Schema

  1. New Tables
    - `shows`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `duration` (interval)
      - `video_path` (text)
      - `thumbnail_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `schedule_items`
      - `id` (uuid, primary key)
      - `show_id` (uuid, foreign key)
      - `day_of_week` (int)
      - `start_time` (time)
      - `end_time` (time)
      - `is_recurring` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Shows table
CREATE TABLE IF NOT EXISTS shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration interval NOT NULL,
  video_path text NOT NULL,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Schedule items table
CREATE TABLE IF NOT EXISTS schedule_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id uuid REFERENCES shows(id) ON DELETE CASCADE,
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_recurring boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Enable RLS
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_items ENABLE ROW LEVEL SECURITY;

-- Policies for shows
CREATE POLICY "Shows are viewable by everyone"
  ON shows FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage shows"
  ON shows FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies for schedule_items
CREATE POLICY "Schedule items are viewable by everyone"
  ON schedule_items FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage schedule items"
  ON schedule_items FOR ALL
  USING (auth.role() = 'authenticated');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_shows_updated_at
  BEFORE UPDATE ON shows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_items_updated_at
  BEFORE UPDATE ON schedule_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();