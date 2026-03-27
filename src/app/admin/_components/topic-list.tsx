"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { CATEGORY_LABELS } from "@/lib/constants";
import { useTopics } from "@/hooks/use-topics";

export function TopicList() {
  const { data: topics, isLoading } = useTopics();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4 h-20 animate-pulse bg-muted/30" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {topics?.map((topic) => (
          <div key={topic.id} className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{topic.title}</span>
              <Badge variant={topic.published ? "default" : "secondary"}>
                {topic.published ? "공개" : "비공개"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{CATEGORY_LABELS[topic.category]}</span>
              <span>
                {topic.min_age_months != null && topic.max_age_months != null
                  ? `${topic.min_age_months}~${topic.max_age_months}개월`
                  : "-"}
              </span>
            </div>
            <Link
              href={`/admin/topics/${topic.id}/edit`}
              className={buttonVariants({ variant: "outline", size: "sm" }) + " w-full justify-center"}
            >
              수정
            </Link>
          </div>
        ))}
        {(!topics || topics.length === 0) && (
          <p className="py-8 text-center text-muted-foreground">등록된 주제가 없습니다.</p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">제목</th>
              <th className="px-4 py-2 text-left font-medium">카테고리</th>
              <th className="px-4 py-2 text-left font-medium">상태</th>
              <th className="px-4 py-2 text-left font-medium">연령</th>
              <th className="px-4 py-2 text-right font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {topics?.map((topic) => (
              <tr key={topic.id} className="border-b last:border-0">
                <td className="px-4 py-2 font-medium">{topic.title}</td>
                <td className="px-4 py-2">{CATEGORY_LABELS[topic.category]}</td>
                <td className="px-4 py-2">
                  <Badge variant={topic.published ? "default" : "secondary"}>
                    {topic.published ? "공개" : "비공개"}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {topic.min_age_months != null && topic.max_age_months != null
                    ? `${topic.min_age_months}~${topic.max_age_months}개월`
                    : "-"}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/topics/${topic.id}/edit`}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    수정
                  </Link>
                </td>
              </tr>
            ))}
            {(!topics || topics.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  등록된 주제가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
