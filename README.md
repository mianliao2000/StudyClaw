## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + SQLite (`better-sqlite3`)
- Auth.js / NextAuth v5 (Google OAuth)
- OpenAI / ChatGPT OAuth provider bridge

## Railway Deployment

This project is set up to run on Railway as a Node.js server with a persistent volume for SQLite.

1. Create a Railway service from this repository.
2. Attach a volume and mount it at `/data`.
3. Set `DATABASE_URL` to `file:/data/prod.db`.
4. Set production secrets:
   - `AUTH_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `OPENAI_API_KEY`
5. Use `pnpm build` as the build command.
6. Use `pnpm start:railway` as the start command.
7. In Google Cloud Console, add the redirect URI:
   - `https://<your-domain>/api/auth/callback/google`

Notes:
- `DATABASE_URL` is used by both Prisma migrations and the runtime client.
- The ChatGPT OAuth bridge is optional in production. On Railway, `OPENAI_API_KEY` is the simplest setup.
- Do not reuse local development secrets in production. Generate fresh values before launch.

## Production Notes

- The app uses Next.js Route Handlers under `src/app/api`.
- This is not a static export. Deploy it with `next start`.
- SQLite must live on persistent storage in production.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
