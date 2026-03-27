import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Guide } from "@/lib/supabase/types";

const QUERY_KEY = ["admin", "guides"];

type GuidePayload = Omit<Guide, "id" | "created_at">;

export function useGuides() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Guide[];
    },
  });
}

export function useCreateGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: GuidePayload) => {
      const supabase = createClient();
      const { data, error } = await supabase.from("guides").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Guide> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase.from("guides").update(payload).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeleteGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("guides").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
