import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const supabase = createClient();

export const useDeleteGoal = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (goalId: string) => {
            const { error } = await supabase
                .from("goals")
                .delete()
                .eq("id", goalId);

            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals", userId] });
        },
    });
};
