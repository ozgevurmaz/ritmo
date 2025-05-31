import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";


const supabase = createClient();

export const useValidGoals = ({ userId, date }: { userId: string; date: string }) => {
    return useQuery({
        queryKey: ["validGoals", userId, date],
        enabled: !!userId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("goals")
                .select("*")
                .eq("user_id", userId)
                .or(`startDate.lte.${date}`)
                .or(`endDate.gte.${date}`)
                .order("startDate", { ascending: false })

            if (error) throw new Error(error.message);
            return data;
        }
    })
}