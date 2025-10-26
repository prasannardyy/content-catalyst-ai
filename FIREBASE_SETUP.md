# Firebase Setup Guide for Content Catalyst AI

Follow these steps to set up the real application with Firebase authentication and database.

## Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"**
3. **Enter project name**: `content-catalyst-ai` (or your preferred name)
4. **Disable Google Analytics** (optional for this project)
5. **Click "Create project"**

## Step 2: Enable Authentication

1. **In Firebase Console**, go to **Authentication** → **Get started**
2. **Go to "Sign-in method" tab**
3. **Enable Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

4. **Enable Google Sign-in** (optional):
   - Click on "Google"
   - Toggle "Enable" to ON
   - Enter your project support email
   - Click "Save"

## Step 3: Set up Firestore Database

1. **Go to Firestore Database** → **Create database**
2. **Choose "Start in test mode"** (for development)
3. **Select location** (choose closest to your users)
4. **Click "Done"**

## Step 4: Get Firebase Configuration

1. **Go to Project Settings** (gear icon)
2. **Scroll down to "Your apps"**
3. **Click the web icon** `</>`
4. **Register your app**:
   - App nickname: `content-catalyst-ai-web`
   - Don't check "Firebase Hosting"
   - Click "Register app"

5. **Copy the configuration object**:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 5: Update Environment Variables

Update your `.env.local` file with the Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-from-step-4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DEMO_MODE=false
```

## Step 6: Set up Backend API (Optional)

For full functionality, you'll need a backend API. You can either:

### Option A: Use Mock Backend (Recommended for testing)
Keep `NEXT_PUBLIC_DEMO_MODE=false` but the app will use Firebase for auth and mock data for content generation.

### Option B: Set up Real Backend
You'll need to create a backend API that handles:
- YouTube video processing
- AI content generation
- Project management

## Step 7: Test the Setup

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Visit http://localhost:3001**

3. **Test Authentication**:
   - Try signing up with email/password
   - Try Google sign-in (if enabled)

4. **Test Project Creation**:
   - Create a new project with a YouTube URL
   - The app will use Firebase for auth and mock data for content

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check that your API key is correct in `.env.local`
   - Make sure there are no extra spaces or quotes

2. **"Firebase: Error (auth/unauthorized-domain)"**
   - Go to Firebase Console → Authentication → Settings
   - Add `localhost` to authorized domains

3. **Build fails**
   - Make sure all environment variables are set
   - Restart the development server after changing `.env.local`

### Firebase Console Links:
- **Authentication**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication
- **Firestore**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore
- **Project Settings**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/settings/general

## Next Steps

Once Firebase is set up:
1. Users can create real accounts
2. Authentication will work with real Firebase
3. User data will be stored in Firestore
4. The app will be ready for production deployment

For full AI content generation, you'll need to set up the backend API with services like:
- YouTube Data API
- OpenAI/Claude for content generation
- Video processing services