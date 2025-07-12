//@ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req: any) => {
    try {
        const { userIds, reset_type } = await req.json();

        if (!userIds || !Array.isArray(userIds)) {
            return new Response("Invalid input", { status: 400 });
        }

        console.log(`Found ${userIds.length} pending resets`)

        const { data: pendingResets, error } = await supabaseAdmin
            .from("profiles")
            .select("id, timezone")
            .in("id", userIds);

        if (error) throw error;

        // Process each reset
        const results: PromiseSettledResult<{ success: boolean; userId: string; error?: string }>[] = await Promise.allSettled(
            pendingResets.map(async (pendingResets: { id: string, timezone: string }) => {
                try {
                    await processUserReset(supabaseAdmin, pendingResets.id, pendingResets.timezone, reset_type);

                    const { error: markError } = await supabaseAdmin
                        .rpc('mark_reset_completed', { p_user_id: pendingResets.id });

                    if (markError) {
                        console.error(`Error marking reset completed for user ${pendingResets.id}:`, markError);
                        throw markError;
                    }

                    console.log(`Reset completed for user ${pendingResets.id} in ${pendingResets.timezone}`);


                    return { success: true, userId: pendingResets.id };

                } catch (error) {
                    console.error(`Failed to reset for user ${pendingResets.id}:`, error);
                    return { success: false, userId: pendingResets.id, error: String(error) };
                }
            })
        );

        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
        const failed = results.length - successful

        console.log(`Reset process completed: ${successful} successful, ${failed} failed`)

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Reset processing completed',
                reset_type: reset_type,
                processed: results.length,
                successful,
                failed,
                details: results.map(r =>
                    r.status === 'fulfilled' ? r.value : { success: false, error: r.reason }
                )
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : typeof error === "string"
                    ? error
                    : JSON.stringify(error);

        console.error("Daily reset function error:", message);

        return new Response(
            JSON.stringify({
                success: false,
                message: message,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
})

const DAYS_OF_WEEK = [
    "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
];

function getCurrentDayOfWeek(timezone: string): string {
    const now = new Date();
    const localDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    const dayIndex = localDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Convert Sunday (0) to index 6, and shift others accordingly
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return DAYS_OF_WEEK[adjustedIndex];
}

function isTodaySelectedDay(selectedDays: string[], timezone: string): boolean {
    const currentDay = getCurrentDayOfWeek(timezone);
    return selectedDays.includes(currentDay);
}

function isEndDate(endDate: string, timezone: string): boolean {
    const now = new Date();
    const localDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    const endDateTime = new Date(endDate);

    // Compare only the date part (YYYY-MM-DD)
    const currentDateStr = localDate.toISOString().split('T')[0];
    const endDateStr = endDateTime.toISOString().split('T')[0];

    return currentDateStr >= endDateStr;
}

function processHabitReset(habit: any, timezone: string): any {
    const updatedHabit = { ...habit };

    const isResetDay = habit.weeklyFrequency === 7 || isTodaySelectedDay(habit.selectedDays, timezone);

    if (!isResetDay) {
        return updatedHabit;
    }

    // Update expected count
    updatedHabit.expected_count = (habit.expected_count || 0) + 1;

    if (habit.completedToday >= habit.frequencyPerDay) {
        updatedHabit.streak = habit.streak + 1;
        updatedHabit.total_completed = (habit.total_completed || 0) + 1;
    } else {
        if (habit.allowSkip) {

        } else {
            updatedHabit.streak = 0;
            updatedHabit.total_missed = (habit.total_missed || 0) + 1;
        }
    }

    // Recalculate completion rate
    const completed = updatedHabit.total_completed || 0;
    const expected = updatedHabit.expected_count || 0;
    updatedHabit.completion_rate = expected > 0 ? Number(((completed / expected) * 100).toFixed(2)) : 0;

    updatedHabit.completedToday = 0;

    return updatedHabit;
}


async function resetUserHabits(
    supabase: any,
    userId: string,
    timezone: string,
): Promise<{ processed: number; errors: string[] }> {
    const errors: string[] = [];
    let processed = 0;

    try {
        // Get all active habits for the user
        const { data: habits, error: fetchError } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', userId)

        if (fetchError) {
            console.error('Error fetching habits:', fetchError);
            errors.push(`Failed to fetch habits: ${fetchError.message}`);
            return { processed, errors };
        }

        if (!habits || habits.length === 0) {
            console.log(`No habits found for user ${userId}`);
            return { processed, errors };
        }

        // Process each habit
        for (const habit of habits) {
            try {
                const updatedHabit = processHabitReset(habit, timezone);

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
                }

            } catch (error) {
                console.error(`Error processing habit ${habit.id}:`, error);
                const errorMessage =
                    error instanceof Error ? error.message : String(error)
                errors.push(`Failed to process habit ${habit.title}: ${errorMessage}`);
            }
        }
        return { processed, errors };

    } catch (error) {
        console.error(`Critical error in resetUserHabits for user ${userId}:`, error);
        const errorMessage =
            error instanceof Error ? error.message : String(error)
        errors.push(`Critical error: ${errorMessage}`);
        return { processed, errors };
    }
}

function processGoalReset(
    goal: any,
    habitCompletionMap: Map<string, boolean>,
    timezone: string
): any {
    const updatedGoal = { ...goal };

    // Check if all habits under this goal are completed
    let allHabitsCompleted = true;
    let completedHabitsCount = 0;
    let missedHabitsCount = 0;

    if (goal.habits && goal.habits.length > 0) {
        for (const habitId of goal.habits) {
            const isCompleted = habitCompletionMap.get(habitId) || false;
            if (isCompleted) {
                completedHabitsCount++;
            } else {
                allHabitsCompleted = false;
                missedHabitsCount++;
            }
        }
    } else {
        // If no habits are associated, consider it not completed
        allHabitsCompleted = false;
    }

    // Update completed days if all habits are done
    if (allHabitsCompleted) {
        updatedGoal.perfect_days = (goal.perfect_days || 0) + 1;
        updatedGoal.completedDays = (goal.completedDays || 0) + 1;
    } else {
        updatedGoal.missed_days = (goal.missed_days || 0) + 1;
    }

    updatedGoal.completion_rate =
        goal.completedDays && (goal.completedDays + goal.missed_days) > 0
            ? Number(
                (
                    (goal.completedDays / (goal.completedDays + goal.missed_days)) *
                    100
                ).toFixed(2)
            )
            : 0;

    // Check if it's the end date and mark as completed
    if (isEndDate(goal.endDate, timezone)) {
        updatedGoal.completed = true;
    }

    return updatedGoal;
}

async function resetUserGoals(
    supabase: any,
    userId: string,
    timezone: string
): Promise<{ processed: number; errors: string[] }> {
    const errors: string[] = [];
    let processed = 0;

    try {
        // Get all active goals for the user
        const { data: goals, error: fetchError } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .eq('completed', false)

        if (fetchError) {
            console.error('Error fetching goals:', fetchError);
            errors.push(`Failed to fetch goals: ${fetchError.message}`);
            return { processed, errors };
        }

        if (!goals || goals.length === 0) {
            console.log(`No active goals found for user ${userId}`);
            return { processed, errors };
        }

        // Get all habits for the user to check completion status
        const { data: userHabits, error: habitsError } = await supabase
            .from('habits')
            .select('id, completedToday, frequencyPerDay')
            .eq('user_id', userId)

        if (habitsError) {
            console.error('Error fetching user habits:', habitsError);
            errors.push(`Failed to fetch user habits: ${habitsError.message}`);
            return { processed, errors };
        }

        // Create a map of habit completion status
        const habitCompletionMap = new Map();
        if (userHabits) {
            userHabits.forEach(habit => {
                habitCompletionMap.set(habit.id, habit.completedToday >= habit.frequencyPerDay);
            });
        }

        // Process each goal
        for (const goal of goals) {
            try {
                const updatedGoal = processGoalReset(goal, habitCompletionMap, timezone);

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
                }

            } catch (error) {
                console.error(`Error processing goal ${goal.id}:`, error);
                errors.push(`Failed to process goal ${goal.title}: ${error.message}`);
            }
        }

        return { processed, errors };

    } catch (error) {
        console.error(`Critical error in resetUserGoals for user ${userId}:`, error);
        errors.push(`Critical error: ${error.message}`);
        return { processed, errors };
    }
}

async function resetUserHabitsAndGoals(
    supabase: any,
    userId: string,
    timezone: string
) {
    const result = {
        success: true,
        habitsProcessed: 0,
        goalsProcessed: 0,
        errors: []
    };

    try {
        // Reset goals
        const goalResult = await resetUserGoals(supabase, userId, timezone);
        result.goalsProcessed = goalResult.processed;
        result.errors.push(...goalResult.errors);

        // Reset habits first
        const habitResult = await resetUserHabits(supabase, userId, timezone);
        result.habitsProcessed = habitResult.processed;
        result.errors.push(...habitResult.errors);

        // Determine overall success
        result.success = result.errors.length === 0;
    } catch (error) {
        console.error(`Critical error in resetUserHabitsAndGoals for user ${userId}:`, error);
        result.errors.push(`Critical error: ${error.message}`);
        result.success = false;
    }

    return result;
}

// Function to process individual user reset
async function processUserReset(
    supabase: any,
    userId: string,
    timezone: string,
    resetType: string
) {
    const startTime = Date.now();

    try {
        // Call the main reset function
        const result = await resetUserHabitsAndGoals(supabase, userId, timezone);

        const executionTime = Date.now() - startTime;

        await updateUserStats(supabase, userId)

        if (result.success) {
            await logResetActivity(
                supabase,
                userId,
                resetType,
                'success',
                "",
                executionTime,
                `Habits: ${result.habitsProcessed}, Goals: ${result.goalsProcessed}`
            );
        } else {
            const errorMessage = result.errors.join('; ');
            await logResetActivity(
                supabase,
                userId,
                resetType,
                'failed',
                errorMessage,
                executionTime,
                `Habits: ${result.habitsProcessed}, Goals: ${result.goalsProcessed}`
            );
            throw new Error(`Reset partially failed: ${errorMessage}`);
        }

    } catch (error) {
        const executionTime = Date.now() - startTime;
        const errorMessage =
            error instanceof Error ? error.message : String(error)
        await logResetActivity(supabase, userId, resetType, 'failed', errorMessage, executionTime, "");
        throw error;
    }
}

// Function to log reset activities for debugging/monitoring
async function logResetActivity(
    supabase: any,
    userId: string,
    resetType: string,
    status: 'success' | 'failed',
    errorMessage?: string,
    executionTimeMs?: number,
    details?: string
) {
    try {
        const { data, error } = await supabase
            .from('reset_logs')
            .insert({
                user_id: userId,
                reset_type: resetType,
                status,
                error_message: errorMessage,
                execution_time_ms: executionTimeMs,
                details,
                reset_timestamp: new Date().toISOString()
            });

        if (error) {
            console.error('Failed to log reset activity:', error);
        }
    } catch (error) {
        console.error('Failed to log reset activity:', error)
        // Don't throw here as logging failure shouldn't stop the reset process
    }
}

async function updateUserStats(supabase: any, userId: string) {
    try {
        const [habitsRes, goalsRes] = await Promise.all([
            supabase.from("habits").select("*").eq("user_id", userId),
            supabase.from("goals").select("*").eq("user_id", userId),
        ]);

        const habits = habitsRes.data || [];
        const goals = goalsRes.data || [];

        const habitsCount = habits.length;
        const goalsCount = goals.length;

        const completedHabits = habits.filter(h => h.total_completed).length;
        const totalCompletedActivities = habits.reduce((acc, h) => acc + (h.total_completed || 0), 0);

        const missedDays = habits.reduce((acc, h) => acc + (h.total_missed || 0), 0);
        const perfectDays = goals.reduce((acc, g) => acc + (g.perfect_days || 0), 0);

        const consistencyScore = habitsCount > 0
            ? Math.floor((completedHabits / habitsCount) * 100)
            : 0;

        // category heat map
        const categoryMap: Record<string, { completed: number; total: number }> = {};
        for (const h of habits) {
            if (!categoryMap[h.category]) {
                categoryMap[h.category] = { completed: 0, total: 0 };
            }
            categoryMap[h.category].total += 1;
            if ((h.total_completed || 0) > 0) categoryMap[h.category].completed += 1;
        }
        const category_success = Object.entries(categoryMap).reduce((acc, [cat, { completed, total }]) => {
            acc[cat] = total > 0 ? Number(((completed / total) * 100).toFixed(1)) : 0;
            return acc;
        }, {} as Record<string, number>);

        const habit_heatmap = await generateHabitHeatmap(supabase, userId);

        const updateResult = await supabase.from("user_stats").update({
            habits_count: habitsCount,
            goals_count: goalsCount,
            total_completed_activities: totalCompletedActivities,
            consistency_score: consistencyScore,
            perfect_days: perfectDays,
            missed_days: missedDays,
            category_success,
            habit_heatmap,
            updated_at: new Date().toISOString()
        }).eq("user_id", userId);

        if (updateResult.error) {
            console.error("Failed to update user stats:", updateResult.error);
        }

    } catch (err) {
        console.error("updateUserStats error:", err);
    }
}

async function generateHabitHeatmap(supabase: any, userId: string) {
    const { data, error } = await supabase.rpc("get_habit_heatmap", {
        p_user_id: userId
    });

    if (error) {
        console.error(`Heatmap fetch error for ${userId}:`, error);
        return {};
    }

    return data || {};
}