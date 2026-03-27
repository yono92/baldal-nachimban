import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GlossaryForm } from "../../../_components/glossary-form";

export default async function EditGlossaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: term } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("id", id)
    .single();

  if (!term) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">용어 수정</h1>
      <GlossaryForm term={term} />
    </div>
  );
}
