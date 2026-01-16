# KNU Link - Anonymous Social Discovery App

> **Connect anonymously with KNU students to find activity partners**

![KNU Link](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-2.90.1-3ecf8e?style=flat&logo=supabase)

**Live Demo:** [https://knu-link.vercel.app](https://knu-link.vercel.app)  
**Repository:** [https://github.com/AngelaEmileJose/KNU-Link](https://github.com/AngelaEmileJose/KNU-Link)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Development Process](#development-process)
- [File Documentation](#file-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

**KNU Link** is an anonymous social discovery application designed specifically for Kyungpook National University students. The app helps students find activity partners (study groups, sports, hobbies, etc.) while maintaining anonymity through emoji-based profiles. It features a Tinder-style swipe interface, real-time chat, and persistent user sessions.

### Problem Statement
Students often struggle to find partners for activities due to social anxiety or introversion. KNU Link solves this by:
- Providing anonymous profiles with emoji avatars
- Offering intuitive swipe gestures for quick decisions
- Enabling real-time communication after matching

---

## ✨ Features

### 1. **Persistent User Sessions**
- Two-step login flow (Student ID → Profile lookup)
- Auto-detection of returning vs new users
- Automatic login from stored sessions
- Secure logout with account switching

### 2. **Anonymous Profiles with KNU Mascot Icons**
- Student ID verification (not shown to others)
- Custom nickname and gender
- **20 unique KNU mascot characters** to choose from:
  - **Original Set**: Flag Bearer, Musician, Traveler, Scientist, Soccer Player
  - **Personality Set**: DJ, Romantic, Champion, Activist, Eco Warrior
  - **Environmental Set**: Animal Lover, Nature Lover, Ocean Saver, Earth Protector
  - **Sports & Lifestyle Set**: Fitness, Foodie, Swimmer, Basketball, Soccer Fan, Football
- Scrollable mascot selection grid for easy browsing
- Profile stored in Supabase with localStorage caching
- Backward compatible with legacy emoji icons

### 3. **Tinder-Style Activity Feed**
- Swipe left to **skip** an activity
- Swipe right to **join** an activity
- Skip/Join buttons as reliable alternatives
- Smooth drag with rotation animation
- Real-time activity updates via Supabase

### 4. **My Chats Page**
- View all joined activities
- Quick navigation to chatrooms
- Participation tracking in database
- Empty state with "Browse Activities" CTA

### 5. **Real-Time Chat**
- Instant messaging with activity participants
- Supabase real-time subscriptions
- Message persistence in PostgreSQL
- Activity details in chat header

### 6. **Activity Creation**
- Create new activity posts
- Specify time, location, and description
- Choose emoji icon for the activity
- Instant publishing to feed

---

## 🛠 Technology Stack

### **Frontend Framework**
- **Next.js 16.1.1** - React framework with server-side rendering and routing
- **React 19.2.3** - UI library for building component-based interfaces
- **TypeScript 5** - Type-safe JavaScript for better development experience

### **Styling**
- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **PostCSS** - CSS preprocessor for Tailwind compilation
- **Custom Design System** - KNU brand colors (#8B1538 crimson)

### **Backend & Database**
- **Supabase 2.90.1** - Backend-as-a-Service with PostgreSQL database
  - Realtime subscriptions for live updates
  - Row Level Security (RLS) for data protection
  - RESTful API for data operations

### **UI Icons**
- **Lucide React 0.562.0** - Beautiful & consistent icon library
  - Used for: Plus, MessageCircle, MessagesSquare, X, Check, LogOut icons

### **Development Tools**
- **ESLint 9** - Code linting for consistent code style
- **eslint-config-next** - Next.js-specific ESLint configuration

### **Deployment**
- **Vercel** - Serverless deployment platform optimized for Next.js
- **GitHub** - Version control and CI/CD integration

---

## 📁 Project Structure

```
knu-link/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Login/Registration page (two-step flow)
│   ├── feed/
│   │   └── page.tsx              # Activity feed with swipe interface
│   ├── chats/
│   │   └── page.tsx              # My Chats page (joined activities)
│   ├── chat/
│   │   └── [id]/
│   │       └── page.tsx          # Real-time chat interface
│   ├── create/
│   │   └── page.tsx              # Activity creation form
│   ├── types.ts                  # TypeScript type definitions
│   ├── layout.tsx                # Root layout with metadata
│   └── globals.css               # Global styles and Tailwind directives
│
├── components/
│   └── ProfileMenu.tsx           # User profile dropdown with logout
│
├── lib/
│   └── supabase.ts               # Supabase client configuration
│
├── public/                       # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .env.local                    # Environment variables (gitignored)
├── .gitignore                    # Git ignore rules
├── DEPLOYMENT.md                 # Vercel deployment guide
├── NEW_FEATURES.md               # Feature implementation notes
├── README.md                     # This file
├── SUPABASE_SETUP.md            # Database setup instructions
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── next-env.d.ts                 # Next.js TypeScript declarations
├── package.json                  # NPM dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── postcss.config.mjs            # PostCSS configuration for Tailwind
├── supabase-participations.sql   # SQL migration for participations table
├── supabase-schema.sql           # Complete database schema
├── tsconfig.json                 # TypeScript compiler configuration
└── vercel.json                   # Vercel deployment settings
```

---

## 🚀 Installation & Setup

### **Prerequisites**
- **Node.js** 20.x or higher
- **npm** (comes with Node.js)
- **Supabase account** (free tier available)
- **Git** for version control

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/AngelaEmileJose/KNU-Link.git
cd KNU-Link
```

### **Step 2: Install Dependencies**
```bash
npm install
```

This command installs all packages specified in `package.json`:
- **Production dependencies** (Next.js, React, Supabase, Lucide)
- **Development dependencies** (TypeScript, Tailwind, ESLint)

### **Step 3: Set Up Supabase**

1. **Create a Supabase Project**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Click **"New Project"**
   - Name it "KNU-Link"
   - Choose a strong database password
   - Select a region close to your users
   - Click **"Create new project"**

2. **Run Database Migrations**
   - Navigate to **SQL Editor** in Supabase dashboard
   - Open `supabase-schema.sql` from the project
   - Copy the contents and paste into SQL Editor
   - Click **"Run"** to create tables (profiles, posts, messages)
   - Open `supabase-participations.sql`
   - Copy and run this SQL to create the participations table

3. **Get API Credentials**
   - Go to **Settings** → **API**
   - Copy **Project URL**
   - Copy **anon public** key

### **Step 4: Configure Environment Variables**

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Never commit `.env.local` to Git (it's already in `.gitignore`)

### **Step 5: Start Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app!

---

## 🔨 Development Process

### **Phase 1: Project Initialization**

**Command:**
```bash
npx create-next-app@latest knu-link
```

**Selections:**
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ App Router
- ❌ src/ directory
- ✅ Import alias (@/*)

This command created the initial project structure with Next.js 16, React 19, and Tailwind CSS 4.

### **Phase 2: Installing Dependencies**

**Supabase Client:**
```bash
npm install @supabase/supabase-js
```
- Purpose: Backend communication, realtime subscriptions, database operations
- Version: 2.90.1 (latest stable)

**Lucide Icons:**
```bash
npm install lucide-react
```
- Purpose: Consistent, customizable SVG icons
- Icons used: Plus, MessageCircle, MessagesSquare, X, Check, LogOut

### **Phase 3: Authentication System**

**Files Created:**
- `app/page.tsx` - Login and registration page
- `lib/supabase.ts` - Supabase client initialization
- `app/types.ts` - TypeScript interfaces for User, Post, Message

**Features Implemented:**
1. Two-step login flow:
   - Step 1: Enter Student ID
   - Step 2a: If ID exists → Load profile → Redirect
   - Step 2b: If ID doesn't exist → Registration form → Emoji selection
2. Auto-login from localStorage on app load
3. Profile data validation and storage

**Database Table:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  gender TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Phase 4: Activity Feed**

**File Created:**
- `app/feed/page.tsx` - Main feed with swipe interface

**Features Implemented:**
1. **Swipe Gestures:**
   - Used Pointer Events API (onPointerDown, onPointerMove, onPointerUp)
   - Why? More reliable than touch/mouse events, works across all devices
   - Drag offset calculation: `currentX - startX`
   - Rotation effect: `dragOffset * 0.1` degrees
   - Threshold: 100px to trigger action

2. **State Management:**
   - `useState` for current post index, drag offset, swipe direction
   - `useEffect` for fetching posts and realtime subscriptions
   - `useRef` for storing start position without re-renders

3. **Realtime Updates:**
```typescript
supabase
  .channel('posts')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'posts' },
    (payload) => {
      // Update posts array when database changes
    }
  )
  .subscribe();
```

**Database Table:**
```sql
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  nickname TEXT NOT NULL,
  icon TEXT NOT NULL,
  activity TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Phase 5: Real-Time Chat**

**File Created:**
- `app/chat/[id]/page.tsx` - Dynamic route for each chatroom

**Features Implemented:**
1. **Message Display:**
   - Fetch existing messages on load
   - Render messages in chronological order
   - Differentiate user's messages vs others

2. **Message Sending:**
```typescript
const handleSendMessage = async () => {
  await supabase
    .from('messages')
    .insert([{
      post_id: postId,
      user_id: user.id,
      nickname: user.nickname,
      icon: user.icon,
      content: newMessage
    }]);
};
```

3. **Realtime Subscriptions:**
```typescript
supabase
  .channel(`chat-${postId}`)
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages',
      filter: `post_id=eq.${postId}` },
    (payload) => {
      setMessages(prev => [...prev, payload.new]);
    }
  )
  .subscribe();
```

**Database Table:**
```sql
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id),
  user_id UUID REFERENCES profiles(id),
  nickname TEXT NOT NULL,
  icon TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Phase 6: My Chats Feature**

**Files Created:**
- `app/chats/page.tsx` - List of joined activities
- `supabase-participations.sql` - New table migration

**Features Implemented:**
1. **Participation Tracking:**
   - Record when user joins an activity
   - Prevent duplicate joins with UNIQUE constraint
   - Index for performance: `idx_participations_user_id`

2. **Fetching Joined Activities:**
```typescript
// Get participation records
const { data: participations } = await supabase
  .from('participations')
  .select('post_id')
  .eq('user_id', user.id);

// Get the actual posts
const postIds = participations.map(p => p.post_id);
const { data: posts } = await supabase
  .from('posts')
  .select('*')
  .in('id', postIds);
```

**Database Table:**
```sql
CREATE TABLE participations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);
```

### **Phase 7: Session Management**

**Files Created/Modified:**
- `components/ProfileMenu.tsx` - Profile dropdown component
- `app/page.tsx` - Enhanced with auto-login
- `app/feed/page.tsx` - Integrated ProfileMenu

**Features Implemented:**
1. **Auto-Login:**
```typescript
useEffect(() => {
  const sessionData = localStorage.getItem("user");
  if (sessionData) {
    const user = JSON.parse(sessionData);
    // Verify user still exists in Supabase
    supabase.from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) {
          router.push("/feed");
        } else {
          localStorage.removeItem("user");
        }
      });
  }
}, []);
```

2. **Profile Menu:**
   - Click-outside detection to close menu
   - Display user details (icon, nickname, student ID, gender)
   - Logout button clears localStorage and redirects

### **Phase 8: Deployment**

**Commands:**
```bash
# Build production version
npm run build

# Test production build locally
npm start
```

**Vercel Deployment:**
1. Created `vercel.json` configuration
2. Pushed code to GitHub
3. Connected repository to Vercel
4. Added environment variables in Vercel dashboard
5. Deployed automatically

**Post-Deployment:**
- Updated Supabase redirect URLs to include Vercel domain
- Tested all features on production
- Verified realtime subscriptions work

---

## 📄 File Documentation

### **Core Application Files**

#### `app/page.tsx` (539 lines)
**Purpose:** Login and registration page with two-step flow

**Key Functions:**
- `handleStudentIdSubmit()` - Check if Student ID exists in Supabase
- `handleRegisterSubmit()` - Validate nickname and proceed to emoji selection
- `handleSelectEmoji()` - Create new user profile in database
- `useEffect()` - Auto-login check on component mount

**States:**
- `step` - Current step: "studentId" | "register" | "selectEmoji"
- `studentId`, `nickname`, `gender`, `selectedEmoji` - Form data
- `loading`, `error` - UI feedback states
- `welcomeBack` - Show welcome screen for returning users

**Flow:**
1. User enters Student ID
2. Query Supabase for existing profile
3. If found → Welcome back → Auto-login
4. If not found → Show registration form
5. Collect nickname and gender
6. Show emoji selection grid
7. Create profile in Supabase
8. Store in localStorage
9. Redirect to feed

---

#### `app/feed/page.tsx` (345 lines)
**Purpose:** Main activity feed with Tinder-style swipe interface

**Key Functions:**
- `handlePointerDown()` - Start drag, capture pointer
- `handlePointerMove()` - Track drag offset
- `handlePointerUp()` - End drag, determine swipe direction
- `resetCard()` - Move to next post after swipe
- `enterChatroom()` - Join activity and navigate to chat
- `fetchPosts()` - Load activities from Supabase
- Realtime subscription for new posts

**States:**
- `posts` - Array of all activities
- `currentPostIndex` - Which post is currently shown
- `dragOffset` - Horizontal drag distance in pixels
- `isDragging` - Whether user is currently swiping
- `swipeDirection` - "left" (skip) | "right" (join) | null
- `user` - Current user from localStorage

**UI Components:**
- Header with "My Chats" and "Create" buttons
- ProfileMenu for logout
- Draggable activity card with drag indicators
- Skip/Join buttons
- Confirmation screens for both actions
- Empty state when all posts are viewed

**Pointer Events:**
```typescript
onPointerDown={handlePointerDown}
onPointerMove={handlePointerMove}
onPointerUp={handlePointerUp}
onPointerCancel={handlePointerUp}
```

---

#### `app/chats/page.tsx` (171 lines)
**Purpose:** Display list of activities the user has joined

**Key Functions:**
- `fetchJoinedActivities()` - Get user's participations and corresponding posts
- Navigation to individual chatrooms

**Query Logic:**
```typescript
// Step 1: Get participation IDs
const { data: participations } = await supabase
  .from('participations')
  .select('post_id')
  .eq('user_id', user.id);

// Step 2: Get the actual posts
const postIds = participations.map(p => p.post_id);
const { data: posts } = await supabase
  .from('posts')
  .select('*')
  .in('id', postIds)
  .order('created_at', { ascending: false });
```

**UI Components:**
- Header with back button
- Loading spinner
- Empty state (no chats yet)
- List of joined activities
- "Browse Activities" CTA button

---

#### `app/chat/[id]/page.tsx` (242 lines)
**Purpose:** Real-time chat interface for specific activity

**Key Functions:**
- `fetchMessages()` - Load existing messages
- `handleSendMessage()` - Send new message to Supabase
- `scrollToBottom()` - Auto-scroll on new messages
- Realtime subscription for new messages
- Participation tracking on enter

**Message Flow:**
1. User types message
2. Click send or press Enter
3. Insert into Supabase messages table
4. Realtime subscription triggers
5. New message appears for all users
6. Auto-scroll to bottom

**Participation Tracking:**
```typescript
useEffect(() => {
  const trackParticipation = async () => {
    await supabase
      .from('participations')
      .insert([{ user_id: user.id, post_id: postId }]);
  };
  trackParticipation();
}, []);
```

---

#### `app/create/page.tsx` (155 lines)
**Purpose:** Form to create new activity posts

**Key Functions:**
- `handleSubmit()` - Validate and insert post into Supabase
- Form validation for required fields
- Loading states during submission

**Form Fields:**
- Activity name (required)
- Time (required)
- Location (optional)
- Emoji icon selection (required)

**Database Insert:**
```typescript
const { data, error } = await supabase
  .from('posts')
  .insert([{
    user_id: user.id,
    nickname: user.nickname,
    icon: selectedIcon,
    activity: activity,
    time: time,
    location: location
  }])
  .select()
  .single();
```

---

#### `components/ProfileMenu.tsx` (72 lines)
**Purpose:** Dropdown menu showing user profile and logout option

**Key Features:**
- Click-outside detection to close menu
- Display user icon, nickname, Student ID, gender
- Logout button

**Click-Outside Logic:**
```typescript
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }
  if (isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isOpen]);
```

**Logout:**
```typescript
const handleLogout = () => {
  localStorage.removeItem("user");
  router.push("/");
};
```

---

### **Configuration Files**

#### `lib/supabase.ts` (6 lines)
**Purpose:** Initialize and export Supabase client

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Why environment variables?**
- Security: Credentials not hardcoded
- Flexibility: Different values for dev/prod
- Next.js requires `NEXT_PUBLIC_` prefix for client-side access

---

#### `app/types.ts` (20 lines)
**Purpose:** TypeScript type definitions for data structures

```typescript
export interface User {
  id: string;
  studentId: string;
  nickname: string;
  gender: "male" | "female" | "other";
  icon: string;
  joinedActivities: number[];
}

export interface Post {
  id: number;
  user_id: string;
  nickname: string;
  icon: string;
  activity: string;
  time: string;
  location?: string;
  created_at: string;
}

export interface Message {
  id: number;
  post_id: number;
  user_id: string;
  nickname: string;
  icon: string;
  content: string;
  created_at: string;
}
```

**Benefits:**
- Autocomplete in IDE
- Type checking at compile time
- Better error messages

---

#### `app/globals.css` (30 lines)
**Purpose:** Global styles and Tailwind directives

```css
@import "tailwindcss";

@theme {
  --color-knu-crimson: #8B1538;
  --color-knu-crimson-dark: #6B1028;
}
```

**Custom Colors:**
- `knu-crimson` (#8B1538) - Primary brand color
- `knu-crimson-dark` (#6B1028) - Hover states

**Usage:** `className="bg-knu-crimson text-white"`

---

#### `app/layout.tsx` (25 lines)
**Purpose:** Root layout with metadata and global HTML structure

```typescript
export const metadata: Metadata = {
  title: "KNU Link - Anonymous Social Discovery",
  description: "Connect with KNU students for activities",
};
```

**Features:**
- SEO metadata
- Global font (Geist)
- Antialiased text rendering
- Gradient background

---

#### `next.config.ts` (5 lines)
**Purpose:** Next.js configuration

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

**Default settings work perfectly for this app!**

---

#### `tsconfig.json` (29 lines)
**Purpose:** TypeScript compiler configuration

**Key Settings:**
- `strict: true` - Enable all strict type-checking options
- `paths: { "@/*": ["./*"] }` - Import alias for cleaner imports
- `jsx: "preserve"` - Let Next.js handle JSX transformation
- `module: "ESNext"` - Use latest JavaScript modules
- `target: "ES2017"` - Compile to ES2017 for broad compatibility

---

#### `package.json` (29 lines)
**Purpose:** Project metadata and dependency management

**Scripts:**
- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build production bundle  
- `npm start` - Serve production build
- `npm run lint` - Run ESLint checks

**Dependencies (Production):**
- `@supabase/supabase-js@^2.90.1` - Backend client
- `lucide-react@^0.562.0` - Icons
- `next@16.1.1` - Framework
- `react@19.2.3` - UI library  
- `react-dom@19.2.3` - React DOM rendering

**DevDependencies:**
- `@tailwindcss/postcss@^4` - Tailwind compiler
- `@types/node@^20` - Node.js type definitions
- `@types/react@^19` - React type definitions
- `@types/react-dom@^19` - React DOM type definitions
- `eslint@^9` - Code linter
- `eslint-config-next@16.1.1` - Next.js ESLint rules
- `tailwindcss@^4` - CSS framework
- `typescript@^5` - TypeScript compiler

---

#### `vercel.json` (6 lines)
**Purpose:** Vercel deployment configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

**All auto-detected by Vercel, but explicit is better!**

---

#### `.gitignore` (35 lines)
**Purpose:** Specify files Git should ignore

**Key Ignores:**
- `node_modules/` - All dependencies (too large)
- `.next/` - Build output (regenerated)
- `.env*.local` - Environment secrets (NEVER commit)
- `*.log` - Log files
- `.vercel/` - Vercel deployment cache

---

### **Database Files**

#### `supabase-schema.sql` (73 lines)
**Purpose:** Complete database schema for initial setup

**Tables Created:**
1. **profiles** - User accounts
2. **posts** - Activities
3. **messages** - Chat messages

**RLS Policies:**
- Users can view all profiles
- Users can create their own profile
- Users can view all posts
- Users can create posts
- Users can view all messages in chats they're in
- Users can send messages

**Realtime:**
```sql
ALTER PUBLICATION supabase_realtime 
  ADD TABLE profiles, posts, messages;
```

---

#### `supabase-participations.sql` (37 lines)  
**Purpose:** Add participations table for tracking joined activities

**Table Structure:**
```sql
CREATE TABLE participations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);
```

**Why separate file?**
- Added later as a feature enhancement
- Allows incremental migrations
- Easier to track what changed

**Indexes:**
```sql
CREATE INDEX idx_participations_user_id ON participations(user_id);
CREATE INDEX idx_participations_post_id ON participations(post_id);
```

**Performance:** Indexes make queries 10-100x faster!

---

## 🗄 Database Schema

### **ER Diagram**

```
┌─────────────┐
│  profiles   │
├─────────────┤
│ id (PK)     │───┐
│ student_id  │   │
│ nickname    │   │
│ gender      │   │
│ icon        │   │
│ created_at  │   │
└─────────────┘   │
                  │
                  │ (FK: user_id)
                  ↓
         ┌────────────────┐         ┌───────────────────┐
         │     posts      │         │  participations   │
         ├────────────────┤         ├───────────────────┤
         │ id (PK)        │←────────│ id (PK)           │
         │ user_id (FK)   │         │ user_id (FK)      │
         │ nickname       │    ┌────│ post_id (FK)      │
         │ icon           │    │    │ joined_at         │
         │ activity       │    │    └───────────────────┘
         │ time           │    │
         │ location       │    │
         │ created_at     │    │
         └────────────────┘    │
                  │            │
                  │ (FK: post_id)
                  ↓            │
         ┌────────────────┐   │
         │   messages     │   │
         ├────────────────┤   │
         │ id (PK)        │   │
         │ post_id (FK)   │───┘
         │ user_id (FK)   │
         │ nickname       │
         │ icon           │
         │ content        │
         │ created_at     │
         └────────────────┘
```

### **Relationships**

1. **profiles → posts** (one-to-many)
   - One user can create many posts
   - `posts.user_id` references `profiles.id`

2. **posts → messages** (one-to-many)
   - One post can have many messages
   - `messages.post_id` references `posts.id`

3. **profiles → messages** (one-to-many)
   - One user can send many messages
   - `messages.user_id` references `profiles.id`

4. **profiles → participations** (one-to-many)
   - One user can join many activities
   - `participations.user_id` references `profiles.id`

5. **posts → participations** (one-to-many)
   - One post can have many participants
   - `participations.post_id` references `posts.id`

---

## 🚢 Deployment

### **Deploying to Vercel**

**Step 1:** Push code to GitHub
```bash
git add .
git commit -m "feat: Complete KNU Link app"
git push origin main
```

**Step 2:** Connect to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import "AngelaEmileJose/KNU-Link"

**Step 3:** Configure Environment Variables
Add these in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Step 4:** Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Get your URL: `https://knu-link.vercel.app`

**Step 5:** Update Supabase
Add Vercel URL to Supabase:
- Settings → Authentication → URL Configuration
- Site URL: `https://knu-link.vercel.app`
- Redirect URLs: `https://knu-link.vercel.app/**`

**Automatic Redeployment:**
Every `git push` to `main` triggers automatic deployment!

---

## 🔮 Future Enhancements

### **Planned Features**
- [ ] Push notifications for new messages
- [ ] User blocking and reporting
- [ ] Activity categories and filtering
- [ ] Advanced search (by time, location, activity type)
- [ ] Group chats (multiple activities combined)
- [ ] Profile customization (bio, interests)
- [ ] Activity expiration (auto-delete old posts)
- [ ] Image sharing in chats
- [ ] Activity ratings and reviews
- [ ] Admin dashboard for moderation

### **Technical Improvements**
- [ ] Server-side rendering for SEO
- [ ] Progressive Web App (PWA) support
- [ ] Offline mode with service workers
- [ ] E2E testing with Playwright
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics/Plausible)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Contributors

- **Angela Emile Jose** - Initial development and design
- Built with ❤️ for KNU students

---

## 🙏 Acknowledgments

- **KNU** - For inspiring the project
- **Supabase** - Amazing backend platform
- **Vercel** - Seamless deployment
- **Next.js Team** - Fantastic framework
- **Tailwind CSS** - Beautiful utility classes

---

## 📧 Contact

For questions or feedback:
- **GitHub:** [@AngelaEmileJose](https://github.com/AngelaEmileJose)
- **Email:** angela.emile.jose@example.com
- **LinkedIn:** [Angela Emile Jose](https://www.linkedin.com/in/angela-emile-jose-1412b02a2/)

---

**Made with 💜 for introverts, by introverts**
