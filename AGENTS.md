<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Django Adventure — agent notes

Anime-style game that teaches Python → Django → DRF (levels 0–100). Split-screen learn pages (story left, Monaco editor right), Pyodide runs Python in-browser, Gemini grades submissions and forges chapters, MongoDB Atlas stores user progress, Google OAuth & email authentication, Sensei AI coding mentor chatbot, and Snake Arcade mini-game during chapter forging. Strictly no emojis in UI or AI output.

## Commands

```bash
npm run dev        # http://localhost:3000
npm run build      # must pass (Next 16, App Router)
npx tsc --noEmit   # typecheck
npm run lint       # eslint (flat config)
```

Check for an existing dev server on port 3000 (`lsof -nP -iTCP:3000 -sTCP:LISTEN`) before starting another.

## Environment Variables

Configured in `.env` or `.env.local` (never commit secrets):

- `GEMINI_API_KEY` — Google Gemini API key (used server-side for chapter forging, code review, hints, and Sensei chat).
- `GEMINI_MODEL` — primary generation model (`gemini-3.5-flash-lite`).
- `MONGODB_URI` — MongoDB Atlas connection string (e.g. `mongodb+srv://...`).
- `MONGODB_DB` — Database name (default `django_adventure`).
- `GOOGLE_CLIENT_ID` — Google Cloud OAuth 2.0 Client ID.
- `GOOGLE_CLIENT_SECRET` — Google Cloud OAuth 2.0 Client Secret.
- `AUTH_SECRET` — 32+ character random key for signing HMAC-SHA256 session JWT cookies (`da_session`).
- `NEXT_PUBLIC_APP_URL` — Base application URL (`http://localhost:3000` for local dev).

Do NOT add `output: "export"` to `next.config.ts` — dynamic API routes require standard server runtime.

## Architecture

- `src/content/levels.ts` — **The syllabus. Levels 0–9 are hand-written, complete, and editable. Levels 10–100 are outline entries only.** Every chapter carries a `topic` (the real subject, e.g. "Django models", shown on the map and search) plus `projectGoal` (what it adds to the running DinoShop project). Django chapters (8+) build one running project: DinoShop, an online shop; levels 80–100 are a capstone sprint where the learner plans, builds, tests and ships their OWN app. Full content is forged by Gemini on first visit and cached.
- `src/lib/levels.ts` — `Level` type, `TRACK_COLORS`, `TRACK_LABEL`, and `getChapterMascot(levelId)` for deterministic `/blue.png` vs `/yellow.png` assignment. Also `Level.exampleWalkthrough` (plain-words, line-by-line decode of `exampleCode`, rendered as "WHAT EACH LINE DOES") and `LevelTest.expectCount` (stdout must show a text exactly N times, so a loop mission cannot pass with one hand-typed line). `expectCount` is enforced by the RUN monitor in `CodeEditorPanel` (via `countMatches` from `local-check.ts`) and by `localCheck`; assertions may read `__stdout_text`, the captured output exposed by `pyodide.ts`.
- `src/lib/level-generator.ts` — server-side Gemini call that forges one chapter using Guided Learning (LearnLM) pedagogy. Model: `gemini-3.5-flash-lite`. Generation is syllabus-driven: the prompt embeds the full topic list, the 3 previous / 3 next topics, and the chapter's fixed topic + project goal, so lessons connect to what was just learned and advance the running project.
- `src/lib/generated-levels.ts` — disk cache `.generated-levels/<id>.json` (gitignored). A chapter forges exactly once; `DELETE /api/level/<id>` clears one entry.
- `src/app/api/level/[levelId]/route.ts` — GET: serve hand-written / cached / forge-once; DELETE: invalidate cache.
- `src/app/api/ai/review/route.ts` & `src/app/api/ai/hint/route.ts` — server-side AI evaluation routes using server key from `.env` (`gemini-3.5-flash-lite`).
- `src/app/api/ai/chat/route.ts` — Sensei AI mentor chatbot route with strict Python/Django domain guard.
- `src/lib/mongodb.ts` — MongoDB Atlas connection pooling with cached client across HMR, schema definitions (`UserDocument`, `LeaderboardEntry`).
- `src/lib/auth.ts` — Web Crypto HMAC-SHA256 JWT sessions, Google OAuth 2.0 authorization and token exchange, PBKDF2 password hashing.
- `src/app/api/auth/` — `/google`, `/callback/google`, `/register`, `/login`, `/logout`, `/me`.
- `src/app/api/user/progress/route.ts` — Cloud save sync endpoint for MongoDB Atlas.
- `src/app/api/leaderboard/route.ts` — Global rankings based on XP and completed levels.
- `src/components/game/SnakeGame.tsx` — Python Snake Dojo arcade mini-game that runs on outline levels (Level 10+) while Gemini forges the chapter in the background; does not force close when ready.
- `src/components/chat/SenseiChatWidget.tsx` & `src/components/chat/MarkdownRenderer.tsx` — Floating yellow chat button on bottom right with syntax-highlighted code blocks, copy button, and markdown parsing.
- `src/components/game/TopHud.tsx` — Fixed topbar, desktop stats, user avatar initial badge, theme toggle, and responsive mobile drawer.
- `src/components/game/GuestNoticeBanner.tsx` — Progress-aware reminder banner for unauthenticated guests.
- `src/components/game/GrandCelebrationModal.tsx` — Grand Finale celebration modal on Level 100 completion.
- `src/lib/game-store.ts` — Zustand store with `localStorage` persist key `django-adventure-save` (XP, Gems for hints, Streak, Completed levels, Current level).

## Conventions & Gotchas

- Teach before you ask. Every chapter opens with a `guidedLesson` (objective, 4-6 micro-steps, one check question, takeaways) and every `exampleCode` is decoded line by line. Levels 0-9 carry hand-written lessons; Gemini-forged chapters follow the same rule via the prompt in `level-generator.ts` (assume zero prior knowledge, never use syntax an earlier chapter has not introduced, explain colons and indentation in words, and keep the mission a small variation of `exampleCode`). A beginner must never be shown code nobody explained and then be asked to write it.

- Style: Tailwind v4 comic theme (`comic-btn`, `comic-card`, `speech-bubble`, `font-comic`). Colors: `#191924` (ink), `#f2b705` (gold), `#d62839` (crimson), `#2f6bff` (blue). No emojis in UI or AI output.
- React compiler lint rules: no synchronous `setState` in effect bodies, no ref access during render.
- Dark mode via `ThemeProvider` (`src/lib/theme.tsx`); Monaco editor theme switches with it.
- Keep the `<!-- BEGIN:nextjs-agent-rules -->` block untouched.
- `suppressHydrationWarning` on `<html>` and `<body>` prevents theme initialization hydration warnings.
