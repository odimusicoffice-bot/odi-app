/*
# Add cover image and track timestamp columns

1. Modified Tables
- `profiles`: new `cover_url` (text) column for the profile cover image. Client may update it, same as `avatar_url`.
- `tracks`: new `created_at` (timestamptz, defaults to now) so the Cloud page can list newest tracks first.

2. Security
- No new policies. Existing owner-only policies and column grants still apply; `cover_url` is added to the profile columns the owner may update.

3. Notes
- Both changes are additive and keep existing data. Safe to re-run.
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_url text;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

GRANT UPDATE (cover_url) ON profiles TO authenticated;
