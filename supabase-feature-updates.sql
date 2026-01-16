-- Add category and expiration_date types if they don't exist
-- Note: 'category' is usually just text with app-level validation, but we can make it an enum if preferred.
-- Here we'll use TEXT with a default value.

ALTER TABLE posts 
ADD COLUMN category TEXT DEFAULT 'social',
ADD COLUMN expiration_date TIMESTAMPTZ;

-- Create index for category filtering to speed up queries
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Create index for expiration date queries
CREATE INDEX IF NOT EXISTS idx_posts_expiration ON posts(expiration_date);

-- Comment on columns
COMMENT ON COLUMN posts.category IS 'Activity category: sports, study, food, social, other';
COMMENT ON COLUMN posts.expiration_date IS 'When the activity expires and should be hidden/deleted';
