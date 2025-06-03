import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";


const supabase = createClient();

export const useSelectedGoal = ({ userId, slug }: { userId: string; slug: string }) => {
    return useQuery({
        queryKey: ["validGoals", userId, slug],
        enabled: !!userId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("goals")
                .select("*")
                .eq("user_id", userId)
                .eq("slug",slug)
                .single()

            if (error) throw new Error(error.message);
            return data;
        }
    })
}