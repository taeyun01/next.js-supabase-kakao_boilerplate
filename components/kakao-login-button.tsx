"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function KakaoLoginButton({ next = "/protected" }: { next?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    // On success the browser navigates away; only errors land here.
    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="w-full bg-[#FEE500] text-black/85 hover:bg-[#FEE500]/90"
      >
        {isLoading ? "이동 중..." : "카카오로 시작하기"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
