"use client"

import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, CheckCircle2, Timer } from "lucide-react";
import { useGoals } from "@/lib/Queries/goals/useGoal";
import { useTranslations } from "next-intl";
import HabitsSection from "./habitsSection";

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
    const t = useTranslations("common")

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
                        {t("tabs.active")} ({totalCounts.current})
                    </TabsTrigger>
                    <TabsTrigger
                        value="completed"
                        className="flex items-center gap-2 data-[state=active]:text-habits"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        {t("tabs.completed")}  ({totalCounts.completed})
                    </TabsTrigger>
                    <TabsTrigger
                        value="upcoming"
                        className="flex items-center gap-2 data-[state=active]:text-habits"
                    >
                        <Timer className="h-4 w-4" />
                        {t("tabs.upcoming")}   ({totalCounts.upcoming})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="space-y-4 mt-6">
                    <HabitsSection
                        habitsGroup={groupedHabits.current}
                        totalCount={totalCounts.current}
                        emptyTextKey="active"
                        userId={userId}
                        habits={habits}
                        onEditHabit={onEditHabit}
                        onDeleteHabit={onDeleteHabit}
                    />
                </TabsContent>

                <TabsContent value="completed" className="space-y-4 mt-6">
                    <HabitsSection
                        habitsGroup={groupedHabits.completed}
                        totalCount={totalCounts.completed}
                        emptyTextKey="completed"
                        userId={userId}
                        habits={habits}
                        onEditHabit={onEditHabit}
                        onDeleteHabit={onDeleteHabit}
                    />
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4 mt-6">
                    <HabitsSection
                        habitsGroup={groupedHabits.upcoming}
                        totalCount={totalCounts.upcoming}
                        emptyTextKey="upcoming"
                        userId={userId}
                        habits={habits}
                        onEditHabit={onEditHabit}
                        onDeleteHabit={onDeleteHabit}
                    />
                </TabsContent>

            </Tabs>
        </div>
    );
}