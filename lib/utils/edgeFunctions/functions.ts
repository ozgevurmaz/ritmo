import { isTodaySelectedDay } from "../date/isTodaySelected";
import { isEndDate } from "../features/isEndDate";


interface ResetResult {
  success: boolean
  habitsProcessed: number
  goalsProcessed: number
  errors: string[]
}

export async function resetUserHabits(
  supabase: any,
  userId: string,
  timezone: string
): Promise<{ processed: number; errors: string[] }> {
  const errors: string[] = [];
  let processed = 0;

  try {
    console.log(`Starting habit reset for user ${userId} in timezone ${timezone}`);

    // Get all active habits for the user
    const { data: habits, error: fetchError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null); // Assuming soft delete pattern

    if (fetchError) {
      console.error('Error fetching habits:', fetchError);
      errors.push(`Failed to fetch habits: ${fetchError.message}`);
      return { processed, errors };
    }

    if (!habits || habits.length === 0) {
      console.log(`No habits found for user ${userId}`);
      return { processed, errors };
    }

    console.log(`Found ${habits.length} habits for user ${userId}`);

    // Process each habit
    for (const habit of habits) {
      try {
        const updatedHabit = await processHabitReset(habit, timezone);

        // Update the habit in database
        const { error: updateError } = await supabase
          .from('habits')
          .update({
            completedToday: updatedHabit.completedToday,
            streak: updatedHabit.streak,
            weeklyCompleted: updatedHabit.weeklyCompleted,
            updated_at: new Date().toISOString()
          })
          .eq('id', habit.id);

        if (updateError) {
          console.error(`Error updating habit ${habit.id}:`, updateError);
          errors.push(`Failed to update habit ${habit.title}: ${updateError.message}`);
        } else {
          processed++;
          console.log(`Successfully reset habit ${habit.id} (${habit.title})`);
        }

      } catch (error) {
        console.error(`Error processing habit ${habit.id}:`, error);
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        errors.push(`Failed to process habit ${habit.title}: ${errorMessage}`);
      }
    }

    console.log(`Completed habit reset for user ${userId}: ${processed} processed, ${errors.length} errors`);
    return { processed, errors };

  } catch (error) {
    console.error(`Critical error in resetUserHabits for user ${userId}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : String(error)
    errors.push(`Critical error: ${errorMessage}`);
    return { processed, errors };
  }
}

/**
 * Process individual habit reset logic
 */
function processHabitReset(habit: HabitType, timezone: string): HabitType {
  const updatedHabit = { ...habit };

  // Check if weekly frequency is not 7 (not daily)
  if (habit.weeklyFrequency !== 7) {
    // Check if today is a selected day
    if (!isTodaySelectedDay(habit.selectedDays, timezone)) {
      console.log(`Habit ${habit.id}: Today is not a selected day, skipping reset`);
      return updatedHabit; // Return without changes
    }
  }

  // Process streak logic
  if (habit.completedToday >= habit.frequencyPerDay) {
    // Goal completed - increment streak
    updatedHabit.streak = habit.streak + 1;
    console.log(`Habit ${habit.id}: Goal completed, streak incremented to ${updatedHabit.streak}`);
  } else {
    // Goal not completed
    if (habit.allowSkip) {
      // Allow skip - streak remains the same
      console.log(`Habit ${habit.id}: Goal not completed but skip allowed, streak remains ${habit.streak}`);
    } else {
      // No skip allowed - reset streak to 0
      updatedHabit.streak = 0;
      console.log(`Habit ${habit.id}: Goal not completed and no skip allowed, streak reset to 0`);
    }
  }

  // Reset daily completion count
  updatedHabit.completedToday = 0;

  // Handle weekly completion tracking
  if (habit.weeklyFrequency !== 7) {
    // For non-daily habits, check if we need to reset weekly counter
    // This could be enhanced to track which day of the week it is
    // For now, we'll maintain the weekly completed count

    // You might want to add logic here to reset weeklyCompleted 
    // at the start of each week based on when the week starts for the user
  }

  return updatedHabit;
}

/**
 * Reset goals for a user based on their timezone
 */
export async function resetUserGoals(
  supabase: any,
  userId: string,
  timezone: string
): Promise<{ processed: number; errors: string[] }> {
  const errors: string[] = [];
  let processed = 0;

  try {
    console.log(`Starting goal reset for user ${userId} in timezone ${timezone}`);

    // Get all active goals for the user
    const { data: goals, error: fetchError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false) // Only process incomplete goals
      .is('deleted_at', null); // Assuming soft delete pattern

    if (fetchError) {
      console.error('Error fetching goals:', fetchError);
      errors.push(`Failed to fetch goals: ${fetchError.message}`);
      return { processed, errors };
    }

    if (!goals || goals.length === 0) {
      console.log(`No active goals found for user ${userId}`);
      return { processed, errors };
    }

    console.log(`Found ${goals.length} goals for user ${userId}`);

    // Get all habits for the user to check completion status
    const { data: userHabits, error: habitsError } = await supabase
      .from('habits')
      .select('id, completedToday, frequencyPerDay')
      .eq('user_id', userId)
      .is('deleted_at', null);

    if (habitsError) {
      console.error('Error fetching user habits:', habitsError);
      errors.push(`Failed to fetch user habits: ${habitsError.message}`);
      return { processed, errors };
    }

    // Create a map of habit completion status
    const habitCompletionMap = new Map();
    if (userHabits) {
      userHabits.forEach((habit: HabitType) => {
        habitCompletionMap.set(habit.id, habit.completedToday >= habit.frequencyPerDay);
      });
    }

    // Process each goal
    for (const goal of goals) {
      try {
        const updatedGoal = await processGoalReset(goal, habitCompletionMap, timezone);

        // Update the goal in database
        const { error: updateError } = await supabase
          .from('goals')
          .update({
            completedDays: updatedGoal.completedDays,
            completed: updatedGoal.completed,
            updated_at: new Date().toISOString()
          })
          .eq('id', goal.id);

        if (updateError) {
          console.error(`Error updating goal ${goal.id}:`, updateError);
          errors.push(`Failed to update goal ${goal.title}: ${updateError.message}`);
        } else {
          processed++;
          console.log(`Successfully reset goal ${goal.id} (${goal.title})`);
        }

      } catch (error) {
        console.error(`Error processing goal ${goal.id}:`, error);
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        errors.push(`Failed to process goal ${goal.title}: ${errorMessage}`);
      }
    }

    console.log(`Completed goal reset for user ${userId}: ${processed} processed, ${errors.length} errors`);
    return { processed, errors };

  } catch (error) {
    console.error(`Critical error in resetUserGoals for user ${userId}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : String(error)
    errors.push(`Critical error: ${errorMessage}`);
    return { processed, errors };
  }
}

/**
 * Process individual goal reset logic
 */
function processGoalReset(
  goal: GoalType,
  habitCompletionMap: Map<string, boolean>,
  timezone: string
): GoalType {
  const updatedGoal = { ...goal };

  // Check if all habits under this goal are completed
  let allHabitsCompleted = true;
  let completedHabitsCount = 0;

  if (goal.habits && goal.habits.length > 0) {
    for (const habitId of goal.habits) {
      const isCompleted = habitCompletionMap.get(habitId) || false;
      if (isCompleted) {
        completedHabitsCount++;
      } else {
        allHabitsCompleted = false;
      }
    }
  } else {
    // If no habits are associated, consider it not completed
    allHabitsCompleted = false;
  }

  // Update completed days if all habits are done
  if (allHabitsCompleted) {
    updatedGoal.completedDays = goal.completedDays + 1;
    console.log(`Goal ${goal.id}: All habits completed, completedDays incremented to ${updatedGoal.completedDays}`);
  } else {
    console.log(`Goal ${goal.id}: Not all habits completed (${completedHabitsCount}/${goal.habits.length}), completedDays remains ${goal.completedDays}`);
  }

  // Check if it's the end date and mark as completed
  if (isEndDate(goal.endDate, timezone)) {
    updatedGoal.completed = true;
    console.log(`Goal ${goal.id}: End date reached, marking as completed`);
  }

  return updatedGoal;
}

/**
 * Main reset function that processes both habits and goals for a user
 */
export async function resetUserHabitsAndGoals(
  supabase: any,
  userId: string,
  timezone: string
): Promise<ResetResult> {
  console.log(`Starting complete reset for user ${userId} in timezone ${timezone}`);

  const result: ResetResult = {
    success: true,
    habitsProcessed: 0,
    goalsProcessed: 0,
    errors: []
  };

  try {
    // Reset habits first
    const habitResult = await resetUserHabits(supabase, userId, timezone);
    result.habitsProcessed = habitResult.processed;
    result.errors.push(...habitResult.errors);

    // Reset goals
    const goalResult = await resetUserGoals(supabase, userId, timezone);
    result.goalsProcessed = goalResult.processed;
    result.errors.push(...goalResult.errors);

    // Determine overall success
    result.success = result.errors.length === 0;

    console.log(`Reset completed for user ${userId}: ${result.habitsProcessed} habits, ${result.goalsProcessed} goals, ${result.errors.length} errors`);

  } catch (error) {
    console.error(`Critical error in resetUserHabitsAndGoals for user ${userId}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : String(error)
    result.errors.push(`Critical error: ${errorMessage}`);
    result.success = false;
  }

  return result;
}