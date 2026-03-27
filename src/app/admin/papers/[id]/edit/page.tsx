import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PaperForm } from "../../../_components/paper-form";

export default async function EditPaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: paper } = await supabase
    .from("papers")
    .select("*")
    .eq("id", id)
    .single();

  if (!paper) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">논문 수정</h1>
      <PaperForm paper={paper} />
    </div>
  );
}
