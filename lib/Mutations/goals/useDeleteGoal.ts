import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const supabase = createClient();

export const useDeleteGoal = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (goalId: string) => {
            const { error: updateError } = await supabase
                .from("habits")
                .update({ goal: null })
                .eq("goal", goalId);

            if (updateError) {
                throw new Error(`Failed to unlink habits: ${updateError.message}`);
            }

            const { error } = await supabase
                .from("goals")
                .delete()
                .eq("id", goalId);

            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals", userId] });
            queryClient.invalidateQueries({ queryKey: ["validGoals", userId] });
            queryClient.invalidateQueries({ queryKey: ["upcomingGoals", userId] });
            queryClient.invalidateQueries({ queryKey: ["habits", userId] });
            queryClient.invalidateQueries({ queryKey: ["avaibleHabits", userId] });
            queryClient.invalidateQueries({ queryKey: ["validHabits", userId] });
        },
        onError: (error) => {
            console.error('Goal delete failed:', error);
            toast.error("Goal delete failed")
        }
    });
};
