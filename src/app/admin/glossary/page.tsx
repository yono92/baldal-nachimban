import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { GlossaryList } from "../_components/glossary-list";

export default function AdminGlossaryPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">용어 관리</h1>
        <Link href="/admin/glossary/new" className={buttonVariants()}>
          새 용어
        </Link>
      </div>
      <GlossaryList />
    </div>
  );
}
