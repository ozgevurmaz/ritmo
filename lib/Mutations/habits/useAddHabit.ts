import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const useAddHabit = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (habit: Omit<HabitType, "id" | "created_at" | "completed">) => {
            const { data, error } = await supabase.from("habits").insert({
                ...habit,
                user_id: userId,
                completedToday: 0,
            });

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["habits", userId] });
        }
    });
};
