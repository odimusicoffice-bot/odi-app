/*
# Revoke anonymous access from tracks and notes

1. Modified Tables
- `tracks`: removed all table privileges from the `anon` role.
- `notes`: removed all table privileges from the `anon` role.

2. Security
- Only signed-in users (`authenticated`) can reach these tables. Row-level policies still limit each user to their own rows.

3. Notes
- Project defaults granted `anon` full access to new public tables. This migration removes it so that logged-out visitors cannot read or write private data.
*/

REVOKE ALL ON tracks FROM anon;
REVOKE ALL ON notes FROM anon;
