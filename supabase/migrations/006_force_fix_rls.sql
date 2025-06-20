-- Nuclear option: Completely reset RLS policies for waitlist_signups
-- This should definitely fix the public signup issue

-- Disable RLS temporarily
ALTER TABLE waitlist_signups DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "allow_admin_all" ON waitlist_signups;
DROP POLICY IF EXISTS "allow_all_inserts" ON waitlist_signups;
DROP POLICY IF EXISTS "Admin full access" ON waitlist_signups;
DROP POLICY IF EXISTS "Public can signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Authenticated can signup" ON waitlist_signups;
DROP POLICY IF EXISTS "allow_public_inserts" ON waitlist_signups;

-- Re-enable RLS
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create admin policy (for authenticated users)
CREATE POLICY "admin_access" ON waitlist_signups
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create public INSERT policy (for anyone to sign up)
CREATE POLICY "public_insert" ON waitlist_signups
    FOR INSERT 
    TO anon, public
    WITH CHECK (true);

-- Create authenticated INSERT policy (backup)
CREATE POLICY "auth_insert" ON waitlist_signups
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Ensure permissions are granted
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO public;
GRANT INSERT ON waitlist_signups TO anon;
GRANT INSERT ON waitlist_signups TO public;
GRANT ALL ON waitlist_signups TO authenticated; 