# 발달나침반 — 프로젝트 스펙 문서

## 1. 개요

**발달나침반(Development Compass)** 은 근거 기반(evidence-based) 아동 발달 정보를 부모에게 쉽게 전달하기 위한 웹 플랫폼입니다. 소아과, 발달심리학, 언어병리학 등의 학술 논문을 요약하여 한국어로 제공하며, AI 기반 발달 상담 기능을 포함합니다.

---

## 2. 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router), React 19, TypeScript 5 |
| 데이터베이스 | Supabase (PostgreSQL) |
| 인증 | Supabase Auth (`@supabase/ssr`) |
| 서버 상태 | TanStack React Query v5 |
| 클라이언트 상태 | Zustand v5 |
| 스타일링 | Tailwind CSS 4, shadcn/ui, `@tailwindcss/typography` |
| 콘텐츠 에디터 | `@uiw/react-md-editor` (어드민), `react-markdown` + `remark-gfm` (렌더링) |
| AI | OpenAI GPT-4o (발달 상담) |
| 아이콘 | Lucide React |
| 테마 | next-themes (라이트/다크) |

---

## 3. 데이터 모델

### 3.1 핵심 테이블

**topics** — 발달 관련 주제 글

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| slug | string (unique) | URL 경로 |
| title | string | 제목 |
| summary | string? | 요약 (마크다운) |
| body | string? | 본문 (마크다운) |
| category | enum | autism, adhd, language, social, sensory, age_development |
| min_age_months | number? | 최소 대상 연령 (개월) |
| max_age_months | number? | 최대 대상 연령 (개월) |
| published | boolean | 공개 여부 |
| created_at | timestamp | |

**papers** — 논문 요약

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| slug | string (unique) | |
| title | string | |
| summary | string? | 요약 (마크다운) |
| key_points | string[]? | 핵심 포인트 (배열) |
| limitations | string? | 한계점 (마크다운) |
| parent_interpretation | string? | 부모를 위한 해석 (마크다운) |
| year | number? | 출판 연도 |
| journal | string? | 저널명 |
| source_url | string? | 원문 링크 |
| published | boolean | |
| created_at | timestamp | |

**guides** — 실용 가이드

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| slug | string (unique) | |
| title | string | |
| body | string? | 본문 (마크다운) |
| type | enum | observation, action, age_guide |
| min_age_months | number? | |
| max_age_months | number? | |
| published | boolean | |
| created_at | timestamp | |

### 3.2 조인 테이블

- **topic_papers** (topic_id, paper_id) — 주제-논문 다대다
- **topic_guides** (topic_id, guide_id) — 주제-가이드 다대다

### 3.3 타입 정의

`src/lib/supabase/types.ts`에 수동 정의 (자동 생성 아님).

---

## 4. 라우트 구조

### 4.1 공개 페이지

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 페이지 — 카테고리 그리드, 연령대 네비게이션, 서비스 소개 |
| `/topics` | 주제 목록 — 카테고리·연령 필터 |
| `/topics/[slug]` | 주제 상세 — 관련 논문·가이드 표시 |
| `/papers` | 논문 목록 |
| `/papers/[slug]` | 논문 상세 — 요약, 핵심 포인트, 한계점, 부모 해석 |
| `/guides` | 가이드 목록 — 유형·연령 필터 |
| `/guides/[slug]` | 가이드 상세 |
| `/ages/[ageBand]` | 연령대별 주제·가이드 필터 뷰 |
| `/consultation` | AI 발달 상담 (3단계 플로우) |

### 4.2 어드민 페이지

| 경로 | 설명 |
|------|------|
| `/admin` | 대시보드 — 콘텐츠 통계 |
| `/admin/login` | 관리자 로그인 |
| `/admin/topics` | 주제 관리 (목록) |
| `/admin/topics/new` | 주제 생성 |
| `/admin/topics/[id]/edit` | 주제 수정/삭제 |
| `/admin/papers` | 논문 관리 |
| `/admin/papers/new` | 논문 생성 |
| `/admin/papers/[id]/edit` | 논문 수정/삭제 |
| `/admin/guides` | 가이드 관리 |
| `/admin/guides/new` | 가이드 생성 |
| `/admin/guides/[id]/edit` | 가이드 수정/삭제 |

### 4.3 API

| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/api/consultation` | POST | AI 발달 상담 — GPT-4o 스트리밍 응답 |

---

## 5. 주요 기능

### 5.1 콘텐츠 탐색

- **6개 카테고리**: 자폐 관련 신호, ADHD/주의집중, 언어발달, 사회성, 감각 반응, 연령별 발달
- **6개 연령대**: 0-12개월, 12-24개월, 24-36개월, 3-4세, 4-5세, 5-6세
- **3개 가이드 유형**: 관찰 포인트, 행동 가이드, 연령별 가이드
- 카테고리별 아이콘·색상 코딩
- 마크다운 렌더링으로 서식 있는 콘텐츠 표시

### 5.2 AI 발달 상담

3단계 워크플로우:
1. **아이 정보 입력** — 생년월일, 성별 (개월 수 자동 계산)
2. **증상 선택** — 연령대별 발달 도메인 증상 체크리스트 + 자유 텍스트
3. **AI 분석** — GPT-4o 스트리밍 응답, 도메인별 상태(정상 범위 / 관찰 필요 / 전문가 상담 권장), 종합 요약, 추천 사항

### 5.3 어드민 CMS

- 주제/논문/가이드 CRUD
- 마크다운 에디터 (실시간 미리보기, 툴바)
- 자동 슬러그 생성
- 공개/비공개 토글
- TanStack Query 뮤테이션으로 낙관적 업데이트

### 5.4 인증

- Supabase Auth (이메일/비밀번호)
- 미들웨어에서 세션 쿠키 자동 갱신
- 어드민 라우트 보호 (미인증 시 로그인 리다이렉트)
- Zustand 스토어로 클라이언트 인증 상태 관리

### 5.5 테마

- 라이트/다크 모드 지원
- 시스템 설정 자동 감지
- next-themes로 전환

---

## 6. 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (폰트, 프로바이더, Header/Footer)
│   ├── page.tsx                # 랜딩 페이지
│   ├── globals.css             # Tailwind 설정, 테마 변수
│   ├── consultation/           # AI 상담 페이지
│   ├── topics/                 # 주제 목록 + [slug] 상세
│   ├── papers/                 # 논문 목록 + [slug] 상세
│   ├── guides/                 # 가이드 목록 + [slug] 상세
│   ├── ages/[ageBand]/         # 연령대별 필터 뷰
│   ├── admin/                  # 어드민 대시보드 + CMS
│   │   ├── _components/        # AdminShell, TopicForm/List, PaperForm/List, GuideForm/List
│   │   ├── login/
│   │   ├── topics/
│   │   ├── papers/
│   │   └── guides/
│   └── api/consultation/       # AI 상담 API 라우트
├── components/
│   ├── layout/                 # Header, Footer
│   ├── ui/                     # shadcn/ui (Button, Card, Badge, Input, Select, ...)
│   ├── markdown-editor.tsx     # 마크다운 에디터 (어드민)
│   ├── markdown-renderer.tsx   # 마크다운 렌더러 (공개 페이지)
│   └── theme-toggle.tsx        # 테마 전환 버튼
├── hooks/                      # useTopics, usePapers, useGuides (CRUD 훅)
├── stores/                     # auth-store.ts (Zustand)
├── providers/                  # ThemeProvider, QueryProvider
├── lib/
│   ├── supabase/               # server.ts, client.ts, middleware.ts, types.ts
│   ├── consultation/           # symptoms.ts, prompt.ts, types.ts
│   ├── constants.ts            # 카테고리/가이드 라벨, 색상, 연령대
│   ├── query-client.ts         # React Query 클라이언트 설정
│   └── utils.ts                # cn() 유틸리티
└── proxy.ts                    # Next.js 미들웨어 (세션 갱신)
```

---

## 7. 환경 변수

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 |
| `OPENAI_API_KEY` | OpenAI API 키 (서버 전용) |
