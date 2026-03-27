"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { Topic, Category } from "@/lib/supabase/types";

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function TopicForm({ topic }: { topic?: Topic }) {
  const router = useRouter();
  const isEdit = !!topic;

  const [title, setTitle] = useState(topic?.title ?? "");
  const [slug, setSlug] = useState(topic?.slug ?? "");
  const [summary, setSummary] = useState(topic?.summary ?? "");
  const [body, setBody] = useState(topic?.body ?? "");
  const [category, setCategory] = useState<Category>(topic?.category ?? "autism");
  const [minAge, setMinAge] = useState(topic?.min_age_months?.toString() ?? "");
  const [maxAge, setMaxAge] = useState(topic?.max_age_months?.toString() ?? "");
  const [published, setPublished] = useState(topic?.published ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit) setSlug(toSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      title,
      slug,
      summary: summary || null,
      body: body || null,
      category,
      min_age_months: minAge ? Number(minAge) : null,
      max_age_months: maxAge ? Number(maxAge) : null,
      published,
    };

    const result = isEdit
      ? await supabase.from("topics").update(payload).eq("id", topic.id)
      : await supabase.from("topics").insert(payload);

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/topics");
    router.refresh();
  }

  async function handleDelete() {
    if (!isEdit || !confirm("정말 삭제하시겠습니까?")) return;
    const supabase = createClient();
    await supabase.from("topics").delete().eq("id", topic.id);
    router.push("/admin/topics");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slug">슬러그</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary">요약</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="body">본문</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>카테고리</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(
              ([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="minAge">최소 연령 (개월)</Label>
          <Input
            id="minAge"
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="maxAge">최대 연령 (개월)</Label>
          <Input
            id="maxAge"
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={published} onCheckedChange={setPublished} />
        <Label>공개</Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "저장 중..." : isEdit ? "수정" : "생성"}
        </Button>
        {isEdit && (
          <Button type="button" variant="destructive" onClick={handleDelete}>
            삭제
          </Button>
        )}
      </div>
    </form>
  );
}
