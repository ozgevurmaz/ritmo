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
            const oldHabit = await supabase
                .from("habits")
                .select("goal")
                .eq("id", habitId)
                .single();

            if (oldHabit.data?.goal !== updates.goal) {
                if (oldHabit.data?.goal) {
                    const { data: oldGoalData } = await supabase
                        .from("goals")
                        .select("habits")
                        .eq("id", oldHabit.data.goal)
                        .single();

                    const updatedOldHabits = oldGoalData?.habits?.filter((id: string) => id !== habitId);

                    await supabase
                        .from("goals")
                        .update({ habits: updatedOldHabits })
                        .eq("id", oldHabit.data.goal);
                }

                if (updates.goal) {
                    const { data: newGoalData } = await supabase
                        .from("goals")
                        .select("habits")
                        .eq("id", updates.goal)
                        .single();

                    const updatedNewHabits = [...(newGoalData?.habits || []), habitId];

                    await supabase
                        .from("goals")
                        .update({ habits: updatedNewHabits })
                        .eq("id", updates.goal);
                }
            }

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

