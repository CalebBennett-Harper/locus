-- Fix public signup RLS policies
-- Ensure anon users can definitely insert into waitlist_signups

-- Drop and recreate the public signup policy with more explicit permissions
DROP POLICY IF EXISTS "Public can signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Authenticated can signup" ON waitlist_signups;

-- Create a single, clear policy for public inserts
CREATE POLICY "allow_public_inserts" ON waitlist_signups
    FOR INSERT 
    TO anon, public, authenticated
    WITH CHECK (true);

-- Ensure the anon role has explicit insert permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON waitlist_signups TO anon;
GRANT INSERT ON waitlist_signups TO public;

-- Double-check that RLS is properly enabled
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY; 