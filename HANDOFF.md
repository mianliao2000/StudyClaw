# Pandora AI Handoff

This document is for continuing development on another computer without losing the project context.

## 1. What This Project Is

Pandora AI is a bilingual AI learning platform. A user can:

1. Sign in with Google or use guest trial mode
2. Describe a topic they want to learn
3. Refine scope through an AI planning conversation
4. Confirm the generated course structure
5. Study generated lesson content
6. Use an in-lesson AI tutoring assistant

The codebase is a Next.js App Router full-stack app with pages, API routes, shared UI, AI provider logic, and Prisma schema all inside one repository.

## 2. Current Core Architecture

- Frontend and backend live in one Next.js app
- Database: Prisma + SQLite
- Production deployment: Railway + persistent volume
- Auth: Auth.js / NextAuth with Google
- AI providers currently supported in code:
  - ChatGPT OAuth bridge
  - OpenRouter
  - MiniMax
  - OpenAI-compatible providers
  - `ANTHROPIC_*` alias env support for compatible endpoints

## 3. Important Files to Know First

- [README.md](./README.md)
  Main project documentation
- [prisma/schema.prisma](./prisma/schema.prisma)
  Database schema
- [src/lib/auth.ts](./src/lib/auth.ts)
  Auth.js configuration
- [src/lib/db.ts](./src/lib/db.ts)
  Prisma client
- [src/lib/ai/prompts.ts](./src/lib/ai/prompts.ts)
  Planning / tutoring / content generation prompts
- [src/lib/ai/provider.ts](./src/lib/ai/provider.ts)
  AI provider selection
- [src/app/api/chat/route.ts](./src/app/api/chat/route.ts)
  Main chat API route
- [src/app/projects/[projectId]/plan/page.tsx](./src/app/projects/%5BprojectId%5D/plan/page.tsx)
  Planning UI and planning state machine
- [src/components/lesson/learning-page-shell.tsx](./src/components/lesson/learning-page-shell.tsx)
  Learning page layout shell
- [src/components/lesson/lesson-content.tsx](./src/components/lesson/lesson-content.tsx)
  Lesson content rendering

## 4. Current Product Behavior

### Planning flow

- User enters through homepage topic or manual input
- Planning begins on the project planning page
- "Create Course" should be an explicit action
- Backend course structure JSON should not appear in visible chat
- Confirming the plan routes to the project overview page, not directly into the lesson page

### Learning flow

- Project overview page shows the full chapter tree
- Lesson pages render main content, summary, and quiz
- AI tutor lives inside the learning workspace

## 5. Current Local Working Tree Status

At the time this handoff file was generated, the current machine had unpushed local changes:

- `package.json`
- `pnpm-lock.yaml`
- `src/app/api/chat/route.ts`
- `src/app/globals.css`
- `src/app/projects/[projectId]/plan/page.tsx`
- `src/components/chat/chat-panel.tsx`
- `src/components/lesson/learning-page-shell.tsx`
- `src/components/lesson/lesson-content.tsx`
- `src/lib/ai/openai-api.ts`
- `src/lib/ai/prompts.ts`
- `src/lib/ai/provider.ts`
- `src/lib/ai/plan-structure.ts` (new file)

These local changes should be reviewed before switching machines if you want them preserved remotely.

## 6. Before You Move to Another Computer

Recommended checklist:

1. Check current status:

```bash
git status
```

2. If current local work should be preserved, commit and push it
3. Copy `.env`
4. If local test data matters, also copy:

```text
prisma/dev.db
```

## 7. Setup on the New Computer

```bash
git clone <repo-url>
cd <repo-folder>
pnpm install
```

Then:

1. Copy `.env` from the old machine
2. Optionally copy `prisma/dev.db`
3. Run:

```bash
pnpm dev
```

4. If you need a production-style check:

```bash
pnpm run build
```

## 8. Environment Variables to Bring Over

At minimum:

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
```

Then one AI provider configuration, for example:

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
OPENROUTER_SITE_URL="http://localhost:3000"
OPENROUTER_APP_NAME="Pandora AI"
```

### Compatible provider via `ANTHROPIC_*`

```env
ANTHROPIC_AUTH_TOKEN="..."
ANTHROPIC_MODEL="..."
ANTHROPIC_BASE_URL="..."
```

## 9. Things That Do Not Automatically Transfer

- This chat conversation
- Your unsaved local edits
- Your `.env`
- Your local SQLite DB
- Browser localStorage state

If you need AI to retain project context on the next machine, point it to:
- [README.md](./README.md)
- [HANDOFF.md](./HANDOFF.md)

## 10. Known Areas Worth Paying Attention To

### Planning chat

- This area is sensitive because it mixes:
  - visible chat messages
  - hidden planning state
  - backend structure generation
- Be careful not to let backend JSON leak into visible chat UI

### Learning layout

- Learning pages use shared shell/layout state
- Assistant layout and visibility behavior should remain consistent across lesson pages

### Content generation

- Prompt changes only affect newly generated or regenerated content
- Existing content stored in DB may need regeneration

### Production deployment

- Current Railway setup depends on SQLite on a volume
- This is okay for current scale, but future scaling should move toward Postgres + queue + Redis

## 11. Recommended First Steps on a New Machine

If you are continuing active feature work:

1. Read [README.md](./README.md)
2. Read [HANDOFF.md](./HANDOFF.md)
3. Run `git status`
4. Confirm `.env` is present
5. Run `pnpm dev`
6. Verify:
   - homepage loads
   - login works
   - planning page works
   - lesson page works

## 12. Current Brand

The current product/brand name is:

**Pandora AI**

