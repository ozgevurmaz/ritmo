import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const supabase = createClient();

export const useUpdateTodo = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            todoId,
            updates,
        }: {
            todoId: string;
            updates: Partial<TodoType>;
        }) => {
            const { error } = await supabase
                .from("todos")
                .update(updates)
                .eq("id", todoId);

            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", userId] });
        },
    });
};

