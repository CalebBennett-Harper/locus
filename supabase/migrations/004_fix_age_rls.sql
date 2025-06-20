-- Fix RLS policies after adding age field
-- This ensures the policies work correctly with the new age column

-- Temporarily disable RLS to ensure clean state
ALTER TABLE waitlist_signups DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Admin full access" ON waitlist_signups;
DROP POLICY IF EXISTS "Public can signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Authenticated can signup" ON waitlist_signups;

-- Recreate admin policy
CREATE POLICY "Admin full access" ON waitlist_signups
    FOR ALL 
    TO authenticated
    USING (
        auth.jwt() ->> 'email' = 'caleb@calebharp.com'
        OR auth.jwt() ->> 'email' = 'admin@locus.app'
    );

-- Recreate public signup policies with explicit column permissions
CREATE POLICY "Public can signup" ON waitlist_signups
    FOR INSERT 
    TO anon, public
    WITH CHECK (true);

CREATE POLICY "Authenticated can signup" ON waitlist_signups
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Refresh permissions
GRANT INSERT ON waitlist_signups TO anon;
GRANT INSERT ON waitlist_signups TO public;
GRANT ALL ON waitlist_signups TO authenticated; 