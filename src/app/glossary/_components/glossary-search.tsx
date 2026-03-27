"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function GlossarySearch({ current }: { current: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `/glossary?q=${encodeURIComponent(trimmed)}` : "/glossary");
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="용어 검색..."
        className="pl-9"
      />
    </form>
  );
}
