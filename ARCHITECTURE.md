# StreamSaga Architecture

## Overview
StreamSaga is a Next.js application where stream viewers can propose and vote for projects/features to be developed live. The project uses **Supabase Auth** for user management and client-side mock data for content (Topics/Proposals).

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Backend**: Supabase (Auth)
- **Styling**: TailwindCSS v4
- **Language**: TypeScript
- **Icons**: Lucide React
- **Utilities**: `clsx`, `tailwind-merge`

## Project Structure

```
.
├── supabase/
│   └── migrations/      # Database migrations
├── src/
│   ├── middleware.ts        # Root middleware for session management & RBAC
│   ├── app/                 # App Router pages and layouts
│   │   ├── (auth)/          # Authentication Pages (Route Group)
│   │   │   ├── login/       # Sign In Page
│   │   │   ├── signup/      # Sign Up Page
│   │   │   ├── actions.ts   # Auth Server Actions
│   │   │   └── layout.tsx   # Auth Layout (Centered)
│   │   ├── auth/
│   │   │   └── callback/    # OAuth Callback Route
│   │   ├── admin/           # Admin Dashboard
│   │   │   ├── actions.ts   # Admin Server Actions
│   │   │   ├── new-topic-dialog.tsx # Topic Creation Dialog
│   │   │   ├── topic-list.tsx       # Realtime Topic List
│   │   │   └── page.tsx     # Admin Page Entry
│   │   ├── propose/         # Proposal Creation Flow
│   │   ├── topic/           # Topic Details
│   │   ├── globals.css      # Global styles & Design System variables
│   │   ├── layout.tsx       # Root layout with Navbar
│   │   └── page.tsx         # Public Dashboard (Home)
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI primitives
│   │   ├── logo.tsx         # Branding component
│   │   ├── navbar.tsx       # Main navigation (Auth aware, Admin link gated by role)
│   │   ├── proposal-card.tsx# Proposal display & voting logic
│   │   └── topic-card.tsx   # Topic summary card
│   └── lib/                 # Utilities and Data
│       ├── supabase/        # Supabase Client Utilities
│       │   ├── client.ts    # Browser Client
│       │   ├── server.ts    # Server Client (Cookies)
│       │   └── middleware.ts# Middleware Helper
│       ├── data.ts          # Mock Data (Topics, Proposals)
│       ├── types.ts         # TypeScript interfaces
│       ├── utils.ts         # Helper functions
│       └── services/        # Business Logic & Data Access
│           ├── topics.ts    # Topic operations
│           └── realtime.ts  # Realtime subscriptions
```

## Data Models (`src/lib/types.ts`)
The application uses strict TypeScript definitions for its entities:
- **User**: `id`, `email`, `role` ('admin' | null)
- **Topic**: `id`, `title`, `status` ('open' | 'closed' | 'archived'), `userId`, `created_at`, `embedding` (vector)
- **Proposal**: `id`, `title`, `topicId`, `userId`
- **Vote**: `id`, `proposalId`, `userId`

## Design System
The design system is built on **TailwindCSS v4** using CSS variables for theming.

### Theming (`src/app/globals.css`)
- **Dark Mode**: Default theme.
- **Colors**: Defined as HSL values in `:root` and `.dark` scopes.
    - `primary`: Vibrant Purple
    - `background`: Deep dark gray/black
    - `foreground`: Off-white
- **Typography**: Geist Sans and Geist Mono (Next.js fonts).

### UI Components (`src/components/ui/`)
Reusable components follow a "shadcn/ui-like" pattern:
- **Card**: Composable card structure (Header, Content, Footer).
- **Button**: Variants (default, outline, ghost, secondary, destructive).
- **Badge**: Status indicators (success, secondary, outline).
- **Input/Textarea**: Form elements with consistent styling.

- **Dialog**: Custom accessible modal component (`src/components/ui/dialog.tsx`).
- **Label**: Form label component.

## Key Flows & Implementation Details

### 1. Authentication
- **Supabase Auth**: Handles user management via Email/Password and Twitch OAuth.
- **Middleware**: `src/middleware.ts` ensures session persistence and implements **Role-Based Access Control (RBAC)**.
    - Gates access to `/admin` routes based on `user.app_metadata.role === 'admin'`.
- **Callback Route**: `/auth/callback` handles the PKCE code exchange.
- **UI State**: Navbar and pages react to the user's session state.

### 2. Server Actions Pattern
Server Actions are used for form submissions and data mutations.
- **Location**: Colocated with the feature (e.g., `src/app/(auth)/actions.ts` for auth).
- **Pattern**:
    - **Input**: Receives `FormData`.
    - **Logic**: Performs server-side logic (Supabase calls, DB mutations).
    - **Response**: Returns a standard state object: `{ success: boolean, message: string | null, error: string | null }`.
    - **Usage**: Consumed by Client Components using `useActionState` for progressive enhancement and state management.

### 3. Service Layer Pattern
To ensure testability and separation of concerns, business logic is abstracted from Server Actions.
- **Services (`src/lib/services/`)**: Handle pure business logic and database interactions. They are UI-agnostic.
- **Server Actions (`actions.ts`)**: Act as API controllers. They handle authentication checks, input parsing (FormData), and response formatting, delegating the actual work to Services.
- **Rule**: UI Components should never call the DB directly. They use Server Actions (for mutations) or Services (for data fetching in Server Components).

### 4. Dashboard (`src/app/page.tsx`)
- **Hero Section**: Introduces the app.
- **Active Topics**: Renders `TopicCard` components from `MOCK_TOPICS`.

### 5. Topic Details (`src/app/topic/[id]/page.tsx`)
- **Dynamic Route**: Fetches topic by ID from mock data.
- **Proposals List**: Filters `MOCK_PROPOSALS` by `topicId`.

### 6. Create Proposal (`src/app/propose/page.tsx`)
- **Multi-step Form**: Topic selection, Similarity Check (Mock), and Submission.

### 7. Admin Dashboard (`src/app/admin/page.tsx`)

- **Realtime Updates**: Uses `TopicList` client component to subscribe to Supabase Realtime changes via `src/lib/services/realtime.ts`.
- **Topic Creation**: `NewTopicDialog` uses Server Action `createTopic` which delegates to `src/lib/services/topics.ts`.
- **Data Fetching**: Server Component fetches initial state using `getTopics` from `src/lib/services/topics.ts`.
