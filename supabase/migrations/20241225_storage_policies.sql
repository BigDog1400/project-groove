-- Create shareable-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('shareable-images', 'shareable-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow edge functions (service_role) to upload images
CREATE POLICY "Edge Function can upload images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'shareable-images');

-- Policy to allow public to read images
CREATE POLICY "Public can view shareable images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'shareable-images');

-- Policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'shareable-images');

-- Policy to allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'shareable-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
); 