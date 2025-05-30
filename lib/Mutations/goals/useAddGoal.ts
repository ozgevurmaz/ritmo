import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const supabase = createClient();

export const useAddGoal = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (goal: Omit<GoalType, "id" | "created_at" | "complated" | "complatedDays">) => {
            const { data, error } = await supabase
                .from("goals")
                .insert({
                    ...goal,
                    user_id: userId,
                    complatedDays: 0,
                    complated: false
                })
                .select();;

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals", userId] })
        }
    })
}