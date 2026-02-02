# MindSage Firebase Backend Setup Guide

## Overview

The backend is implemented using:
- **Next.js App Router** API routes
- **Firebase Authentication** (Email/Password + Google OAuth)
- **Firebase Firestore** (NoSQL database)
- **Firebase Admin SDK** (server-side operations)
- **Zod** for input validation

**Project ID**: Use your own Firebase project ID (e.g. `your-project-id`).

## Quick Start

1. Install dependencies: `npm install`
2. Set up Firebase project (see below)
3. Configure environment variables
4. Deploy Firestore security rules
5. Create Firestore indexes
6. Start development server: `npm run dev`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install Firebase, Firebase Admin, and other required dependencies.

### 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select or create your project
3. Enable **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable **Email/Password** provider
   - Enable **Google** provider (configure OAuth consent screen if needed)
4. Enable **Firestore Database**:
   - Go to Firestore Database → Create database
   - Start in **Production mode** (we'll set security rules)
   - Choose a region (e.g., us-central1)

### 3. Environment Variables

Create a `.env.local` file in the root directory:

#### Option A: Using Environment Variables (Recommended for Production)

```env
# Firebase Client Config (from Firebase Console → Project Settings → General → Your apps)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK: paste full JSON from Service Account key (never commit this file)
FIREBASE_SERVICE_ACCOUNT_KEY=

# Optional: Botpress chat embed URL
NEXT_PUBLIC_BOTPRESS_CHAT_URL=
```

**To get Firebase Client Config:**
1. Go to Firebase Console → Project Settings → General
2. Scroll to "Your apps" section
3. Click on Web app icon (</>) or create a new web app
4. Copy the config values

**To get Service Account Key:**
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Copy the entire JSON and paste as a string (escape quotes) or use Option B

#### Option B: Using JSON File (Development Only)

For local development only, you can use a JSON credentials file:

1. Download the service account JSON from Firebase Console → Project Settings → Service Accounts.
2. Save it as `mindsage-firebase.json` in the project root (or set `FIREBASE_SERVICE_ACCOUNT_KEY` to the JSON string).
3. The admin SDK loads from this file only if `FIREBASE_SERVICE_ACCOUNT_KEY` is not set.
4. **Important**: This file is git-ignored. Never commit it or any credentials.

**Minimum required env vars if using JSON file:**  
Copy from `.env.example` and fill values. Never commit `.env.local` or the JSON credentials file.

### 4. Firestore Security Rules

Deploy the security rules from `firestore.rules`:

#### Option A: Using Firebase CLI

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

#### Option B: Using Firebase Console

1. Go to Firebase Console → Firestore Database → Rules
2. Copy the contents of `firestore.rules`
3. Paste into the rules editor
4. Click "Publish"

The rules enforce:
- Users can only read/update their own user document
- Therapists are publicly readable only if `isActive = true`
- Community posts are publicly readable only if `isApproved = true` and `isHidden = false`
- Only authenticated users can create posts/reactions
- Only admin users can approve/hide posts or manage therapists

### 5. Firestore Indexes

Create composite indexes in Firebase Console (Firestore → Indexes):

#### Index 1: Community Posts (Base Query)
- **Collection ID**: `communityPosts`
- **Fields**:
  - `isApproved` (Ascending)
  - `isHidden` (Ascending)
  - `createdAt` (Descending)
- **Query scope**: Collection
- **Status**: Enabled

#### Index 2: Community Posts (Tag Filter)
- **Collection ID**: `communityPosts`
- **Fields**:
  - `tag` (Ascending)
  - `isApproved` (Ascending)
  - `isHidden` (Ascending)
  - `createdAt` (Descending)
- **Query scope**: Collection
- **Status**: Enabled

#### Index 3: Reactions (Post Reactions)
- **Collection ID**: `reactions`
- **Fields**:
  - `postId` (Ascending)
  - `userId` (Ascending)
  - `type` (Ascending)
- **Query scope**: Collection
- **Status**: Enabled

**Note**: Firebase will prompt you to create these indexes automatically when you first run queries. You can also create them manually in the Console.

### 6. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

All authenticated endpoints require a Firebase ID token in the `Authorization` header:
```
Authorization: Bearer <firebase-id-token>
```

Get the token on the client side:
```typescript
import { auth } from "@/lib/firebase/client"
const token = await auth.currentUser?.getIdToken()
```

### User Endpoints

- `GET /api/me` - Get current user profile (requires auth)
  - Returns: `{ id, email, name, preferredMode, createdAt }`

- `PATCH /api/me/preferences` - Update user preferences (requires auth)
  - Body: `{ preferredMode?: "gita" | "quran" | "bible" | "none", name?: string }`
  - Returns: Updated user object

### Therapist Endpoints

- `GET /api/therapists` - List all active therapists (public)
  - Returns: Array of therapist objects

- `GET /api/therapists/[id]` - Get therapist by ID (public)
  - Returns: Therapist object

- `POST /api/therapists` - Create therapist (admin only)
  - Body: `{ name, bio, credentials, specialties, approach, languages, profileImage?, isActive? }`
  - Returns: Created therapist object

- `PATCH /api/therapists/[id]` - Update therapist (admin only)
  - Body: Partial therapist object
  - Returns: Updated therapist object

### Community Endpoints

- `GET /api/community` - List approved community posts (public)
  - Query params: `?tag=string` (optional filter)
  - Returns: Array of post objects with author info (hidden if anonymous)

- `POST /api/community` - Create a new post (requires auth)
  - Body: `{ title?, content, tag, isAnonymous?: boolean }`
  - Returns: Created post object (with `isApproved = false`)

- `POST /api/community/[id]/react` - Add reaction to a post (requires auth)
  - Body: `{ type: "resonated" }`
  - Returns: `{ reaction, reactionsCount }`

### Moderation Endpoints (Admin Only)

- `PATCH /api/community/[id]/approve` - Approve a post
  - Returns: Updated post object

- `PATCH /api/community/[id]/hide` - Hide a post
  - Returns: Updated post object

## Data Models

### Users Collection (`users`)

- `id` (Firebase UID - document ID)
- `email` (string, required)
- `name` (string | null)
- `preferredMode` ("gita" | "quran" | "bible" | "none", default: "none")
- `role` ("user" | "admin", default: "user")
- `createdAt` (Timestamp)

**Auto-creation**: User documents are automatically created in Firestore when a user makes their first API call after Firebase Auth sign-in.

### Therapists Collection (`therapists`)

- `id` (auto-generated document ID)
- `name` (string, required)
- `bio` (string, required)
- `credentials` (array of strings, required)
- `specialties` (array of strings, required)
- `approach` (string, required)
- `languages` (array of strings, required)
- `profileImage` (string | null)
- `isActive` (boolean, default: true)
- `createdAt` (Timestamp)

### CommunityPosts Collection (`communityPosts`)

- `id` (auto-generated document ID)
- `authorId` (string | null, Firebase UID)
- `title` (string | null)
- `content` (string, required)
- `tag` (string, required)
- `isAnonymous` (boolean, default: false)
- `isApproved` (boolean, default: false)
- `isHidden` (boolean, default: false)
- `createdAt` (Timestamp)

**Note**: Posts default to `isApproved = false` and require admin approval before being visible.

### Reactions Collection (`reactions`)

- `id` (auto-generated document ID)
- `postId` (string, required)
- `userId` (string | null, Firebase UID)
- `type` ("resonated", required)
- `createdAt` (Timestamp)

## Authentication Flow

1. **Client-side**: User signs in with Firebase Auth (email/password or Google)
2. **Client-side**: Get Firebase ID token using `auth.currentUser?.getIdToken()`
3. **Client-side**: Include token in API requests: `Authorization: Bearer <token>`
4. **Server-side**: API routes verify token using Firebase Admin SDK
5. **Server-side**: User document is auto-created in Firestore on first API call

See `FIREBASE_AUTH_CLIENT.md` for client-side authentication examples.

## Admin Setup

To create an admin user:

1. Sign up/login normally (creates user with `role = "user"`)
2. Go to Firebase Console → Firestore Database
3. Find the user document in `users` collection
4. Update the `role` field to `"admin"`

**Alternative**: You can create a script to set admin role programmatically.

## Features

- **Auto User Creation**: User documents are automatically created in Firestore on first API call
- **Role-Based Access**: Admin-only routes check user role from Firestore
- **Anonymous Posts**: Author identity is hidden for anonymous posts (`author = null` in API response)
- **Moderation**: Posts default to `isApproved = false` and require admin approval
- **Soft Deletes**: Use `isActive` and `isHidden` flags instead of hard deletes
- **Input Validation**: All inputs validated using Zod schemas
- **Type Safety**: Full TypeScript support

## Troubleshooting

### Firebase Admin not initializing

- Check that `FIREBASE_SERVICE_ACCOUNT_KEY` env var is set, or `mindsage-firebase.json` exists
- Verify the service account JSON is valid
- Check that `NEXT_PUBLIC_FIREBASE_PROJECT_ID` matches your Firebase project ID

### Authentication errors

- Verify Firebase Auth is enabled in Firebase Console
- Check that Email/Password and Google providers are enabled
- Ensure client-side Firebase config env vars are set correctly

### Firestore query errors

- Check that required indexes are created (Firebase will show a link to create them)
- Verify security rules are deployed
- Check that collection names match exactly (case-sensitive)

### Admin access denied

- Verify user document has `role = "admin"` in Firestore
- Check that the user is authenticated (valid ID token)
- Review security rules for admin checks

## Next Steps

1. Implement client-side authentication UI (see `FIREBASE_AUTH_CLIENT.md`)
2. Set up Firebase Hosting for deployment (optional)
3. Configure Firebase Storage if needed for profile images
4. Add rate limiting for production
5. Set up monitoring and error tracking (Firebase Performance, Sentry, etc.)
6. Configure CORS if needed for API access

## Security Notes

- Never commit `.env.local` or `mindsage-firebase.json` to git (already in `.gitignore`)
- Use environment variables in production (not JSON files)
- Regularly rotate service account keys
- Review and test security rules before production
- Monitor Firestore usage and set up alerts
- Consider implementing rate limiting on API routes
