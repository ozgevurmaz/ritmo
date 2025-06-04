import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const supabase = createClient();

export const useUpdateGoal = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      updatedGoal,
      currentLinkedHabits,
      newaddedHabits,
    }: {
      updatedGoal: GoalType;
      currentLinkedHabits: HabitType[];
      newaddedHabits: Omit<HabitType, "id" | "created_at" | "weeklyCompleted" | "completedToday" | "streak">[],
    }) => {
      const { id: goalId, ...restGoal } = updatedGoal;

      // 1. Get the original goal (basic goal data)
      const { data: originalGoal, error: goalError } = await supabase
        .from("goals")
        .select("*")
        .eq("id", goalId)
        .single();

      if (goalError || !originalGoal) throw new Error("Goal fetch failed.");

      // 2. Fetch related habits manually
      const { data: existingHabits, error: habitsError } = await supabase
        .from("habits")
        .select("id")
        .eq("goal", goalId);

      if (habitsError) throw new Error("Failed to fetch existing habits.");

      const oldHabitIds = existingHabits?.map(h => h.id) || [];
      const newHabitIds = currentLinkedHabits.map(h => h.id);

      // 3. Diff
      const added = newHabitIds.filter(id => !oldHabitIds.includes(id));
      const removed = oldHabitIds.filter(id => !newHabitIds.includes(id));

      // 4. Update goal
      const { error: updateGoalError } = await supabase
        .from("goals")
        .update(restGoal)
        .eq("id", goalId);

      if (updateGoalError) throw new Error("Failed to update goal.");

      // 5. Link added habits
      if (added.length > 0) {
        const { error: addError } = await supabase
          .from("habits")
          .update({
            goal: goalId,
            startDate: restGoal.startDate,
            endDate: restGoal.endDate,
          })
          .in("id", added);
        if (addError) throw new Error("Failed to update added habits.");
      }

      // 6. Add new habits
      let insertedHabitIds: string[] = [];

      if (newaddedHabits.length > 0) {
        const { data: insertedHabits, error: quickHabitError } = await supabase
          .from("habits")
          .insert(
            newaddedHabits.map(habit => ({
              ...habit,
              goal: goalId,
              user_id: userId,
              completedToday: 0,
              weeklyCompleted: 0,
              streak: 0,
            }))
          )
          .select();
        if (quickHabitError) throw new Error("Failed to add quick habits.");
        insertedHabitIds = insertedHabits.map(h => h.id)
      }

      // 7. Unlink removed habits
      if (removed.length > 0) {
        const { error: removeError } = await supabase
          .from("habits")
          .update({ goal: null })
          .in("id", removed);
        if (removeError) throw new Error("Failed to unlink habits.");
      }

      // 8. Update changed habit dates
      for (const habit of currentLinkedHabits) {
        if (
          habit.startDate !== restGoal.startDate ||
          habit.endDate !== restGoal.endDate
        ) {
          const { error: updateError } = await supabase
            .from("habits")
            .update({
              startDate: restGoal.startDate,
              endDate: restGoal.endDate,
            })
            .eq("id", habit.id);

          if (updateError)
            throw new Error(`Failed to update habit ${habit.id}`);
        }
      }

      const habitIds = [...insertedHabitIds, ...currentLinkedHabits.map(h => h.id)]

      if (habitIds.length > 0) {
        await supabase
          .from("goals")
          .update({ habits: habitIds })
          .eq("id", goalId);
      }
    },
    onSuccess: () => {
       const queries = [
        ["goals", userId],
        ["validGoals", userId], 
        ["upcomingGoals", userId],
        ["habits", userId],
        ["availableHabits", userId],
        ["validHabits", userId]
      ];
      
      queries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    onError: (error) => {
      console.error('Goal update failed:', error);
      toast.error("Goal update failed")
    }
  });
};
