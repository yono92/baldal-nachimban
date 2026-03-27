import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { TopicList } from "../_components/topic-list";

export default function AdminTopicsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">주제 관리</h1>
        <Link href="/admin/topics/new" className={buttonVariants()}>
          새 주제
        </Link>
      </div>
      <TopicList />
    </div>
  );
}
