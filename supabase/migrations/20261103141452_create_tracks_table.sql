/*
# Create tracks table

1. New Tables
- `tracks`
  - `id` (uuid, primary key)
  - `user_id` (uuid, owner, defaults to the signed-in user, deleted with the account)
  - `title` (text)
  - `file_url` (text)
  - `bpm` (integer)
  - `key` (text)
  - `status` (text, default 'demo')

2. Security
- Enable RLS on `tracks`.
- Signed-in users can only read, add, change, and delete their own tracks.

3. Notes
- Index on `user_id` for fast lookup of a user's tracks.
*/

CREATE TABLE IF NOT EXISTS tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  file_url text,
  bpm integer,
  key text,
  status text NOT NULL DEFAULT 'demo'
);

CREATE INDEX IF NOT EXISTS tracks_user_id_idx ON tracks (user_id);

ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON tracks TO authenticated;

DROP POLICY IF EXISTS "select_own_tracks" ON tracks;
CREATE POLICY "select_own_tracks" ON tracks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_tracks" ON tracks;
CREATE POLICY "insert_own_tracks" ON tracks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_tracks" ON tracks;
CREATE POLICY "update_own_tracks" ON tracks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_tracks" ON tracks;
CREATE POLICY "delete_own_tracks" ON tracks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
