import { useQuery } from "@tanstack/react-query";
import { createClient } from "../supabase/client";

const supabase = createClient();

export const useHabits = (userId: string) => {
    return useQuery({
        queryKey: ["habits", userId],
        enabled: !!userId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("habits")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })

            if (error) throw new Error(error.message);
            return data;
        }
    })
}