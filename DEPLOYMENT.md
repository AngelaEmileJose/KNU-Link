# KNU Link - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### Step 1: Prepare Your Repository
Your code is already pushed to: https://github.com/AngelaEmileJose/KNU-Link ✅

### Step 2: Go to Vercel
1. Visit https://vercel.com
2. Click **"Sign Up"** or **"Log In"** with GitHub
3. Authorize Vercel to access your GitHub account

### Step 3: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find **"AngelaEmileJose/KNU-Link"** in the list
3. Click **"Import"**

### Step 4: Configure Project
**Framework Preset:** Next.js (auto-detected) ✓  
**Root Directory:** `./` (default) ✓  
**Build Command:** `npm run build` (auto-detected) ✓  
**Output Directory:** `.next` (auto-detected) ✓

### Step 5: Add Environment Variables
Click **"Environment Variables"** and add these two:

```
NEXT_PUBLIC_SUPABASE_URL = your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key
```

**Where to find these:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** → **API**
4. Copy **Project URL** → Paste as `NEXT_PUBLIC_SUPABASE_URL`
5. Copy **anon public** key → Paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 6: Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://knu-link-xyz.vercel.app`

---

## 🔧 Post-Deployment Configuration

### Update Supabase Redirect URLs
After deployment, add your Vercel URL to Supabase:

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**: `https://your-app.vercel.app`
3. Add to **Redirect URLs**: `https://your-app.vercel.app/**`
4. Click **Save**

### Run SQL Migration
If you haven't already, run `supabase-participations.sql` in Supabase SQL Editor to enable My Chats tracking.

---

## ✅ Testing Your Deployment

1. Visit your Vercel URL
2. Test login flow with existing Student ID
3. Create a new user and verify profile saves
4. Join an activity and check real-time features
5. Test My Chats page
6. Verify logout and re-login works

---

## 🔄 Future Updates

After making changes locally:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will **automatically redeploy** your app! 🎉

---

## 🆘 Troubleshooting

**Build fails?**
- Check environment variables are set correctly
- Review build logs in Vercel dashboard

**Features not working?**
- Verify Supabase environment variables
- Check Supabase redirect URLs include your Vercel domain
- Check browser console for errors

**Need custom domain?**
- Go to Vercel project → **Settings** → **Domains**
- Add your custom domain and follow DNS instructions

---

## 📊 Your Deployment URL
After deployment, you'll get a URL. Save it here:

**Production URL:** `_________________________`

Share it with KNU students and start connecting! 🎊
