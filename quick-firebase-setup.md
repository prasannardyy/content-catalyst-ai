# Quick Firebase Setup

## Current Status
✅ **App is working in demo mode** - You can test all features
❌ **Firebase not configured** - Real authentication disabled

## To Enable Real Firebase Authentication:

### 1. Create Firebase Project (5 minutes)
- Go to: https://console.firebase.google.com/
- Click "Create a project"
- Name: `content-catalyst-ai`
- Disable Analytics (optional)

### 2. Enable Authentication
- Go to **Authentication** → **Get started**
- **Sign-in method** → **Email/Password** → **Enable**
- **Optional**: Enable **Google** sign-in

### 3. Get Your Config
- **Project Settings** (gear icon)
- **Your apps** → Web icon `</>`
- **App nickname**: `content-catalyst-ai-web`
- **Copy the config values**

### 4. Update .env.local
Replace these lines in your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_from_firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
NEXT_PUBLIC_DEMO_MODE=false
```

### 5. Restart Server
```bash
npm run dev
```

## Current Demo Mode Features
- ✅ Sign up/Login simulation
- ✅ Dashboard with projects
- ✅ YouTube URL processing
- ✅ AI content generation
- ✅ Full UI/UX experience

## After Firebase Setup
- ✅ Real user accounts
- ✅ Secure authentication
- ✅ Data persistence
- ✅ Production ready