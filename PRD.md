# StreamSaga

An app where stream viewers can propose and vote for projects/features that will be developed live in upcoming seasons and episodes.

## Tech Stack

**Development:**
- Next.js
- Supabase (database + vector search + auth)

**Deployment:**
- Cloudflare Workers + OpenNext

## Access

- **Public:** Dashboard, Search, Browse Topics
- **Authenticated:** Propose, Vote
- **Admin:** Create/Edit Topics

## Data Models

All entities have: `createdAt`, `updatedAt`, `archivedAt`

### Users
- Supabase Auth model
- `role`: `'admin'` or `null`

### Topics
- `id`
- `title`
- `status`: `open` | `closed` | `archived`
- `userId` (creator, FK → Users)

### Proposals
- `id`
- `title`
- `topicId` (FK → Topics)
- `userId` (creator, FK → Users)

### Votes
- `id`
- `proposalId` (FK → Proposals)
- `userId` (FK → Users)
- Unique constraint: one vote per user per proposal

## User Flows

### Public User
1. View dashboard with active topics
2. Search topics and proposals (vector search)
3. Browse individual topic pages with proposals

### Authenticated User
1. Sign up/login via Email or Twitch
2. Browse topics → Select topic → Create proposal
3. Before submitting: see similar proposals (vector search, threshold ~0.8 similarity)
4. If similar exists → can vote on existing instead
5. Vote on any proposal (one vote per proposal)
6. Delete own proposals (soft delete via `archivedAt`)
7. Remove own votes

### Admin
1. All authenticated user capabilities
2. Create new topics
3. Edit topic titles
4. Change topic status (open/closed/archived)
5. Archive any proposal (moderation)

## Features

### Dashboard
- Scope: Public
- Shows active topics with vote counts

### Search
- Scope: Public
- Vector search across Topics and Proposals tables

### Browse Topic
- Scope: Public
- View topic details and all proposals with vote counts

### Create Proposal
- Scope: Authenticated
- Duplicate check: show similar proposals (vector similarity ≥ 0.8)
- User can proceed to vote on existing or create new

### Vote
- Scope: Authenticated
- One vote per user per proposal
- Can remove own vote

### Create/Edit Topic
- Scope: Admin only

## Rate Limiting & Bot Protection

- **Captcha:** On proposal creation (e.g., Cloudflare Turnstile - free, privacy-friendly)
- **Rate limits:**
  - Proposals: max 5 per user per day
  - Votes: max 50 per user per day
- **Account age:** Optional - require account to be 1+ hour old before proposing

## Authentication
- Email (magic link or password)
- Twitch OAuth

