"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCreateGlossaryTerm, useUpdateGlossaryTerm, useDeleteGlossaryTerm } from "@/hooks/use-glossary";
import type { GlossaryTerm } from "@/lib/supabase/types";

export function GlossaryForm({ term: glossaryTerm }: { term?: GlossaryTerm }) {
  const router = useRouter();
  const isEdit = !!glossaryTerm;

  const [term, setTerm] = useState(glossaryTerm?.term ?? "");
  const [definition, setDefinition] = useState(glossaryTerm?.definition ?? "");
  const [category, setCategory] = useState(glossaryTerm?.category ?? "");
  const [published, setPublished] = useState(glossaryTerm?.published ?? false);

  const createMutation = useCreateGlossaryTerm();
  const updateMutation = useUpdateGlossaryTerm();
  const deleteMutation = useDeleteGlossaryTerm();

  const mutation = isEdit ? updateMutation : createMutation;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      term,
      definition,
      category: category || null,
      published,
    };

    if (isEdit) {
      await updateMutation.mutateAsync({ id: glossaryTerm.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    router.push("/admin/glossary");
  }

  async function handleDelete() {
    if (!isEdit || !confirm("정말 삭제하시겠습니까?")) return;
    await deleteMutation.mutateAsync(glossaryTerm.id);
    router.push("/admin/glossary");
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="term">용어</Label>
        <Input
          id="term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          required
          placeholder="예: 감각 통합"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="definition">설명</Label>
        <Textarea
          id="definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          required
          rows={4}
          placeholder="용어에 대한 쉬운 설명을 작성해주세요."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category">분류 (선택)</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="예: 감각, 언어, 인지"
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={published} onCheckedChange={setPublished} />
        <Label>공개</Label>
      </div>

      {mutation.error && (
        <p className="text-sm text-destructive">{mutation.error.message}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "저장 중..." : isEdit ? "수정" : "생성"}
        </Button>
        {isEdit && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "삭제 중..." : "삭제"}
          </Button>
        )}
      </div>
    </form>
  );
}
