import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

export const useAddHabit = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            habit: Omit<HabitType, "id" | "created_at" | "weeklyComplated" | "completedToday" | "streak">
        ) => {
            const { data, error } = await supabase
                .from("habits")
                .insert({
                    ...habit,
                    user_id: userId,
                    completedToday: 0,
                    weeklyComplated: 0,
                    streak: 0
                })
                .select();

            if (error) throw new Error(error.message);

            const insertedHabit = data?.[0];

            if (habit.goal && insertedHabit?.id) {
                const { data: currentGoal, error: goalError } = await supabase
                    .from("goals")
                    .select("habits")
                    .eq("id", habit.goal)
                    .single();

                if (goalError) throw new Error(goalError.message);

                const updatedHabits = [...(currentGoal?.habits || []), insertedHabit.id];

                const { error: updateError } = await supabase
                    .from("goals")
                    .update({ habits: updatedHabits })
                    .eq("id", habit.goal);

                if (updateError) throw new Error(updateError.message);
            }

            return insertedHabit;
        },

        onSuccess: () => {
            const queries = [
                ["goals", userId],
                ["validGoals", userId],
                ["upcomingGoals", userId],
                ["habits", userId],
                ["availableHabits", userId],
                ["validHabits", userId]
            ];

            queries.forEach(queryKey => {
                queryClient.invalidateQueries({ queryKey });
            });
        },
        onError: (error) => {
            console.error('Habit create failed:', error);
            toast.error("Habit create failed")
        }
    });
};
