<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Guidelines for 발달나침반

## Language
- All user-facing text (UI labels, error messages, placeholder text) must be in Korean.
- Code comments, variable names, and documentation may use English.

## Content Fields
- Long text fields (body, summary, limitations, parent_interpretation) store **Markdown**.
- Use `MarkdownEditor` (`src/components/markdown-editor.tsx`) in admin forms.
- Use `MarkdownRenderer` (`src/components/markdown-renderer.tsx`) on public pages.
- `key_points` in papers is a `string[]` — stored as newline-separated text in admin, rendered as a custom list on detail pages. Do NOT convert to markdown.

## Supabase
- Types are manually defined in `src/lib/supabase/types.ts`. Update them when schema changes.
- Use `createClient()` from `src/lib/supabase/server.ts` in Server Components and Route Handlers.
- Use `createClient()` from `src/lib/supabase/client.ts` in Client Components (via hooks).
- Session refresh is handled by middleware (`src/proxy.ts` → `src/lib/supabase/middleware.ts`).

## State Management
- Server state: TanStack React Query. CRUD hooks are in `src/hooks/use-{topics,papers,guides}.ts`.
- Client state: Zustand auth store (`src/stores/auth-store.ts`). Only used for auth — prefer React Query for data.
- Query client config: `src/lib/query-client.ts` (5-min stale time).

## Styling
- Tailwind CSS 4 with `@tailwindcss/typography` for prose rendering.
- shadcn/ui components in `src/components/ui/`.
- Dark mode via next-themes — use `dark:` variants. The markdown editor uses `data-color-mode` attribute.
- Category/guide colors are defined in `src/lib/constants.ts`.

## AI Consultation
- Endpoint: `POST /api/consultation` — streams GPT-4o responses.
- Symptoms are age-stratified: `src/lib/consultation/symptoms.ts`.
- System prompt and user prompt builder: `src/lib/consultation/prompt.ts`.
- Response types: `src/lib/consultation/types.ts`.

## Conventions
- Slug auto-generation from title (Korean + English safe) via `toSlug()` in form components.
- Admin routes are protected — check auth in layout/page components.
- Use `notFound()` from `next/navigation` when data is not found.
- Prefer Server Components; use `"use client"` only when needed (forms, interactivity, hooks).
