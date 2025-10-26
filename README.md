# 🚀 Content Catalyst AI - Frontend

> AI-powered content repurposing platform frontend built with Next.js

This is the frontend application for Content Catalyst AI. The backend API is deployed separately.

## 🛠 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Firebase** - Authentication and database

## 🚀 Getting Started

### Quick Start (Demo Mode)
```bash
npm install
npm run dev
```
Visit http://localhost:3001 to see the demo.

### Production Setup (Real Firebase)

1. **Set up Firebase** (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions):
   - Create Firebase project
   - Enable Authentication (Email/Password + Google)
   - Set up Firestore database

2. **Configure Environment Variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_API_URL=your_backend_api_url
   NEXT_PUBLIC_DEMO_MODE=false
   ```

3. **Start the application**:
   ```bash
   npm run dev
   ```

## 📦 Deployment

This repository is optimized for Vercel deployment:

1. Connect to Vercel
2. Set environment variables
3. Deploy!

---

**Part of the Content Catalyst AI project**
