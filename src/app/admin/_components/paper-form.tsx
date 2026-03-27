"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Paper } from "@/lib/supabase/types";

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function PaperForm({ paper }: { paper?: Paper }) {
  const router = useRouter();
  const isEdit = !!paper;

  const [title, setTitle] = useState(paper?.title ?? "");
  const [slug, setSlug] = useState(paper?.slug ?? "");
  const [summary, setSummary] = useState(paper?.summary ?? "");
  const [keyPoints, setKeyPoints] = useState(
    paper?.key_points?.join("\n") ?? ""
  );
  const [limitations, setLimitations] = useState(paper?.limitations ?? "");
  const [parentInterpretation, setParentInterpretation] = useState(
    paper?.parent_interpretation ?? ""
  );
  const [year, setYear] = useState(paper?.year?.toString() ?? "");
  const [journal, setJournal] = useState(paper?.journal ?? "");
  const [sourceUrl, setSourceUrl] = useState(paper?.source_url ?? "");
  const [published, setPublished] = useState(paper?.published ?? false);
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
      key_points: keyPoints
        ? keyPoints
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : null,
      limitations: limitations || null,
      parent_interpretation: parentInterpretation || null,
      year: year ? Number(year) : null,
      journal: journal || null,
      source_url: sourceUrl || null,
      published,
    };

    const result = isEdit
      ? await supabase.from("papers").update(payload).eq("id", paper.id)
      : await supabase.from("papers").insert(payload);

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/papers");
    router.refresh();
  }

  async function handleDelete() {
    if (!isEdit || !confirm("정말 삭제하시겠습니까?")) return;
    const supabase = createClient();
    await supabase.from("papers").delete().eq("id", paper.id);
    router.push("/admin/papers");
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
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="keyPoints">핵심 포인트 (줄바꿈으로 구분)</Label>
        <Textarea
          id="keyPoints"
          value={keyPoints}
          onChange={(e) => setKeyPoints(e.target.value)}
          rows={5}
          placeholder={"포인트 1\n포인트 2\n포인트 3"}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="limitations">한계점</Label>
        <Textarea
          id="limitations"
          value={limitations}
          onChange={(e) => setLimitations(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="parentInterpretation">부모 해석</Label>
        <Textarea
          id="parentInterpretation"
          value={parentInterpretation}
          onChange={(e) => setParentInterpretation(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="year">연도</Label>
          <Input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="journal">저널</Label>
          <Input
            id="journal"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sourceUrl">출처 URL</Label>
        <Input
          id="sourceUrl"
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />
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
