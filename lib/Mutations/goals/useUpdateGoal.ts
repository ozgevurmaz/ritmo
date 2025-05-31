import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const supabase = createClient();

export const useUpdateGoal = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goal: GoalType) => {
      const { id, ...rest } = goal;
      const { error } = await supabase
        .from("goals")
        .update(rest)
        .eq("id", id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", userId] });
      queryClient.invalidateQueries({ queryKey: ["validGoals", userId] });
    },
  });
};
