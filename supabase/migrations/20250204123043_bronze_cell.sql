/*
  # Create boards table

  1. New Tables
    - `boards`
      - `id` (text, primary key) - 6-character board code
      - `displayName` (text) - Name of the board
      - `maxSquaresPerContestant` (integer) - Maximum squares per person
      - `state` (text) - Current board state (setup, choosing, teams, locked)
      - `squares` (jsonb) - Map of positions to contestant names
      - `teams` (jsonb) - Team and number assignments
      - `winners` (jsonb) - Winning squares for each quarter
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `boards` table
    - Add policies for public read/write access
*/

CREATE TABLE IF NOT EXISTS boards (
  id text PRIMARY KEY,
  displayName text,
  maxSquaresPerContestant integer,
  state text,
  squares jsonb DEFAULT '{}'::jsonb,
  teams jsonb,
  winners jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read any board
CREATE POLICY "Boards are publicly readable"
  ON boards
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to create a board
CREATE POLICY "Anyone can create a board"
  ON boards
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to update a board
CREATE POLICY "Anyone can update a board"
  ON boards
  FOR UPDATE
  TO public
  USING (true);