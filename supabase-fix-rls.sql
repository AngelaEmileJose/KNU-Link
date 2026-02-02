-- Fix RLS Policies for KNU Link
-- Run this in Supabase SQL Editor if you're getting empty error objects

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Anyone can create posts" ON posts;
DROP POLICY IF EXISTS "Messages are viewable by everyone" ON messages;
DROP POLICY IF EXISTS "Anyone can create messages" ON messages;

-- Disable RLS temporarily to recreate policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Allow anonymous access for reading and inserting
CREATE POLICY "Enable read access for all users" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert for all users" 
  ON profiles FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Posts: Allow anonymous access
CREATE POLICY "Enable read access for all users" 
  ON posts FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert for all users" 
  ON posts FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Enable delete for all users"
  ON posts FOR DELETE
  USING (true);

-- Messages: Allow anonymous access
CREATE POLICY "Enable read access for all users" 
  ON messages FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert for all users" 
  ON messages FOR INSERT 
  WITH CHECK (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('profiles', 'posts', 'messages')
ORDER BY tablename, policyname;
