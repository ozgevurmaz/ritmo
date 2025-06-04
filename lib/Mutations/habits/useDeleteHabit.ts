import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const supabase = createClient();

export const useDeleteHabit = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habitId: string) => {

      const oldHabit = await supabase
        .from("habits")
        .select("goal")
        .eq("id", habitId)
        .single();

      if (oldHabit.data?.goal) {
        const { data: oldGoalData } = await supabase
          .from("goals")
          .select("habits")
          .eq("id", oldHabit.data.goal)
          .single();

        const updatedOldHabits = oldGoalData?.habits?.filter((id: string) => id !== habitId);

        await supabase
          .from("goals")
          .update({ habits: updatedOldHabits })
          .eq("id", oldHabit.data.goal);
      }

      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", habitId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", userId] });
      queryClient.invalidateQueries({ queryKey: ["validHabits", userId] });
    },
  });
};
