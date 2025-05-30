import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const useUpdateHabitProgress = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      habitId,
      completedToday
    }: {
      habitId: string;
      completedToday: number;
    }) => {
      const { error } = await supabase
        .from("habits")
        .update({ completedToday })
        .eq("id", habitId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", userId] });
    }
  });
};
