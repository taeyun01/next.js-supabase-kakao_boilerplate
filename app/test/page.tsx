import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { KakaoLoginButton } from "@/components/kakao-login-button";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Setup check page. Delete app/test and the "/test" line in lib/supabase/proxy.ts before production.

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function Row({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span>{ok ? "✅" : "❌"}</span>
      <span>
        <b>{label}</b>
        {detail && <span className="block text-muted-foreground">{detail}</span>}
      </span>
    </div>
  );
}

async function fetchProviders() {
  if (!URL_ || !KEY) return { error: "env 없음" };
  try {
    const res = await fetch(`${URL_}/auth/v1/settings`, {
      headers: { apikey: KEY },
      cache: "no-store",
    });
    if (!res.ok) return { error: `HTTP ${res.status} (URL 또는 키 확인)` };
    const json = await res.json();
    return { kakao: Boolean(json?.external?.kakao) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "연결 실패" };
  }
}

async function Checks() {
  const providers = await fetchProviders();
  // createClient() throws without env vars, so skip it and let the checklist report them.
  const { data, error } =
    URL_ && KEY
      ? await (await createClient()).auth.getUser()
      : { data: { user: null }, error: null };
  const user = data.user;
  const meta = user?.user_metadata ?? {};

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. 설정 점검</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <Row label="NEXT_PUBLIC_SUPABASE_URL" ok={!!URL_} />
            <Row label="NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" ok={!!KEY} />
            <Row
              label="Supabase 연결"
              ok={!("error" in providers)}
              detail={"error" in providers ? providers.error : undefined}
            />
            <Row
              label="Kakao provider 활성화 (Supabase 대시보드)"
              ok={"kakao" in providers && !!providers.kakao}
              detail={
                "kakao" in providers && !providers.kakao
                  ? "Authentication → Providers → Kakao 를 켜세요"
                  : undefined
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">2. 로그인 상태</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {user ? (
            <>
              <Row label="로그인됨" ok />
              <dl className="grid grid-cols-[6rem_1fr] gap-1 text-sm">
                <dt className="text-muted-foreground">provider</dt>
                <dd>{user.app_metadata?.provider ?? "-"}</dd>
                <dt className="text-muted-foreground">id</dt>
                <dd className="break-all">{user.id}</dd>
                <dt className="text-muted-foreground">email</dt>
                <dd>{user.email ?? "(없음)"}</dd>
                <dt className="text-muted-foreground">name</dt>
                <dd>{meta.name ?? meta.full_name ?? meta.nickname ?? "-"}</dd>
              </dl>
              <LogoutButton />
            </>
          ) : (
            <>
              <Row
                label="로그인 안 됨"
                ok={false}
                detail={error && error.name !== "AuthSessionMissingError" ? error.message : undefined}
              />
              {URL_ && KEY && <KakaoLoginButton next="/test" />}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default function TestPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Kakao + Supabase 테스트</h1>
      <Suspense fallback={<p className="text-sm">확인 중...</p>}>
        <Checks />
      </Suspense>
    </main>
  );
}
