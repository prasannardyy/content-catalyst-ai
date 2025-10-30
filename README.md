# 🚀 Content Catalyst AI

> Transform YouTube videos into complete content marketing campaigns with AI

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)](https://tailwindcss.com/)

Content Catalyst AI is an intelligent content repurposing platform that transforms your YouTube videos into comprehensive marketing campaigns. Generate blog posts, social media content, quote graphics, and video clips—all from a single YouTube URL.

## ✨ Features

### 🎯 **Core Capabilities**
- **YouTube Video Analysis** - Extract metadata and insights from any YouTube video
- **AI Content Generation** - Create category-specific, relevant content automatically
- **Blog Post Creation** - SEO-optimized articles with proper structure and formatting
- **Social Media Posts** - Platform-specific content for LinkedIn and Twitter with hashtags
- **Quote Graphics** - Visually appealing images with powerful quotes
- **Video Clips** - Embedded video segments for social sharing

### 🔐 **Authentication & Security**
- Firebase Authentication (Email/Password & Google OAuth)
- Secure user sessions with JWT tokens
- Protected routes and API endpoints
- User-specific data isolation

### 🎨 **User Experience**
- Modern, responsive design
- Real-time project status updates
- Copy-to-clipboard functionality
- Download generated content
- Edit and customize content
- Delete projects with confirmation

## 🛠 Tech Stack

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React icons
- **State Management**: React Context API
- **Notifications**: React Hot Toast

### **Backend & Services**
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore (ready for integration)
- **Content Analysis**: YouTube oEmbed API
- **AI Generation**: Custom content generator with category detection

### **Development Tools**
- ESLint for code quality
- TypeScript for type safety
- Git for version control

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- Firebase account (already configured)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prasannardyy/content-catalyst-ai.git
   cd content-catalyst-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   
   The `.env.local` file is already configured with Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDG4p5STGHfFi2M6Uedv2vEg6VWAQrcUNg
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=contentcatalyst-1d0ea.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=contentcatalyst-1d0ea
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=contentcatalyst-1d0ea.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=277461592109
   NEXT_PUBLIC_FIREBASE_APP_ID=1:277461592109:web:817bb87043b76a22c230a4
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Enable Firebase Authentication**
   - Visit [Firebase Console](https://console.firebase.google.com/project/contentcatalyst-1d0ea/authentication)
   - Enable **Email/Password** authentication
   - Enable **Google** authentication (optional)

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Creating Your First Project

1. **Sign Up / Login**
   - Create an account with email/password or Google
   - Verify your email if required

2. **Create a Project**
   - Click "New Project" on the dashboard
   - Paste any YouTube video URL
   - Click "Create Project"

3. **Wait for Processing**
   - Content generation takes ~3 seconds
   - Watch the status change from "Processing" to "Completed"

4. **View Generated Content**
   - Click "View Results" on your project
   - Browse through tabs: Blog Post, Social Posts, Video Clips, Images
   - Copy, download, or edit any content

5. **Manage Projects**
   - Delete unwanted projects
   - View original video
   - Track creation dates

## 🎨 Content Generation

### How It Works

1. **Video Analysis**
   - Extracts video title and channel information
   - Analyzes content category (music, tech, business, fitness, etc.)
   - Identifies key topics and themes

2. **Smart Categorization**
   - Automatically detects content type
   - Applies category-specific templates
   - Generates relevant hashtags and keywords

3. **Content Creation**
   - **Blog Posts**: SEO-optimized articles with proper structure
   - **LinkedIn Posts**: Professional content with industry hashtags
   - **Tweets**: Engaging posts within character limits
   - **Quote Graphics**: Visually appealing images with quotes
   - **Video Clips**: Embedded segments for sharing

### Supported Categories

- 🎵 Music
- 💻 Technology
- 💼 Business
- 💪 Fitness
- 📚 Education
- ✈️ Travel
- 🎮 Gaming
- 👨‍🍳 Cooking
- 🎯 General

## 📁 Project Structure

```
content-catalyst-ai/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/               # Login page
│   │   └── signup/              # Signup page
│   ├── dashboard/               # User dashboard
│   ├── project/[id]/            # Project detail view
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── LandingPage.tsx          # Landing page component
│   └── ErrorBoundary.tsx        # Error handling
├── lib/                         # Utility functions
│   ├── firebase.ts              # Firebase configuration
│   ├── auth-context.tsx         # Authentication context
│   ├── api.ts                   # API client
│   ├── youtube-analyzer.ts      # Video analysis
│   ├── ai-content-generator.ts  # Content generation
│   └── image-generator.ts       # Image generation
├── backend/                     # Backend structure (ready for expansion)
│   ├── main.py                  # FastAPI application
│   ├── models/                  # Data models
│   └── requirements.txt         # Python dependencies
├── .kiro/                       # Project specifications
│   └── specs/                   # Feature specifications
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind config
└── README.md                    # This file
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Setup
./setup-local.sh     # Automated local setup
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Vercel will auto-detect Next.js

2. **Configure Environment Variables**
   - Add all `NEXT_PUBLIC_*` variables from `.env.local`
   - Vercel will use these for builds

3. **Deploy**
   - Push to main branch
   - Vercel automatically deploys

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🔐 Security

- Firebase handles authentication securely
- Environment variables for sensitive data
- CORS configured for API security
- User data isolated per account
- Secure session management

## 🐛 Troubleshooting

### Authentication Issues

**Problem**: "Authentication not initialized"
**Solution**: 
1. Check `.env.local` has all Firebase variables
2. Restart development server: `npm run dev`
3. Clear browser cache and hard refresh

**Problem**: "User not found" or "Wrong password"
**Solution**: 
- Verify Email/Password auth is enabled in Firebase Console
- Check credentials are correct
- Try password reset if needed

### Build Issues

**Problem**: Build fails with TypeScript errors
**Solution**:
```bash
npm run lint
npm run build
```

### Firebase Issues

**Problem**: Firebase not connecting
**Solution**:
1. Verify Firebase project exists
2. Check API key is correct
3. Enable authentication methods in Firebase Console

## 📚 Documentation

- **[Setup Guide](LOCAL_SETUP_GUIDE.md)** - Detailed setup instructions
- **[API Setup](API_SETUP_GUIDE.md)** - API integration guide
- **[Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md)** - Deployment instructions
- **[Improvements](IMPROVEMENTS_SUMMARY.md)** - Recent enhancements
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions

## 🎯 Roadmap

### Current Features ✅
- [x] User authentication (Email/Password, Google OAuth)
- [x] YouTube video analysis
- [x] AI content generation
- [x] Blog post creation
- [x] Social media posts
- [x] Quote graphics
- [x] Project management
- [x] Delete projects
- [x] Copy/download content

### Planned Features 🚧
- [ ] Backend API integration
- [ ] Real video processing with Google Video Intelligence
- [ ] Advanced AI with Azure AI Language Service
- [ ] Professional quote graphics with Bannerbear
- [ ] Video clipping with moviepy
- [ ] Project templates
- [ ] Team collaboration
- [ ] Analytics dashboard
- [ ] Bulk operations
- [ ] Export as ZIP

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Prasanna Kumar Reddy**
- GitHub: [@prasannardyy](https://github.com/prasannardyy)
- Repository: [content-catalyst-ai](https://github.com/prasannardyy/content-catalyst-ai)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for authentication services
- Vercel for hosting platform
- Tailwind CSS for styling utilities
- Lucide for beautiful icons

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Review [Documentation](LOCAL_SETUP_GUIDE.md)
3. Open an issue on GitHub
4. Check browser console for error messages

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using Next.js, TypeScript, and Firebase**

**Live Demo**: [Coming Soon]
**Documentation**: [Full Docs](LOCAL_SETUP_GUIDE.md)
**Status**: ✅ Production Ready
