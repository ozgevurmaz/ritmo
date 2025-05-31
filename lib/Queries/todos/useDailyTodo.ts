import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient();

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const useDailyTodos = ({
  userId,
  date,
}: {
  userId: string;
  date: string;
}) => {
  const today = new Date(date);
  const todayStr = today.toISOString().split("T")[0];

  return useQuery({
    queryKey: ["dailyTodos", userId, todayStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", userId)
        .gte("deadline", todayStr)
        .order("importance", { ascending: false });

      if (error) throw new Error(error.message);

      return data.filter((todo) => {
        const deadlineDate = new Date(todo.deadline);
        const completedAt = todo.completedAt ? new Date(todo.completedAt) : null;
        const isToday = isSameDay(deadlineDate, today);
        const isFuture = deadlineDate > today;
        const isCompletedToday =
          todo.completed && completedAt && isSameDay(completedAt, today);

        if (isToday) return true;
        if (todo.type === "task" && isFuture && !todo.completed) return true;
        if (todo.type === "task" && isCompletedToday) return true;

        return false;
      });
    },
    enabled: !!userId && !!date,
  });
};
