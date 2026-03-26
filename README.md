# Pandora AI

Pandora AI is a bilingual, AI-assisted self-learning platform built with Next.js App Router. A user can sign in, describe what they want to learn, refine the scope through an AI planning conversation, confirm the resulting course structure, and then study generated lesson content with an AI tutoring assistant.

## What the Product Does

- Lets users start from a broad topic or homepage example
- Uses a planning chat to narrow scope, depth, pace, and learning direction
- Generates a structured course with chapters and subchapters
- Supports bilingual course data (`zh` / `en`)
- Generates lesson content, summaries, and quizzes
- Provides an AI tutoring assistant inside the learning workspace
- Tracks learning progress per project
- Supports guest trial mode in addition to Google sign-in

## Current Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS v4
- Prisma 7
- SQLite with `better-sqlite3`
- Auth.js / NextAuth v5 beta
- AI provider abstraction with support for:
  - ChatGPT OAuth bridge
  - OpenRouter
  - MiniMax
  - OpenAI-compatible providers
  - Anthropic-style env aliases for OpenAI-compatible endpoints

## Repository Map

### App routes

- [src/app/page.tsx](./src/app/page.tsx)
  Homepage
- [src/app/login/page.tsx](./src/app/login/page.tsx)
  Login page
- [src/app/dashboard/page.tsx](./src/app/dashboard/page.tsx)
  Project dashboard
- [src/app/about/page.tsx](./src/app/about/page.tsx)
  About page
- [src/app/projects/new/page.tsx](./src/app/projects/new/page.tsx)
  New-project entry flow
- [src/app/projects/[projectId]/plan/page.tsx](./src/app/projects/%5BprojectId%5D/plan/page.tsx)
  AI planning conversation
- [src/app/projects/[projectId]/review/page.tsx](./src/app/projects/%5BprojectId%5D/review/page.tsx)
  Plan confirmation page
- [src/app/projects/[projectId]/page.tsx](./src/app/projects/%5BprojectId%5D/page.tsx)
  Project overview / course home
- [src/app/projects/[projectId]/chapters/[chapterId]/subchapters/[subchapterId]/main/page.tsx](./src/app/projects/%5BprojectId%5D/chapters/%5BchapterId%5D/subchapters/%5BsubchapterId%5D/main/page.tsx)
  Lesson main content
- [src/app/projects/[projectId]/chapters/[chapterId]/subchapters/[subchapterId]/summary/page.tsx](./src/app/projects/%5BprojectId%5D/chapters/%5BchapterId%5D/subchapters/%5BsubchapterId%5D/summary/page.tsx)
  Lesson summary
- [src/app/projects/[projectId]/chapters/[chapterId]/subchapters/[subchapterId]/quiz/page.tsx](./src/app/projects/%5BprojectId%5D/chapters/%5BchapterId%5D/subchapters/%5BsubchapterId%5D/quiz/page.tsx)
  Lesson quiz

### API routes

- [src/app/api/chat/route.ts](./src/app/api/chat/route.ts)
  Planning and tutoring chat API
- [src/app/api/generate/route.ts](./src/app/api/generate/route.ts)
  Lesson content generation API
- [src/app/api/projects/route.ts](./src/app/api/projects/route.ts)
  Create / update project structure
- [src/app/api/projects/[projectId]/confirm/route.ts](./src/app/api/projects/%5BprojectId%5D/confirm/route.ts)
  Confirm plan and activate project
- [src/app/api/projects/[projectId]/thread/route.ts](./src/app/api/projects/%5BprojectId%5D/thread/route.ts)
  Chat thread lookup / creation
- [src/app/api/auth/[...nextauth]/route.ts](./src/app/api/auth/%5B...nextauth%5D/route.ts)
  Auth.js handler
- [src/app/api/auth/guest/route.ts](./src/app/api/auth/guest/route.ts)
  Guest session entry point

### Shared UI

- [src/components/chat/chat-panel.tsx](./src/components/chat/chat-panel.tsx)
  Reusable chat UI
- [src/components/lesson/learning-page-shell.tsx](./src/components/lesson/learning-page-shell.tsx)
  Learning page state shell
- [src/components/lesson/learning-workspace.tsx](./src/components/lesson/learning-workspace.tsx)
  Main learning layout
- [src/components/lesson/lesson-content.tsx](./src/components/lesson/lesson-content.tsx)
  Markdown lesson renderer
- [src/components/lesson/tutoring-chat.tsx](./src/components/lesson/tutoring-chat.tsx)
  In-lesson AI tutor wrapper
- [src/components/project/sidebar.tsx](./src/components/project/sidebar.tsx)
  Course navigation sidebar
- [src/components/project/project-overview-content.tsx](./src/components/project/project-overview-content.tsx)
  Project overview body
- [src/components/project/plan-review-content.tsx](./src/components/project/plan-review-content.tsx)
  Plan review page UI

### Core logic

- [src/lib/auth.ts](./src/lib/auth.ts)
  Auth.js configuration
- [src/lib/db.ts](./src/lib/db.ts)
  Prisma client setup
- [src/lib/ai/provider.ts](./src/lib/ai/provider.ts)
  Provider selection
- [src/lib/ai/openai-api.ts](./src/lib/ai/openai-api.ts)
  OpenAI-compatible provider implementation
- [src/lib/ai/chatgpt-oauth.ts](./src/lib/ai/chatgpt-oauth.ts)
  ChatGPT OAuth bridge integration
- [src/lib/ai/prompts.ts](./src/lib/ai/prompts.ts)
  Planning / tutoring / generation prompts
- [src/lib/ai/generate-content.ts](./src/lib/ai/generate-content.ts)
  Content generation orchestration
- [src/lib/ai/response-cleaning.ts](./src/lib/ai/response-cleaning.ts)
  Removes think tags and cleans model output
- [src/lib/ai/plan-structure.ts](./src/lib/ai/plan-structure.ts)
  Extracts and sanitizes generated plan JSON
- [src/lib/ai/conversation-language.ts](./src/lib/ai/conversation-language.ts)
  Detects and persists conversation language

### Database

- [prisma/schema.prisma](./prisma/schema.prisma)
  Prisma schema
- [prisma/migrations](./prisma/migrations)
  Database migrations
- [prisma.config.ts](./prisma.config.ts)
  Prisma config entry point

## Local Development

### Prerequisites

- Node.js 22 or compatible modern Node runtime
- `pnpm` 10

### Install

```bash
pnpm install
```

### Configure environment

Create a local `.env` based on [.env.example](./.env.example).

Minimum local requirements:

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="replace-with-a-random-secret"
AUTH_GOOGLE_ID="replace-with-google-client-id"
AUTH_GOOGLE_SECRET="replace-with-google-client-secret"
```

Then choose exactly one AI provider path for local testing.

### Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production-style build

```bash
pnpm run build
```

## Environment Variables

### Core

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
```

### OpenAI

```env
OPENAI_API_KEY="..."
OPENAI_MODEL="gpt-4o"
OPENAI_BASE_URL=""
```

### MiniMax

```env
MINIMAX_API_KEY="..."
MINIMAX_MODEL="MiniMax-M2.5"
MINIMAX_BASE_URL="https://api.minimax.io/v1"
```

### OpenRouter

```env
OPENROUTER_API_KEY="..."
OPENROUTER_MODEL="openai/gpt-4o"
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"
OPENROUTER_SITE_URL="https://your-domain.com"
OPENROUTER_APP_NAME="Pandora AI"
```

### Anthropic-style aliases for compatible providers

These are supported by the current codebase and are mapped into the OpenAI-compatible client path:

```env
ANTHROPIC_API_KEY="..."
ANTHROPIC_AUTH_TOKEN="..."
ANTHROPIC_MODEL="..."
ANTHROPIC_BASE_URL="..."
```

### ChatGPT OAuth bridge

```env
CHATGPT_BRIDGE_SCRIPT="/app/scripts/chatgpt_oauth_bridge.mjs"
CHATGPT_OAUTH_FILE="/data/chatgpt-oauth.json"
CHATGPT_OAUTH_TOKEN=""
CHATGPT_MODEL="gpt-5.4-mini"
```

## Authentication

- Google sign-in is configured through Auth.js in [src/lib/auth.ts](./src/lib/auth.ts)
- Guest trial login is supported through [src/app/api/auth/guest/route.ts](./src/app/api/auth/guest/route.ts)
- Sessions use the database session strategy

If you change the production domain, update:
- `AUTH_URL`
- Google OAuth Authorized JavaScript origins
- Google OAuth redirect URI: `https://your-domain/api/auth/callback/google`

## Planning and Course Flow

1. User starts on the homepage or from a topic example
2. Planning chat runs in [src/app/projects/[projectId]/plan/page.tsx](./src/app/projects/%5BprojectId%5D/plan/page.tsx)
3. `/api/chat` drives the planning conversation
4. Explicit "Create Course" triggers plan generation
5. Extracted structure is saved through `/api/projects`
6. User lands on the plan review page
7. Confirming the plan activates the project
8. The project overview page becomes the course home
9. Lesson content is generated on demand, with the first lesson auto-generated after confirmation

Important product rule:
- Backend plan JSON should stay in backend/state and should not appear in the visible planning chat UI

## Data Model Overview

Main entities in [prisma/schema.prisma](./prisma/schema.prisma):

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `LearningProject`
- `Chapter`
- `Subchapter`
- `LessonContent`
- `ProjectChatThread`
- `ProjectChatMessage`
- `ProgressState`

Notable schema details:
- `LearningProject` stores bilingual title/topic/description/goals
- `ProjectChatThread` stores `conversationLanguage`
- `LessonContent` stores `contentType`, `lang`, `status`, and `body`
- `User` includes guest trial fields

## Deployment on Railway

This project is currently designed to run on Railway with SQLite on a persistent volume.

### Recommended setup

1. Create a Railway service from this repository
2. Attach a persistent volume mounted at `/data`
3. Set:

```env
DATABASE_URL=file:/data/prod.db
NODE_ENV=production
AUTH_URL=https://your-domain
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_TRUST_HOST=true
```

4. Add one AI provider configuration
5. Build command:

```bash
pnpm build
```

6. Start command:

```bash
pnpm start:railway
```

`start:railway` runs:
- `pnpm db:migrate:deploy`
- `next start`

### Important note

The current production architecture is still SQLite-based and works for small-scale deployment, prototypes, and limited pilots. If you plan to scale significantly, the first architectural upgrade should be moving from SQLite to Postgres and separating long-running AI generation from request/response paths.

## Working from Another Computer

Recommended workflow:

1. Push the code you want to keep
2. On the other machine:

```bash
git clone <repo>
pnpm install
```

3. Copy your local `.env`
4. If you need local DB state, copy:

```text
prisma/dev.db
```

5. Start:

```bash
pnpm dev
```

Also read [HANDOFF.md](./HANDOFF.md), which is meant to transfer project context between machines.

## Known Practical Notes

- `.env` is ignored by Git and does not get pushed
- `pnpm-lock.yaml` should stay committed for reproducible installs
- Browser caches may hold onto old logo assets if the path stays the same
- Existing generated lesson content will not automatically update when prompts change; regenerate content if you want newer formatting rules applied
- If planning chat starts leaking raw JSON, the issue is usually in plan extraction or sanitization, not in the visible UI layer alone

## Troubleshooting

### Google login issues

Common causes:
- `AUTH_URL` mismatch
- Missing Google redirect URI
- Missing `AUTH_TRUST_HOST=true`
- Database tables not migrated

### Guest login issues

Common cause:
- Production DB missing the guest-related migration

### AI provider not configured

This means the current environment variables do not match any provider path recognized by [src/lib/ai/provider.ts](./src/lib/ai/provider.ts).

### Math formulas render as plain text

Lesson and chat rendering now support LaTeX via `remark-math` and `rehype-katex`, but old content may need regeneration if the model originally wrote formulas as plain text instead of `$...$` / `$$...$$`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Auth.js Documentation](https://authjs.dev)
