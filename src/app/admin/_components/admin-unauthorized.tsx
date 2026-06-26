"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminUnauthorized({ email }: { email?: string | null }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4">
      <Card>
        <CardHeader>
          <CardTitle>관리자 권한이 없습니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {email ? `${email} 계정은` : "현재 계정은"} 관리자 페이지에 접근할 수 없습니다.
          </p>
          <Button variant="outline" onClick={handleLogout}>
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
