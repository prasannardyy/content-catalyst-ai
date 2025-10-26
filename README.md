# 🚀 Content Catalyst AI - Frontend

> AI-powered content repurposing platform frontend built with Next.js

This is the frontend application for Content Catalyst AI. The backend API is deployed separately.

## 🛠 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Firebase** - Authentication and database

## 🚀 Getting Started

### Automated Setup (Recommended)
```bash
# Run the setup script
./setup-local.sh

# Start the development server
npm run dev
```

### Manual Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file:
   ```env
   # Firebase Configuration (already configured)
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDG4p5STGHfFi2M6Uedv2vEg6VWAQrcUNg
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=contentcatalyst-1d0ea.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=contentcatalyst-1d0ea
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=contentcatalyst-1d0ea.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=277461592109
   NEXT_PUBLIC_FIREBASE_APP_ID=1:277461592109:web:817bb87043b76a22c230a4
   
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_DEMO_MODE=false
   ```

3. **Enable Firebase Authentication**:
   - Go to: https://console.firebase.google.com/project/contentcatalyst-1d0ea/authentication
   - Click "Get started" → "Sign-in method"
   - Enable "Email/Password" and "Google"

4. **Start the application**:
   ```bash
   npm run dev
   ```

5. **Visit**: http://localhost:3001

## 📦 Deployment

This repository is optimized for Vercel deployment:

1. Connect to Vercel
2. Set environment variables
3. Deploy!

---

**Part of the Content Catalyst AI project**
