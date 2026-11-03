/*
# Create profiles table

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references the signed-in user in auth.users)
  - `username` (text)
  - `avatar_url` (text)
  - `bio` (text)
  - `role` (text, default 'member')
  - `bonuses_balance` (integer, default 0)
  - `streak_count` (integer, default 0)
  - `last_claim_date` (timestamptz)
  - `is_verified` (boolean, default false)
  - `has_seen_vip_welcome` (boolean, default false)

2. Security
- Enable RLS on `profiles`.
- Anyone (anon and authenticated) can read all profiles so the public artist showcase works.
- Only the owner can insert, update, or delete their own profile.
- Reward and access columns (role, bonuses_balance, streak_count, last_claim_date, is_verified) cannot be written directly by the client, so users cannot grant themselves roles, verification, or balance.

3. Notes
- Column-level grants limit client writes to username, avatar_url, bio, and has_seen_vip_welcome.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  avatar_url text,
  bio text,
  role text NOT NULL DEFAULT 'member',
  bonuses_balance integer NOT NULL DEFAULT 0,
  streak_count integer NOT NULL DEFAULT 0,
  last_claim_date timestamptz,
  is_verified boolean NOT NULL DEFAULT false,
  has_seen_vip_welcome boolean NOT NULL DEFAULT false
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON profiles FROM anon, authenticated;

GRANT SELECT ON profiles TO anon, authenticated;
GRANT INSERT (id, username, avatar_url, bio, has_seen_vip_welcome) ON profiles TO authenticated;
GRANT UPDATE (username, avatar_url, bio, has_seen_vip_welcome) ON profiles TO authenticated;
GRANT DELETE ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_all_profiles" ON profiles;
CREATE POLICY "select_all_profiles" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);
