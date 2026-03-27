import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Paper } from "@/lib/supabase/types";

const QUERY_KEY = ["admin", "papers"];

type PaperPayload = Omit<Paper, "id" | "created_at">;

export function usePapers() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("papers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Paper[];
    },
  });
}

export function useCreatePaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PaperPayload) => {
      const supabase = createClient();
      const { data, error } = await supabase.from("papers").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdatePaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Paper> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase.from("papers").update(payload).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeletePaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("papers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
