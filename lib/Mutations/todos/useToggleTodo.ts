import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { formatDateForQuery } from "@/lib/utils";

const supabase = createClient();

export const useToggleTodo = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todo: TodoType) => {
      const { error } = await supabase
        .from("todos")
        .update({ completed: !todo.completed, completedAt: todo.completed === false ? formatDateForQuery(new Date) : null })
        .eq("id", todo.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
      queryClient.invalidateQueries({ queryKey: ["dailyTodos", userId] })
    }
  });
};
