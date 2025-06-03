import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient()

export const useAvailableHabits = (userId: string) => {
    return useQuery({
        queryKey: ["availableHabits", userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("habits")
                .select("*")
                .eq("userId", userId)
                .eq("goal", null)

            if (error) throw new Error(error.message);
            return data;
        },
    });
};
