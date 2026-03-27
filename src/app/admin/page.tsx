import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [topicsRes, papersRes, guidesRes] = await Promise.all([
    supabase.from("topics").select("id", { count: "exact", head: true }),
    supabase.from("papers").select("id", { count: "exact", head: true }),
    supabase.from("guides").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "주제",
      count: topicsRes.count ?? 0,
      href: "/admin/topics",
    },
    {
      label: "논문",
      count: papersRes.count ?? 0,
      href: "/admin/papers",
    },
    {
      label: "가이드",
      count: guidesRes.count ?? 0,
      href: "/admin/guides",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">관리자 대시보드</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle>{s.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold">{s.count}</span>
              <Link href={s.href} className={buttonVariants({ variant: "outline", size: "sm" })}>
                관리
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
