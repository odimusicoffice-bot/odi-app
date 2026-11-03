/*
# Create storage buckets for avatars and tracks

1. New Buckets
- `avatars`: public bucket for profile pictures and cover images. Images only (JPEG, PNG, WebP, GIF), up to 5 MB.
- `tracks`: public bucket for audio files uploaded from the Cloud page. Audio only (MP3, WAV, AIFF, FLAC, OGG, M4A), up to 100 MB.

2. Security (storage.objects policies)
- Anyone can view avatar files so the artist showcase works.
- Signed-in users can upload, update, and delete files only inside their own folder: the first path segment must equal their user id (for example `avatars/<user_id>/file.jpg`).
- Signed-in users can list their own track files. Track files are reachable by direct link, so they are not listed to the public.

3. Notes
- Policies are dropped and recreated so this migration can be re-run safely.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('tracks', 'tracks', true, 104857600, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/aiff', 'audio/x-aiff', 'audio/flac', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "avatars_public_select" ON storage.objects;
CREATE POLICY "avatars_public_select" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_insert_own_folder" ON storage.objects;
CREATE POLICY "avatars_insert_own_folder" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "avatars_update_own_folder" ON storage.objects;
CREATE POLICY "avatars_update_own_folder" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "avatars_delete_own_folder" ON storage.objects;
CREATE POLICY "avatars_delete_own_folder" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "tracks_select_own_folder" ON storage.objects;
CREATE POLICY "tracks_select_own_folder" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'tracks' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "tracks_insert_own_folder" ON storage.objects;
CREATE POLICY "tracks_insert_own_folder" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'tracks' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "tracks_update_own_folder" ON storage.objects;
CREATE POLICY "tracks_update_own_folder" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'tracks' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'tracks' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "tracks_delete_own_folder" ON storage.objects;
CREATE POLICY "tracks_delete_own_folder" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'tracks' AND (storage.foldername(name))[1] = auth.uid()::text);
