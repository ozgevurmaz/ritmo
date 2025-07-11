import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ResetSchedule {
    user_id: string;
    timezone: string;
    reset_type: string;
}

serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Initialize Supabase client with service role
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        console.log('Starting daily reset process...')

        // Get all pending resets
        const { data: pendingResets, error: fetchError } = await supabaseAdmin
            .rpc('process_pending_resets')

        if (fetchError) {
            console.error('Error fetching pending resets:', fetchError)
            throw fetchError
        }

        if (!pendingResets || pendingResets.length === 0) {
            console.log('No pending resets found')
            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'No resets needed',
                    processed: 0
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200
                }
            )
        }

        console.log(`Found ${pendingResets.length} pending resets`)

        // Process each reset
        const results: PromiseSettledResult<{ success: boolean; userId: string; error?: string }>[] = await Promise.allSettled(
            pendingResets.map(async (reset: ResetSchedule) => {
                pendingResets.map(async (reset: ResetSchedule) => {
                    try {
                        console.log(`Processing reset for user ${reset.user_id} in timezone ${reset.timezone}`)

                        // Call the actual reset functions
                        await processUserReset(supabaseAdmin, reset.user_id, reset.timezone, reset.reset_type)

                        // Mark reset as completed
                        const { error: markError } = await supabaseAdmin
                            .rpc('mark_reset_completed', {
                                p_user_id: reset.user_id
                            })

                        if (markError) {
                            console.error(`Error marking reset completed for user ${reset.user_id}:`, markError)
                            throw markError
                        }

                        console.log(`Reset completed for user ${reset.user_id}`)
                        return { success: true, userId: reset.user_id }

                    } catch (error) {
                        console.error(`Failed to reset for user ${reset.user_id}:`, error)
                        const errorMessage =
                            error instanceof Error ? error.message : String(error)
                        return { success: false, userId: reset.user_id, error: errorMessage }
                    }
                })
            }))


        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
        const failed = results.length - successful

        console.log(`Reset process completed: ${successful} successful, ${failed} failed`)

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Reset processing completed',
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

        console.error("❌ Daily reset function error:", message);

        return new Response(
            JSON.stringify({
                success: false,
                error: message,
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

    return updatedHabit;
}

async function resetUserHabits(
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
            .is('deleted_at', null);

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

function processGoalReset(
    goal: any,
    habitCompletionMap: Map<string, boolean>,
    timezone: string
): any {
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
async function resetUserGoals(
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
            .eq('completed', false)
            .is('deleted_at', null);

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
                    console.log(`Successfully reset goal ${goal.id} (${goal.title})`);
                }

            } catch (error) {
                console.error(`Error processing goal ${goal.id}:`, error);
                errors.push(`Failed to process goal ${goal.title}: ${error.message}`);
            }
        }

        console.log(`Completed goal reset for user ${userId}: ${processed} processed, ${errors.length} errors`);
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
    console.log(`Starting complete reset for user ${userId} in timezone ${timezone}`);

    const result = {
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
    console.log(`Starting ${resetType} reset for user ${userId} in timezone ${timezone}`)

    try {
        // Call the main reset function
        const result = await resetUserHabitsAndGoals(supabase, userId, timezone);

        const executionTime = Date.now() - startTime;

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
            console.log(`Reset completed successfully for user ${userId}: ${result.habitsProcessed} habits, ${result.goalsProcessed} goals`);
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
        await supabase
            .from('reset_logs')
            .insert({
                user_id: userId,
                reset_type: resetType,
                status,
                error_message: errorMessage,
                execution_time_ms: executionTimeMs,
                details: details,
                timestamp: new Date().toISOString()
            })
    } catch (error) {
        console.error('Failed to log reset activity:', error)
        // Don't throw here as logging failure shouldn't stop the reset process
    }
}