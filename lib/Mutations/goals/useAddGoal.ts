import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/features/getSlug";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export const useAddGoal = (userId: string) => {
    const supabase = createClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            goalData,
            newHabits,
            linkedHabits
        }: {
            goalData: Omit<GoalType, "id" | "created_at" | "completed" | "completedDays" | "slug">,
            newHabits: Omit<HabitType, "id" | "created_at" | "weeklyCompleted" | "completedToday" | "streak">[],
            linkedHabits: { id: string, updates: Partial<HabitType> }[]
        }) => {
            const { data: goal, error: goalError } = await supabase
                .from("goals")
                .insert({
                    ...goalData,
                    user_id: userId,
                    slug: slugify(goalData.title),
                    completedDays: 0,
                    completed: false
                })
                .select()
                .single();

            if (goalError || !goal) throw new Error("Goal creation failed.");

            const goalId = goal.id;

            let insertedHabitIds: string[] = [];

            // 2. Insert new habits
            if (newHabits.length > 0) {
                const { data: insertedHabits, error: quickHabitError } = await supabase
                    .from("habits")
                    .insert(
                        newHabits.map(habit => ({
                            ...habit,
                            goal: goalId,
                            user_id: userId,
                            completedToday: 0,
                            weeklyCompleted: 0,
                            streak: 0
                        }))
                    )
                    .select();;
                if (quickHabitError) throw new Error("Failed to add quick habits.");

                insertedHabitIds = insertedHabits?.map(h => h.id) ?? [];
            }

            // 3. Update existing habits
            for (const habit of linkedHabits) {
                const { error: updateError } = await supabase
                    .from("habits")
                    .update({
                        ...habit.updates,
                        goal: goalId
                    })
                    .eq("id", habit.id);

                if (updateError) throw new Error(`Failed to update habit with ID ${habit.id}`);
            }

            const allHabitIds = [
                ...insertedHabitIds,
                ...linkedHabits.map(h => h.id),
            ];

            await supabase
                .from("goals")
                .update({ habits: allHabitIds })
                .eq("id", goalId);

            return goal;
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
            console.error('Goal create failed:', error);
            toast.error("Goal create failed")
        }
    });
};
