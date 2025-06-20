-- Add age field to waitlist_signups table
-- This migration adds an age column with constraints for 18-25 range

-- Add the age column
ALTER TABLE waitlist_signups 
ADD COLUMN age INTEGER;

-- Add constraint to ensure age is between 18-25
ALTER TABLE waitlist_signups 
ADD CONSTRAINT check_age_range CHECK (age >= 18 AND age <= 25);

-- Create index for better performance when filtering by age
CREATE INDEX idx_waitlist_signups_age ON waitlist_signups(age); 