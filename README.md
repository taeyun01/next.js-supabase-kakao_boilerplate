# Next.js + Supabase + Kakao 보일러플레이트

Supabase 공식 `with-supabase` 스타터 + 카카오 로그인.

## 새 프로젝트 시작

```bash
npx create-next-app -e https://github.com/<you>/<this-repo> my-app
cp .env.example .env.local   # Supabase URL / publishable key 입력
npm run dev
```

## 프로젝트마다 할 설정 체크리스트

### Kakao Developers (developers.kakao.com)
- [ ] 애플리케이션 추가
- [ ] 카카오 로그인 → 활성화 ON
- [ ] Redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
- [ ] 보안 → Client Secret 발급 + 활성화
- [ ] 동의항목: 닉네임, 프로필 사진 (이메일 `account_email`은 비즈앱만 가능)

### Supabase 대시보드
- [ ] Authentication → Providers → Kakao: REST API 키 / Client Secret 입력
- [ ] 비즈앱 아니면 "Allow users without an email" 켜기 (안 켜면 로그인 실패)
- [ ] Authentication → URL Configuration → Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://<배포도메인>/auth/callback`

## 구조
- `app/page.tsx` — 빈 홈 (여기서부터 시작)
- `app/auth/login` — 카카오 로그인 페이지 (버튼만)
- `app/protected` — 로그인해야 접근 가능한 페이지 (로그인 후 기본 이동 경로)
- `app/test` — 카카오/Supabase 설정 점검 페이지. **배포 전 `app/test`와 `lib/supabase/proxy.ts`의 `/test` 줄 삭제**
- `components/kakao-login-button.tsx` — 카카오 로그인 버튼 (`next` prop으로 로그인 후 이동 경로 지정)
- `app/auth/callback/route.ts` — OAuth code → 세션 교환
- `lib/supabase/*`, `proxy.ts` — Supabase 클라이언트, 세션 갱신, 미로그인 시 `/auth/login` 리다이렉트
- UI는 shadcn `button`, `card`만 남김. 더 필요하면 `npx shadcn@latest add <name>`
