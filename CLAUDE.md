# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — run ESLint
- No test runner is configured yet

## Architecture

**발달나침반 (Development Compass)** — a Korean-language, research-based child development guide platform built with Next.js 16 + Supabase.

### Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Supabase (auth via `@supabase/ssr`, database — PostgreSQL)
- TanStack React Query v5 (server state), Zustand v5 (client auth state)
- Tailwind CSS 4, shadcn/ui (cva + tailwind-merge), `@tailwindcss/typography`
- OpenAI GPT-4o for AI consultation
- `@uiw/react-md-editor` (admin editor), `react-markdown` + `remark-gfm` + `remark-breaks` (public rendering)
- next-themes for light/dark mode

### Data Model (Supabase)
Three core entities with many-to-many join tables:
- **Topics** — categorized articles (autism, adhd, language, social, sensory, age_development). Fields: title, slug, summary, body (markdown), category, age range, published.
- **Papers** — research paper summaries. Fields: title, slug, summary (markdown), key_points (string[]), limitations (markdown), parent_interpretation (markdown), year, journal, source_url, published.
- **Guides** — actionable guides (observation, action, age_guide). Fields: title, slug, body (markdown), type, age range, published.

Join tables: `topic_papers`, `topic_guides`

Types are manually defined in `src/lib/supabase/types.ts` (not auto-generated).

### Route Structure

**Public:**
- `/` — landing page (category grid, age bands, about)
- `/topics`, `/papers`, `/guides` — listing pages with filters + `[slug]` detail pages
- `/ages/[ageBand]` — age-band filtered view (0-12, 12-24, 24-36, 36-48, 48-60, 60-72 months)
- `/consultation` — AI consultation (3-step: child info → symptom selection → GPT-4o analysis)

**Admin (auth-protected):**
- `/admin` — dashboard with content stats
- `/admin/login` — admin auth
- `/admin/{topics,papers,guides}` — CRUD management (list, new, [id]/edit)

**API:**
- `POST /api/consultation` — GPT-4o streaming consultation endpoint

### Key Patterns
- Supabase clients: `src/lib/supabase/server.ts` (Server Components), `client.ts` (Client Components), `middleware.ts` (session refresh)
- Middleware: `src/proxy.ts` → `src/lib/supabase/middleware.ts` handles session cookie refresh on all routes
- Data hooks: `src/hooks/use-topics.ts`, `use-papers.ts`, `use-guides.ts` — each exports list query + create/update/delete mutations
- Auth: `src/stores/auth-store.ts` (Zustand) for client-side auth state; Supabase handles server-side
- UI constants and Korean labels: `src/lib/constants.ts` — categories, guide types, age bands, colors, icons
- Layout: shared `Header` + `Footer` in `src/components/layout/`
- Admin forms: `src/app/admin/_components/` — TopicForm, PaperForm, GuideForm with markdown editors
- Markdown: `src/components/markdown-editor.tsx` (admin), `src/components/markdown-renderer.tsx` (public)
- Consultation logic: `src/lib/consultation/` — symptoms.ts (age-stratified), prompt.ts (GPT system/user prompts), types.ts
- Language is Korean (`lang="ko"`) — all user-facing text should be in Korean

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `OPENAI_API_KEY` — OpenAI API key (server-only)
