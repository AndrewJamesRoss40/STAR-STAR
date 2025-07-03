# Pull-Up Tracker App

## Overview

This is a modern full-stack web application for tracking pull-up exercises with AI-powered analysis capabilities. The app allows users to log their pull-up sessions, view progress statistics, and receive personalized feedback through ChatGPT integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Validation**: Zod for runtime type checking
- **External APIs**: OpenAI GPT integration for workout analysis

### Database Schema
The application uses two main tables:
- `users`: User authentication (id, username, password)
- `pullup_logs`: Exercise tracking (id, reps, timestamp)

## Key Components

### Frontend Components
- **Home Page**: Main dashboard with quick stats and logging interface
- **Quick Stats Card**: Real-time display of today's, weekly, and personal record statistics
- **Quick Logging Panel**: Interface for logging pull-ups with preset buttons and custom input
- **Progress Chart**: Interactive charts showing daily/weekly progress trends
- **ChatGPT Analysis Panel**: AI-powered workout analysis and feedback
- **Recent Logs Panel**: Timeline of recent exercise sessions
- **Goals and Streaks**: Progress tracking with daily goals and streak counters
- **Floating Action Button**: Quick one-rep logging shortcut

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **API Routes**: RESTful endpoints for logging, statistics, and AI integration
- **OpenAI Integration**: Automated workout analysis and personalized feedback

## Data Flow

1. **Exercise Logging**: Users log pull-ups through various UI components
2. **Data Validation**: Input validated using Zod schemas
3. **Database Storage**: Exercise data stored in PostgreSQL via Drizzle ORM
4. **Statistics Calculation**: Real-time aggregation of daily/weekly stats
5. **Progress Visualization**: Charts updated automatically via React Query
6. **AI Analysis**: Periodic or on-demand analysis sent to OpenAI API
7. **Feedback Display**: AI insights presented in user-friendly format

## External Dependencies

### Core Libraries
- **Database**: Drizzle ORM with Neon Database adapter
- **UI Framework**: React with shadcn/ui components
- **HTTP Client**: Fetch API with custom wrapper
- **State Management**: TanStack Query for caching and synchronization
- **Validation**: Zod for schema validation
- **Charts**: Recharts for data visualization
- **AI Integration**: OpenAI SDK for workout analysis

### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full type safety across frontend and backend
- **CSS**: Tailwind CSS with PostCSS processing
- **Linting**: TypeScript compiler for type checking

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server with HMR for frontend
- **Backend**: tsx for TypeScript execution with hot reload
- **Database**: Drizzle push for schema synchronization
- **Environment**: NODE_ENV-based configuration

### Production Build
- **Frontend**: Vite build with static asset optimization
- **Backend**: esbuild bundling for Node.js deployment
- **Assets**: Static files served from dist/public
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication
- `NODE_ENV`: Environment mode (development/production)

## Changelog

```
Changelog:
- July 02, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```