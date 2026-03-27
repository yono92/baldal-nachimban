import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopicForm } from "../../../_components/topic-form";

export default async function EditTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: topic } = await supabase
    .from("topics")
    .select("*")
    .eq("id", id)
    .single();

  if (!topic) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">주제 수정</h1>
      <TopicForm topic={topic} />
    </div>
  );
}
