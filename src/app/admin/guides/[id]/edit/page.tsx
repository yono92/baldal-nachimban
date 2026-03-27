import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GuideForm } from "../../../_components/guide-form";

export default async function EditGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: guide } = await supabase
    .from("guides")
    .select("*")
    .eq("id", id)
    .single();

  if (!guide) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">가이드 수정</h1>
      <GuideForm guide={guide} />
    </div>
  );
}
