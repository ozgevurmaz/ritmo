import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";


const supabase = createClient();

export const useUpcomingGoals = ({ userId, date }: { userId: string; date: string }) => {
    return useQuery({
        queryKey: ["upcomigGoals", userId, date],
        enabled: !!userId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("goals")
                .select("*")
                .eq("user_id", userId)
                .or(`startDate.gte.${date}`)
                .order("startDate", { ascending: false })

            if (error) throw new Error(error.message);
            return data;
        }
    })
}