"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@supabase/supabase-js";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/topics", label: "주제" },
  { href: "/admin/papers", label: "논문" },
  { href: "/admin/guides", label: "가이드" },
  { href: "/admin/glossary", label: "용어" },
];

export function AdminShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUser, clear } = useAuthStore();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    clear();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-2 md:gap-4 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
