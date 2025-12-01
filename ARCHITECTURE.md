# StreamSaga Architecture

## Overview
StreamSaga is a Next.js application where stream viewers can propose and vote for projects/features to be developed live. The project is currently in the **UI Mock** phase, using client-side mock data to demonstrate core flows before backend integration.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS v4
- **Language**: TypeScript
- **Icons**: Lucide React
- **Utilities**: `clsx`, `tailwind-merge`

## Project Structure

```
src/
├── app/                 # App Router pages and layouts
│   ├── admin/           # Admin Dashboard
│   ├── propose/         # Proposal Creation Flow
│   ├── topic/           # Topic Details
│   ├── globals.css      # Global styles & Design System variables
│   ├── layout.tsx       # Root layout with Navbar
│   └── page.tsx         # Public Dashboard (Home)
├── components/          # React components
│   ├── ui/              # Reusable UI primitives (Button, Card, etc.)
│   ├── logo.tsx         # Branding component
│   ├── navbar.tsx       # Main navigation
│   ├── proposal-card.tsx# Proposal display & voting logic
│   └── topic-card.tsx   # Topic summary card
└── lib/                 # Utilities and Data
    ├── data.ts          # Mock Data (Topics, Proposals)
    ├── types.ts         # TypeScript interfaces (Topic, Proposal, User)
    └── utils.ts         # Helper functions (cn)
```

## Data Models (`src/lib/types.ts`)
The application uses strict TypeScript definitions for its entities:
- **User**: `id`, `email`, `role` ('admin' | null)
- **Topic**: `id`, `title`, `status` ('open' | 'closed' | 'archived'), `userId`
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

## Key Flows & Implementation Details

### 1. Dashboard (`src/app/page.tsx`)
- **Hero Section**: Introduces the app.
- **Search**: Visual placeholder for vector search.
- **Active Topics**: Renders `TopicCard` components from `MOCK_TOPICS`.

### 2. Topic Details (`src/app/topic/[id]/page.tsx`)
- **Dynamic Route**: Fetches topic by ID from mock data.
- **Proposals List**: Filters `MOCK_PROPOSALS` by `topicId`.
- **Interaction**: `ProposalCard` manages its own local voting state.

### 3. Create Proposal (`src/app/propose/page.tsx`)
- **Multi-step Form**:
    1.  **Input**: Topic selection and Title.
    2.  **Similarity Check**: Mock async function simulates vector search delay and returns "similar" proposals.
    3.  **Submission**: Final details and submit action (alert only).

### 4. Admin Dashboard (`src/app/admin/page.tsx`)
- **Table View**: Lists all topics with status badges and management actions.
- **Actions**: Visual toggles for locking/archiving topics.

## Future Considerations
- **Backend**: Replace `src/lib/data.ts` with Supabase client calls.
- **Auth**: Integrate Supabase Auth in `Navbar` and protected routes.
- **State Management**: Move local state (like voting) to server actions or React Query.
