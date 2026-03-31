# Pandora AI

Pandora AI is a bilingual AI learning platform for turning a broad learning goal into a structured course, then studying it through generated lessons, summaries, quizzes, and an in-course AI tutor.

## Core Features

- AI planning conversation that narrows a topic through guided dialogue
- Official sample courses that are preloaded and can be opened instantly from the homepage
- Structured course generation with chapters and subchapters
- Bilingual experience with Chinese and English UI and course content
- Lesson generation for:
  - main lesson text
  - chapter/section summaries
  - quizzes
- In-course AI tutor for follow-up questions during study
- Learning progress tracking for each project
- Add an official sample course into "My Projects" as a real learning project
- Guest trial mode and Google sign-in
- Responsive homepage, dashboard, and learning workspace

## Product Flow

1. Start from the homepage with a learning goal or a suggested topic
2. Enter the planning conversation
3. Let AI narrow the scope, level, and direction
4. Generate and review the course structure
5. Confirm the course
6. Study lesson content, summaries, and quizzes
7. Continue asking questions through the AI tutor

## Official Sample Courses

The homepage includes official sample courses that are fully prepared in advance, so learners can click and start immediately without waiting for generation.

Current sample catalog:

- AI Agent Systems
- Large Language Models: Principles and Applications
- Quantitative Finance: Research and Strategy
- Power Electronics Systems

Sample course behavior:

- Publicly browsable course overview, lessons, summaries, and quizzes
- Bilingual lesson content in Chinese and English
- Temporary sample-course tutor chat for signed-in or guest sessions
- One-click import into a private project for persistent progress and tutoring

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma 7
- SQLite with `better-sqlite3`
- Auth.js / NextAuth v5 beta
- OpenAI-compatible AI provider abstraction

## Main Pages

- `/`
  Homepage
- `/about`
  About page
- `/login`
  Login page
- `/dashboard`
  Project dashboard
- `/settings`
  User settings
- `/projects/new`
  New project entry
- `/projects/[projectId]/plan`
  AI planning conversation
- `/projects/[projectId]/review`
  Course review and confirmation
- `/projects/[projectId]`
  Project overview
- `/projects/[projectId]/chapters/[chapterId]/subchapters/[subchapterId]/main`
  Main lesson page
- `/projects/[projectId]/chapters/[chapterId]/subchapters/[subchapterId]/summary`
  Summary page
- `/projects/[projectId]/chapters/[chapterId]/subchapters/[subchapterId]/quiz`
  Quiz page
- `/examples/[courseSlug]`
  Official sample course overview
- `/examples/[courseSlug]/chapters/[chapterSlug]/subchapters/[subchapterSlug]/[lessonType]`
  Official sample course lesson pages

## Local Development

### Prerequisites

- Node.js 22 or another recent Node version compatible with this repo
- `pnpm` 10

### Install

```bash
corepack pnpm install
```

### Environment Setup

Create a local `.env` from `.env.example`.

Minimum required values:

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="replace-with-a-random-secret"
AUTH_GOOGLE_ID="replace-with-google-client-id"
AUTH_GOOGLE_SECRET="replace-with-google-client-secret"
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST=true
```

Choose one AI provider block and keep the others commented out.

### Database

Run migrations before the first local launch:

```bash
corepack pnpm prisma migrate deploy --config prisma.config.ts
```

### Start

```bash
corepack pnpm dev
```

Open:

```text
http://localhost:3000
```

### Production Build Check

```bash
corepack pnpm build
```

## Testing

Automated health checks verify the production site after every deploy. Tests run against a live URL — they do **not** mock the database or AI layer.

> Tests target the **built app** (`pnpm start`), not the dev server (`pnpm dev`). Running against `pnpm dev` may produce false failures due to dev-mode SSR differences.

### Smoke Tests (HTTP layer, no browser)

Fast checks (~30 s) that verify pages load and APIs respond correctly. Safe to run at any time — no AI calls are triggered.

```powershell
$env:PRODUCTION_URL="https://pandora-ai.up.railway.app"; pnpm test:smoke
```

Checks performed:

| Check | What it verifies |
|---|---|
| Page availability | `/`, `/login`, `/about`, `/examples/ai-agent-development` return 200 |
| Guest auth flow | `POST /api/auth/guest` returns `{ success: true }` and sets a session cookie |
| Protected endpoints | `/api/chat`, `/api/generate`, `/api/projects` return 401 for unauthenticated requests |
| Authenticated pages | `/dashboard` and `/projects/[id]/plan` load correctly with a guest session |

### E2E Tests (Playwright, Chromium)

Browser-level tests that exercise real user flows. Requires Chromium installed locally.

```powershell
# Install Chromium once
pnpm exec playwright install chromium

$env:PRODUCTION_URL="https://pandora-ai.up.railway.app"; pnpm test:e2e
```

Flows covered:

- Homepage loads with a visible heading
- About page shows content
- Example course page loads without auth
- Guest login → redirects to `/dashboard`
- `/projects/new` creates a project and redirects to the planning page
- Google OAuth button redirects to `accounts.google.com`

### Run Both Together

```powershell
$env:PRODUCTION_URL="https://pandora-ai.up.railway.app"; pnpm test:all
```

### AI Probe (optional, costs money)

Tests that all three AI features can actually reach the configured model. Creates and then deletes a real guest project.

```powershell
$env:PRODUCTION_URL="https://pandora-ai.up.railway.app"; pnpm test:ai-probe
```

Probes:

1. Planning chat (对话框) — sends a message, verifies streaming starts
2. Content generation (正文生成) — confirms a lesson, generates main content, verifies body is returned
3. AI tutor (AI助手) — sends a tutoring message, verifies streaming starts

### CI/CD — GitHub Actions

The workflow at [`.github/workflows/production-health.yml`](./.github/workflows/production-health.yml) runs automatically after every push to `main`.

**How it works:**

1. After a push, the workflow watches the GitHub Deployments API until Railway reports the deploy as `success` (up to 15 minutes). This ensures tests run against the new code, not the old version still serving traffic during a rolling deploy.
2. Runs smoke tests.
3. Runs E2E tests.
4. Uploads a Playwright HTML report as a build artifact (retained 14 days).

**Manual trigger:**

Go to **Actions → Production Health Check → Run workflow**. Two optional flags:

- `skip_delay` — skips the Railway wait, runs immediately
- `run_ai_probe` — also runs the AI probe (triggers real AI calls)

**Required GitHub secret:**

| Secret | Value |
|---|---|
| `PRODUCTION_URL` | `https://pandora-ai.up.railway.app` |

Add it at: Repository **Settings → Secrets and variables → Actions → New repository secret**.

## Core Environment Variables

### App and Auth

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="replace-with-a-random-secret"
AUTH_GOOGLE_ID="replace-with-google-client-id"
AUTH_GOOGLE_SECRET="replace-with-google-client-secret"
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST=true
```

### OpenAI

```env
OPENAI_API_KEY="replace-with-openai-api-key"
OPENAI_MODEL="gpt-4o"
OPENAI_BASE_URL="https://api.openai.com/v1"
```

### MiniMax

```env
MINIMAX_API_KEY="replace-with-minimax-api-key"
MINIMAX_MODEL="MiniMax-M2.5"
MINIMAX_BASE_URL="https://api.minimax.io/v1"
```

### OpenRouter

This project supports model routing by reasoning strength:

```env
OPENROUTER_API_KEY="replace-with-openrouter-api-key"
OPENROUTER_MODEL_STRONG="stepfun/step-3.5-flash:free"
OPENROUTER_MODEL_MEDIUM="stepfun/step-3.5-flash:free"
OPENROUTER_MODEL_WEAK="nvidia/nemotron-3-super-120b-a12b:free"
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"
OPENROUTER_SITE_URL="https://your-domain.com"
OPENROUTER_APP_NAME="Pandora AI"
```

### Anthropic-Compatible Provider

```env
ANTHROPIC_API_KEY="replace-with-provider-key"
ANTHROPIC_AUTH_TOKEN="replace-with-provider-token"
ANTHROPIC_MODEL="doubao-seed-2.0-pro"
ANTHROPIC_REASONING_MODEL="doubao-seed-2.0-pro"
ANTHROPIC_BASE_URL="https://ark.cn-beijing.volces.com/api/coding"
```

### ChatGPT OAuth Bridge

```env
CODEX_BIN="C:/Users/your-user/.vscode/extensions/openai.chatgpt-<version>/bin/windows-x86_64/codex.exe"
CHATGPT_BRIDGE_SCRIPT="./scripts/chatgpt-oauth-bridge.mjs"
CHATGPT_MODEL="gpt-5.4-mini"
```

`CODEX_BIN` is optional, but it is useful on Windows if `codex` is installed by the VS Code extension and is not available on PATH.

To sign in locally with your ChatGPT account, run:

```bash
corepack pnpm chatgpt:login
```

This uses the local `codex app-server` login flow. It opens a browser window, completes ChatGPT authentication through Codex, and reuses the Codex-managed local session for model calls.

To check whether the local ChatGPT OAuth setup is ready, run:

```bash
corepack pnpm chatgpt:status
```

To verify the current Codex-managed ChatGPT login with a real model call, run:

```bash
corepack pnpm chatgpt:probe
```

## Environment Variables Recognized By The Code

These are the environment variable names that the current code actually reads:

- Database
  - `DATABASE_URL`
- Auth
  - `AUTH_SECRET`
  - `AUTH_URL`
  - `AUTH_TRUST_HOST`
  - `AUTH_GOOGLE_ID`
  - `AUTH_GOOGLE_SECRET`
- OpenRouter
  - `OPENROUTER_API_KEY`
  - `OPENROUTER_BASE_URL`
  - `OPENROUTER_MODEL_STRONG`
  - `OPENROUTER_MODEL_MEDIUM`
  - `OPENROUTER_MODEL_WEAK`
  - optional extras: `OPENROUTER_SITE_URL`, `OPENROUTER_APP_NAME`, `OPENROUTER_MODEL`
- MiniMax
  - `MINIMAX_API_KEY`
  - `MINIMAX_MODEL`
  - `MINIMAX_BASE_URL`
- OpenAI
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL`
  - `OPENAI_BASE_URL`
- ChatGPT bridge
  - `CHATGPT_BRIDGE_SCRIPT`
  - `CHATGPT_MODEL`
  - `CODEX_BIN`
  - `CHATGPT_CODEX_BIN`
- Anthropic-compatible
  - `ANTHROPIC_API_KEY`
  - `ANTHROPIC_AUTH_TOKEN`
  - `ANTHROPIC_MODEL`
  - `ANTHROPIC_REASONING_MODEL`
  - `ANTHROPIC_BASE_URL`

## AI Configuration Notes

- The app selects the active provider entirely from the uncommented lines in `.env`
- Uncomment the provider block you want to use
- If multiple blocks are left enabled by accident, OpenRouter/MiniMax/OpenAI/Anthropic-compatible win before the ChatGPT bridge
- Reasoning intensity is selected automatically by task
- When using OpenRouter:
  - low-intensity tasks use `OPENROUTER_MODEL_WEAK`
  - medium-intensity tasks use `OPENROUTER_MODEL_MEDIUM`
  - high-intensity tasks use `OPENROUTER_MODEL_STRONG`

Typical task split:

- planning conversation: medium
- plan generation: medium
- lesson generation: low
- summary generation: low
- quiz generation: low
- tutor chat: low

## Database Model Overview

Main Prisma models:

- `User`
- `UserPreferences`
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

Useful schema notes:

- `LearningProject`, `Chapter`, and `Subchapter` support bilingual fields
- `LessonContent` stores both language and content type
- `ProjectChatThread` stores planning and tutoring conversations
- `ProgressState` tracks the learnerâ€™s current position and completion
- `UserPreferences` stores AI and learning defaults

## Deployment

This project can run on a small deployment using SQLite on a persistent volume.

### Recommended Production Environment

```env
DATABASE_URL="file:/data/prod.db"
NODE_ENV="production"
AUTH_URL="https://your-domain.com"
AUTH_SECRET="replace-with-a-random-secret"
AUTH_GOOGLE_ID="replace-with-google-client-id"
AUTH_GOOGLE_SECRET="replace-with-google-client-secret"
AUTH_TRUST_HOST=true
```

Add one AI provider block on top of that.

### Recommended Commands

Build:

```bash
corepack pnpm build
```

Start with migration:

```bash
corepack pnpm start:railway
```

`start:railway` runs:

- `pnpm db:migrate:deploy`
- `next start`

## Important Operational Notes

- `.env` is local and should not be committed
- Run Prisma migrations in every deployed environment
- If you change the public domain, update:
  - `AUTH_URL`
  - Google OAuth allowed origins
  - Google OAuth callback URL
- Existing generated lesson content will not automatically rewrite itself when prompts or formatting rules change

## Repository Pointers

- [prisma/schema.prisma](./prisma/schema.prisma)
  Prisma schema
- [prisma/migrations](./prisma/migrations)
  Database migrations
- [src/lib/auth.ts](./src/lib/auth.ts)
  Auth configuration
- [src/lib/db.ts](./src/lib/db.ts)
  Prisma client
- [src/lib/ai/provider.ts](./src/lib/ai/provider.ts)
  AI provider selection
- [src/lib/ai/prompts.ts](./src/lib/ai/prompts.ts)
  Planning and generation prompts
- [src/lib/ai/generate-content.ts](./src/lib/ai/generate-content.ts)
  Lesson generation orchestration
- [src/app/api/chat/route.ts](./src/app/api/chat/route.ts)
  Planning and tutor chat API
- [src/app/api/generate/route.ts](./src/app/api/generate/route.ts)
  Content generation API

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Auth.js Documentation](https://authjs.dev)



