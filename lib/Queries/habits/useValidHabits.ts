import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const useValidHabits = ({ userId, date }: { userId: string; date: string }) => {

  return useQuery({
    queryKey: ["validHabits", userId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .or(`endDate.gte.${date},endDate.is.null`)
        .order("streak", { ascending: false });

      if (error) throw new Error(error.message);
      return data as HabitType[];
    },
    enabled: !!userId,
  });
};
