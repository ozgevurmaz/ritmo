import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const supabase = createClient();

export const useDeleteTodo = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoId: string) => {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", todoId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
      queryClient.invalidateQueries({ queryKey: ["dailyTodos", userId] })
    },
  });
};
