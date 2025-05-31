import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useUpdateHabit = (userId: string) => {
    const queryClient = useQueryClient();
    const supabase = createClient();

    return useMutation({
        mutationFn: async ({
            habitId,
            updates,
        }: {
            habitId: string;
            updates: Partial<HabitType>;
        }) => {
            const { error } = await supabase
                .from("habits")
                .update(updates)
                .eq("id", habitId);

            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["habits", userId] });
            queryClient.invalidateQueries({ queryKey: ["validHabits", userId] });
        },
    });
};

