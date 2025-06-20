-- Fix RLS Policies for Waitlist Signups
-- This migration fixes the RLS policies to allow public signups

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Admin can do everything" ON waitlist_signups;
DROP POLICY IF EXISTS "Anyone can signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Authenticated users can signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Users can read their own signups" ON waitlist_signups;

-- Create a simple policy for admin access using the admin email from environment
-- We'll check this against the NEXT_PUBLIC_ADMIN_EMAIL that should be set
CREATE POLICY "Admin full access" ON waitlist_signups
    FOR ALL 
    TO authenticated
    USING (
        auth.jwt() ->> 'email' = 'caleb@calebharp.com'
        OR auth.jwt() ->> 'email' = 'admin@locus.app'
    );

-- Create policy for public signups - allow anonymous users to insert
CREATE POLICY "Public can signup" ON waitlist_signups
    FOR INSERT 
    TO anon, public
    WITH CHECK (true);

-- Allow authenticated users to also insert
CREATE POLICY "Authenticated can signup" ON waitlist_signups
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Grant necessary permissions
GRANT INSERT ON waitlist_signups TO anon;
GRANT INSERT ON waitlist_signups TO public;
GRANT ALL ON waitlist_signups TO authenticated; 