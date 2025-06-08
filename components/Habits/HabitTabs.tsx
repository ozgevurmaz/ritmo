"use client"

import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, CheckCircle2, Timer, Calendar, Target } from "lucide-react";
import { HabitsCard } from "./HabitsCard";
import { useGoals } from "@/lib/Queries/goals/useGoal";

interface HabitTabsProps {
    habits: HabitType[]
    userId: string
    onEditHabit?: (habit: HabitType) => void
    onDeleteHabit?: (habitId: string) => void
}

export default function HabitTabs({
    habits,
    userId,
    onEditHabit,
    onDeleteHabit
}: HabitTabsProps) {

    const { data: goals = [] } = useGoals(userId);

    const classifiedHabits = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming: HabitType[] = [];
        const current: HabitType[] = [];
        const completed: HabitType[] = [];

        habits.forEach(habit => {
            const startDate = new Date(habit.startDate);
            startDate.setHours(0, 0, 0, 0);

            const endDate = habit.endDate ? new Date(habit.endDate) : null;
            if (endDate) {
                endDate.setHours(23, 59, 59, 999);
            }

            // Check if habit hasn't started yet
            if (startDate > today) {
                upcoming.push(habit);
            }
            // Check if habit has ended
            else if (endDate && endDate < today) {
                completed.push(habit);
            }
            // Current habits (started and not ended)
            else {
                current.push(habit);
            }
        });

        return { upcoming, current, completed };
    }, [habits]);

    const totalCounts = {
        upcoming: classifiedHabits.upcoming.length,
        current: classifiedHabits.current.length,
        completed: classifiedHabits.completed.length
    };

    const groupHabitsByGoals = (habitsList: HabitType[]) => {
        const grouped: { [goalName: string]: HabitType[] } = {};
        const habitsWithoutGoals: HabitType[] = [];

        habitsList.forEach(habit => {
            if (habit.goal) {
                const goal = goals.find(g => g.id === habit.goal);
                if (goal) {
                    const goalName = goal.title;
                    if (!grouped[goalName]) {
                        grouped[goalName] = [];
                    }
                    grouped[goalName].push(habit);
                } else {
                    // Handle case where goal ID doesn't exist in goals array
                    habitsWithoutGoals.push(habit);
                }
            } else {
                habitsWithoutGoals.push(habit);
            }
        });

        return { grouped, habitsWithoutGoals };
    };

    const groupedHabits = useMemo(() => {
        return {
            upcoming: groupHabitsByGoals(classifiedHabits.upcoming),
            current: groupHabitsByGoals(classifiedHabits.current),
            completed: groupHabitsByGoals(classifiedHabits.completed)
        };
    }, [classifiedHabits]);

    return (
        <div className="w-full">

            <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger
                        value="current"
                        className="flex items-center gap-2 data-[state=active]:text-habits"
                    >
                        <PlayCircle className="h-4 w-4" />
                        Current ({totalCounts.current})
                    </TabsTrigger>
                    <TabsTrigger
                        value="completed"
                        className="flex items-center gap-2 data-[state=active]:text-habits"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Completed ({totalCounts.completed})
                    </TabsTrigger>
                    <TabsTrigger
                        value="upcoming"
                        className="flex items-center gap-2 data-[state=active]:text-habits"
                    >
                        <Timer className="h-4 w-4" />
                        Upcoming ({totalCounts.upcoming})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="space-y-4 mt-6">
                    {totalCounts.current === 0 ? (
                        <div className="text-center py-12">
                            <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">No current habits</h3>
                            <p className="text-sm text-muted-foreground">Start building new habits to see them here</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Render habits grouped by goal names */}
                            {Object.keys(groupedHabits.current.grouped).map(goalName => (
                                <div key={goalName} className="space-y-3">
                                    <div className="flex items-center gap-2 pb-2">
                                        <Target className="h-4 w-4 text-goals" />
                                        <h3 className="text-sm font-medium text-goals">{goalName}</h3>
                                        <div className="h-px bg-goals/20 flex-1 ml-2" />
                                    </div>
                                    {groupedHabits.current.grouped[goalName].map((habit) => (
                                        <div key={habit.id} className="space-y-2 ml-4">
                                            <HabitsCard
                                                habit={habit}
                                                userId={userId}
                                                habits={habits}
                                                showStreak={true}
                                                showGoal={false}
                                                showProccess={true}
                                                editAction={() => onEditHabit?.(habit)}
                                                deleteAction={() => onDeleteHabit?.(habit.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {/* Habits without goals */}
                            {groupedHabits.current.habitsWithoutGoals.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 pb-2">
                                        <PlayCircle className="h-4 w-4 text-habits" />
                                        <h3 className="text-sm font-medium text-habits">Regular Habits</h3>
                                        <div className="h-px bg-habits/20 flex-1 ml-2" />
                                    </div>
                                    {groupedHabits.current.habitsWithoutGoals.map((habit) => (
                                        <div key={habit.id} className="space-y-2 ml-4">
                                            <HabitsCard
                                                habit={habit}
                                                userId={userId}
                                                habits={habits}
                                                showStreak={true}
                                                showProccess={true}
                                                editAction={() => onEditHabit?.(habit)}
                                                deleteAction={() => onDeleteHabit?.(habit.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4 mt-6">
                    {totalCounts.completed === 0 ? (
                        <div className="text-center py-12">
                            <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">No completed habits</h3>
                            <p className="text-sm text-muted-foreground">Work on your current habits</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Render habits grouped by goal names */}
                            {Object.keys(groupedHabits.completed.grouped).map(goalName => (
                                <div key={goalName} className="space-y-3">
                                    <div className="flex items-center gap-2 pb-2">
                                        <Target className="h-4 w-4 text-goals" />
                                        <h3 className="text-sm font-medium text-goals">{goalName}</h3>
                                        <div className="h-px bg-goals/20 flex-1 ml-2" />
                                    </div>
                                    {groupedHabits.completed.grouped[goalName].map((habit) => (
                                        <div key={habit.id} className="space-y-2 ml-4">
                                            <HabitsCard
                                                habit={habit}
                                                userId={userId}
                                                habits={habits}
                                                showStreak={true}
                                                showGoal={false}
                                                showProccess={true}
                                                editAction={() => onEditHabit?.(habit)}
                                                deleteAction={() => onDeleteHabit?.(habit.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {/* Habits without goals */}
                            {groupedHabits.completed.habitsWithoutGoals.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 pb-2">
                                        <PlayCircle className="h-4 w-4 text-habits" />
                                        <h3 className="text-sm font-medium text-habits">Regular Habits</h3>
                                        <div className="h-px bg-habits/20 flex-1 ml-2" />
                                    </div>
                                    {groupedHabits.completed.habitsWithoutGoals.map((habit) => (
                                        <div key={habit.id} className="space-y-2 ml-4">
                                            <HabitsCard
                                                habit={habit}
                                                userId={userId}
                                                habits={habits}
                                                showStreak={true}
                                                showProccess={true}
                                                editAction={() => onEditHabit?.(habit)}
                                                deleteAction={() => onDeleteHabit?.(habit.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4 mt-6">
                    {totalCounts.upcoming === 0 ? (
                        <div className="text-center py-12">
                            <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">No upcoming habits</h3>
                            <p className="text-sm text-muted-foreground">Work on your current habits</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Render habits grouped by goal names */}
                            {Object.keys(groupedHabits.upcoming.grouped).map(goalName => (
                                <div key={goalName} className="space-y-3">
                                    <div className="flex items-center gap-2 pb-2">
                                        <Target className="h-4 w-4 text-goals" />
                                        <h3 className="text-sm font-medium text-goals">{goalName}</h3>
                                        <div className="h-px bg-goals/20 flex-1 ml-2" />
                                    </div>
                                    {groupedHabits.upcoming.grouped[goalName].map((habit) => (
                                        <div key={habit.id} className="space-y-2 ml-4">
                                            <HabitsCard
                                                habit={habit}
                                                userId={userId}
                                                habits={habits}
                                                showStreak={true}
                                                showGoal={false}
                                                showProccess={true}
                                                editAction={() => onEditHabit?.(habit)}
                                                deleteAction={() => onDeleteHabit?.(habit.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {/* Habits without goals */}
                            {groupedHabits.upcoming.habitsWithoutGoals.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 pb-2">
                                        <PlayCircle className="h-4 w-4 text-habits" />
                                        <h3 className="text-sm font-medium text-habits">Regular Habits</h3>
                                        <div className="h-px bg-habits/20 flex-1 ml-2" />
                                    </div>
                                    {groupedHabits.upcoming.habitsWithoutGoals.map((habit) => (
                                        <div key={habit.id} className="space-y-2 ml-4">
                                            <HabitsCard
                                                habit={habit}
                                                userId={userId}
                                                habits={habits}
                                                showStreak={true}
                                                showProccess={true}
                                                editAction={() => onEditHabit?.(habit)}
                                                deleteAction={() => onDeleteHabit?.(habit.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

            </Tabs>
        </div>
    );
}