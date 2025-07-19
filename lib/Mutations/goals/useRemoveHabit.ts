import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const supabase = createClient();

export const useRemoveHabit = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            goalId,
            habitId,
        }: {
            goalId: string,
            habitId: string
        }) => {

            const { data: goal, error: goalError } = await supabase
                .from("goals")
                .select("*")
                .eq("id", goalId)
                .single();

            if (goalError) {
                throw new Error("Failed removing habit", goalError)
            }
            const filteredHabits = goal.habits.filter((h: string) => h !== habitId);

            await supabase
                .from("goals")
                .update({ habits: filteredHabits })
                .eq("id", goalId)

            await supabase
                .from("habits")
                .update({ goal: null })
                .eq("id", habitId)

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
            console.error('Removing habit from goal failed:', error);
            toast.error("Removing habit from goal failed")
        }
    });
};
