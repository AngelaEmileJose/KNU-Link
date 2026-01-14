# Supabase Database Setup Instructions

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your **knu-link** project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

## Step 2: Run the Schema

1. Open the file `supabase-schema.sql` in this project directory
2. Copy ALL the SQL content
3. Paste it into the Supabase SQL Editor
4. Click **Run** or press `Ctrl+Enter`

You should see a success message indicating that the tables were created.

## Step 3: Verify Tables Created

1. Go to **Table Editor** in the left sidebar
2. You should see 3 new tables:
   - `profiles` (user information)
   - `posts` (activity posts)
   - `messages` (chat messages)

## Step 4: Test the App

1. Make sure your dev server is running: `npm run dev`
2. Open http://localhost:3000
3. Create a new account with emoji selection
4. Create a post
5. Open the app in another browser/incognito tab
6. Create another account
7. You should see the post you created!
8. Join the chat and send messages - they should sync in real-time!

## Security Notes ✅

- ✅ **API Key Protected**: Your Supabase credentials are in `.env.local` which is gitignored
- ✅ **Row Level Security**: RLS policies ensure users can only read/write their own data
- ✅ **Anonymous Auth**: No email required - only Student ID for verification
- ✅ **Emoji Privacy**: Users identified only by emoji and nickname, never real names

## Real-time Features

- **New Posts**: Automatically appear in everyone's feed
- **Chat Messages**: Sync instantly across all users in the same chatroom
- **No Refresh Needed**: All updates happen automatically via Supabase subscriptions

## Free Tier Limits (More than enough for KNU!)

- 500MB database storage
- 2GB file storage  
- 50,000 monthly active users
- Unlimited API requests
- Real-time subscriptions included

Your KNU Link app is now production-ready with a real backend! 🎉
