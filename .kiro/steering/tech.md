# Technology Stack & Build System

## Frontend Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS utility-first framework
- **UI Components**: Headless UI, Lucide React icons
- **State Management**: React Context API
- **Authentication**: Firebase Authentication with demo mode fallback
- **HTTP Client**: Axios for API communication
- **Notifications**: React Hot Toast
- **Markdown**: React Markdown with syntax highlighting

## Backend Integration

- **Database**: Firebase Firestore with demo mode fallback
- **Authentication**: Firebase Auth (Email/Password, Google OAuth)
- **API**: RESTful API communication
- **Demo Mode**: Built-in mock data system for development/testing

## Build System & Commands

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run lint         # Run ESLint for code quality
```

### Production
```bash
npm run build        # Create optimized production build
npm run start        # Start production server
```

### Package Management
```bash
npm install          # Install dependencies
npm audit            # Check for security vulnerabilities
```

## Environment Configuration

- **Demo Mode**: `NEXT_PUBLIC_DEMO_MODE=true` for development without Firebase
- **Firebase**: Complete configuration for authentication and database
- **API URL**: Backend service endpoint

## Deployment

- **Platform**: Optimized for Vercel deployment
- **Build Output**: Static generation where possible
- **Environment**: Automatic environment variable injection
- **Framework Detection**: Automatic Next.js detection and optimization

## Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **Build Validation**: Type checking during build process