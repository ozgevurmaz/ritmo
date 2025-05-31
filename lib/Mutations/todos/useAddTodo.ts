import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const useAddTodo = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (todo: Omit<TodoType, "id" | "created_at" | "completed" | "completedAt">) => {
            const { data, error } = await supabase.from("todos").insert({
                ...todo,
                user_id: userId,
                completed: false,
                completedAt: null
            });

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", userId] });
            queryClient.invalidateQueries({ queryKey: ["dailyTodos", userId] })
        }
    });
};
