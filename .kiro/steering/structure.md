# Project Structure & Organization

## Root Directory Layout

```
/
├── app/                    # Next.js App Router pages and layouts
├── components/             # Reusable React components
├── lib/                   # Utility functions and configurations
├── .kiro/                 # Kiro AI assistant configuration
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vercel.json           # Vercel deployment configuration
```

## App Directory Structure (Next.js 14 App Router)

```
app/
├── layout.tsx             # Root layout with providers
├── page.tsx              # Home/landing page
├── globals.css           # Global styles and Tailwind imports
├── auth/
│   ├── login/page.tsx    # Login page
│   └── signup/page.tsx   # Signup page
├── dashboard/
│   └── page.tsx          # User dashboard
└── project/
    └── [id]/page.tsx     # Dynamic project detail page
```

## Components Organization

```
components/
├── LandingPage.tsx       # Main landing page component
├── ProjectCard.tsx       # Project list item component
├── AssetViewer.tsx       # Content asset display component
└── ui/                   # Reusable UI components
```

## Library Structure

```
lib/
├── firebase.ts          # Firebase client configuration
├── api.ts               # API client configuration
├── auth-context.tsx     # Authentication context provider
├── demo-mode.ts         # Demo mode utilities and mock data
└── api.ts               # API client functions
```

## Naming Conventions

- **Files**: PascalCase for components (`LandingPage.tsx`), camelCase for utilities (`demo-mode.ts`)
- **Components**: PascalCase with descriptive names
- **Functions**: camelCase with verb-noun pattern
- **Constants**: UPPER_SNAKE_CASE
- **Types**: PascalCase with `Type` or `Interface` suffix

## Code Organization Patterns

- **Feature-based**: Group related components and utilities
- **Separation of Concerns**: Separate UI, logic, and data layers
- **Context Providers**: Centralized state management in `lib/`
- **Demo Mode**: Consistent fallback patterns throughout the app
- **Type Safety**: Comprehensive TypeScript coverage

## Import Conventions

- Use `@/` alias for root-relative imports
- Group imports: external libraries, internal modules, relative imports
- Prefer named exports over default exports for utilities

## Environment Files

- `.env.local` - Local development environment variables
- `.env.example` - Template for required environment variables
- Demo mode enabled by default for development ease