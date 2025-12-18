# StreamSaga ⚡️

> **Season 1 of the [Stream Framework](https://github.com/Alirun/stream-framework)**  
> *Every episode forged by you*

StreamSaga is a platform where stream viewers can propose and vote for projects or features to be developed live during upcoming seasons and episodes.

## 🎬 Live Streams

Join the live builds and participate in the decision-making process:

- 🎮 **Twitch**: [twitch.tv/ali_run](https://twitch.tv/ali_run)
- 📺 **YouTube**: [youtube.com/@ali_run](https://youtube.com/@ali_run)
- 🟢 **Kick**: [kick.com/ali-run](https://kick.com/ali-run)
- 🌳 **Linktree**: [linktr.ee/ali_run](https://linktr.ee/ali_run) (All social links)

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Backend**: [Supabase](https://supabase.com) (Auth, Database, Realtime, Vector Search)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com)
- **AI**: [OpenAI SDK](https://openai.com) (for vector embeddings)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com) (via [OpenNext](https://open-next.js.org))

## ✨ Key Features

- **Public Dashboard**: View active topics and vote counts in real-time.
- **Vector Search**: Semantic search across topics and proposals.
- **Proposals**: Authenticated users can propose new ideas with automatic duplicate detection.
- **Voting**: One vote per user per proposal.
- **Admin Panel**: Create/edit topics and moderate proposals.
- **Deterministic Identities**: Randomly generated animal-based usernames and avatars for users.

## 🛠 Getting Started

### Prerequisites

- Node.js (latest LTS)
- Supabase account and project
- OpenAI API key
- Cloudflare account (for deployment)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `example.env` to `.env.local` and fill in your credentials.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🔑 Making a User an Admin

To grant admin privileges to a user, run the following SQL command in your Supabase SQL editor:

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
WHERE email = 'user@example.com';
```

Replace `user@example.com` with the email address of the user you want to make an admin.

## 📖 Documentation

- [TODO.md](TODO.md) - Project roadmap and task list
- [PRD.md](PRD.md) - Product Requirements Document
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture and project structure
