# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- No test runner is configured yet

## Architecture

**발달나침반 (Development Compass)** — a Korean-language, research-based child development guide platform built with Next.js 16 + Supabase.

### Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Supabase (auth via `@supabase/ssr`, database)
- Tailwind CSS 4, shadcn/ui components (cva + tailwind-merge)
- Middleware handles Supabase session refresh for all routes

### Data Model (Supabase)
Three core entities with many-to-many join tables:
- **Topics** — categorized articles (autism, adhd, language, social, sensory, age_development)
- **Papers** — research paper summaries with key_points, limitations, parent_interpretation
- **Guides** — actionable guides (observation, action, age_guide) with age ranges

Join tables: `topic_papers`, `topic_guides`

Types are manually defined in `src/lib/supabase/types.ts` (not auto-generated).

### Route Structure
- `/` — landing page
- `/topics`, `/papers`, `/guides` — public listing + `[slug]` detail pages
- `/ages/[ageBand]` — age-band filtered view
- `/admin` — admin dashboard with sub-routes for managing topics, papers, guides
- `/admin/login` — admin auth

### Key Patterns
- Supabase clients: `src/lib/supabase/server.ts` (Server Components/Actions), `client.ts` (Client Components), `middleware.ts` (session refresh)
- UI constants and Korean labels live in `src/lib/constants.ts`
- Layout: shared `Header` + `Footer` in `src/components/layout/`
- Language is Korean (`lang="ko"`) — all user-facing text should be in Korean
