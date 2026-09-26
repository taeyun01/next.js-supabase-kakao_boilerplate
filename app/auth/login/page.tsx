import { KakaoLoginButton } from "@/components/kakao-login-button";

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <KakaoLoginButton />
      </div>
    </main>
  );
}
