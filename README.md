# 발달나침반 (Development Compass)

근거 기반 아동 발달 정보 플랫폼 — 학술 논문을 쉽게 풀어, 부모가 아이의 발달을 이해하도록 돕습니다.

## 주요 기능

- **발달 주제 탐색** — 자폐, ADHD, 언어, 사회성, 감각, 연령별 발달 등 6개 카테고리
- **논문 요약** — 핵심 포인트, 한계점, 부모를 위한 해석
- **실용 가이드** — 관찰 포인트, 행동 가이드, 연령별 가이드
- **연령대별 필터** — 0~6세, 6개 연령 구간
- **AI 발달 상담** — GPT-4o 기반 증상 분석 및 추천
- **어드민 CMS** — 마크다운 에디터로 콘텐츠 관리
- **다크 모드** — 라이트/다크 테마 지원

## 기술 스택

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Supabase** — PostgreSQL, Auth
- **TanStack React Query** + **Zustand**
- **Tailwind CSS 4** + **shadcn/ui**
- **OpenAI GPT-4o** — AI 상담
- **@uiw/react-md-editor** + **react-markdown** — 마크다운 에디터/렌더러

## 시작하기

### 사전 요구 사항

- Node.js 18+
- Supabase 프로젝트 (테이블: topics, papers, guides, topic_papers, topic_guides)
- OpenAI API 키

### 설치

```bash
git clone https://github.com/yono92/baldal-nachimban.git
cd baldal-nachimban
npm install
```

### 환경 변수

`.env.local` 파일을 생성합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### 실행

```bash
npm run dev     # 개발 서버 (http://localhost:3000)
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버
npm run lint    # ESLint
```

## 프로젝트 구조

```
src/
├── app/                    # 라우트 (랜딩, 주제, 논문, 가이드, 상담, 어드민)
├── components/             # UI 컴포넌트 (shadcn/ui, 마크다운, 레이아웃)
├── hooks/                  # 데이터 CRUD 훅 (React Query)
├── stores/                 # 인증 스토어 (Zustand)
├── providers/              # Theme, Query 프로바이더
└── lib/
    ├── supabase/           # DB 클라이언트, 타입, 미들웨어
    ├── consultation/       # AI 상담 (증상, 프롬프트, 타입)
    └── constants.ts        # 카테고리, 연령대, 라벨
```

자세한 스펙은 [docs/SPEC.md](docs/SPEC.md)를 참고하세요.

## 라이선스

Private
