# 발달나침반 TODO

## 즉시 해야 할 것 (Supabase 설정)
- [ ] Supabase 대시보드 → SQL Editor에서 `supabase/migrations/001_initial_schema.sql` 실행 (nachimban 스키마 + 테이블 생성)
- [ ] Supabase 대시보드 → Settings → API → **Exposed schemas**에 `nachimban` 추가
- [ ] `.env.local`의 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 값 확인 — 현재 `sb_publishable_...` 형식인데, Supabase 대시보드 → Settings → API에서 `anon public` 키 (`eyJ...`로 시작하는 JWT) 확인 후 교체 필요할 수 있음
- [ ] Supabase MCP 연결 확인 (`/mcp`에서 supabase 서버 정상 로드 확인)

## 콘텐츠 입력
- [ ] Admin 계정 생성 (Supabase Auth → Users에서 이메일/비밀번호로 생성)
- [ ] `/admin/login`으로 로그인 후 Topics / Papers / Guides 샘플 콘텐츠 입력
- [ ] RLS 정책에 admin용 INSERT/UPDATE/DELETE 정책 추가 (현재는 SELECT만 있음)

## 기능 개선
- [ ] 아이 생년월일 입력 → 개월수 자동 계산 → 맞춤 콘텐츠 (LocalStorage 저장, 회원가입 없음)
- [ ] 검색 기능 구현 (Supabase full-text search)
- [ ] SEO 메타데이터 (각 페이지별 동적 title/description)
- [ ] 반응형 모바일 UI 개선

## 배포
- [ ] Vercel 프로젝트 연결 및 환경변수 설정
- [ ] 도메인 연결
