-- Locus Waitlist Initial Schema
-- This migration creates the basic waitlist_signups table

-- Create the waitlist_signups table
CREATE TABLE waitlist_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    occupation TEXT NOT NULL,
    university TEXT,
    cities TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    linkedin_url TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_waitlist_signups_email ON waitlist_signups(email);
CREATE INDEX idx_waitlist_signups_status ON waitlist_signups(status);
CREATE INDEX idx_waitlist_signups_created_at ON waitlist_signups(created_at);
CREATE INDEX idx_waitlist_signups_linkedin ON waitlist_signups(linkedin_url);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
-- Note: Replace 'your-admin-email@domain.com' with your actual admin email
CREATE POLICY "Admin can do everything" ON waitlist_signups
    FOR ALL USING (auth.jwt() ->> 'email' = 'your-admin-email@domain.com');

-- Create policy for public signup (insert only)
CREATE POLICY "Anyone can signup" ON waitlist_signups
    FOR INSERT WITH CHECK (true);

-- Optional: Create a view for public statistics (no personal data)
CREATE VIEW public_stats AS
SELECT 
    COUNT(*) as total_signups,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_signups,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_count
FROM waitlist_signups; 