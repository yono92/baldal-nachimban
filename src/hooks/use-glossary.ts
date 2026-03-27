import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { GlossaryTerm } from "@/lib/supabase/types";

const QUERY_KEY = ["admin", "glossary"];

type GlossaryPayload = Omit<GlossaryTerm, "id" | "created_at">;

export function useGlossaryTerms() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("glossary_terms")
        .select("*")
        .order("term", { ascending: true });
      if (error) throw error;
      return data as GlossaryTerm[];
    },
  });
}

export function useCreateGlossaryTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: GlossaryPayload) => {
      const supabase = createClient();
      const { data, error } = await supabase.from("glossary_terms").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateGlossaryTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<GlossaryTerm> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase.from("glossary_terms").update(payload).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeleteGlossaryTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("glossary_terms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
