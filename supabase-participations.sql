-- Add participations table to track which users joined which activities
-- Run this in Supabase SQL Editor

CREATE TABLE participations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Enable Row Level Security
ALTER TABLE participations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own participations"
  ON participations FOR SELECT
  USING (true);

CREATE POLICY "Users can create participations"
  ON participations FOR INSERT
  WITH CHECK (true);

-- Index for better performance
CREATE INDEX idx_participations_user_id ON participations(user_id);
CREATE INDEX idx_participations_post_id ON participations(post_id);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE participations;
