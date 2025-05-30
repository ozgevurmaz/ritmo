import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const useTodos = (userId: string) => {
    return useQuery({
        queryKey: ["todos", userId],
        enabled: !!userId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("todos")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (error) throw new Error(error.message);
            return data;
        },
    });
};
