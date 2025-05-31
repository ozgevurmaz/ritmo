import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";


const supabase = createClient();

export const useGoals = (userId: string) => {
    return useQuery({
        queryKey: ["goals", userId],
        enabled: !!userId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("goals")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })

            if (error) throw new Error(error.message);
            return data;
        }
    })
}