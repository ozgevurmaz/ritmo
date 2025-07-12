"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { CustomProgress } from "@/components/custom/customProgress";
import { useGoals } from "@/lib/Queries/goals/useGoal";
import { HabitsCard } from "../../Habits/HabitsCard";
import { useTranslations } from "next-intl";

interface DailyCardProps {
    className?: string
    habits: HabitType[]
    userId: string
}

export default function DailyCard({ className, habits, userId }: DailyCardProps) {
    const t = useTranslations("daily-card");

    const { data: goals } = useGoals(userId)

    const totalHabitsToday = habits.reduce((sum, habit) => sum + habit.frequencyPerDay, 0);
    const completedHabitsToday = habits.reduce((sum, habit) => sum + habit.completedToday, 0);

    const overallProgress = (completedHabitsToday / totalHabitsToday) * 100;

    const sortedHabits = [...habits].sort((a, b) => {
        const aCompleted = a.completedToday === a.frequencyPerDay;
        const bCompleted = b.completedToday === b.frequencyPerDay;

        if (aCompleted && !bCompleted) return 1;
        if (!aCompleted && bCompleted) return -1;
        return 0;
    });

    return (
        <Card className={`border-primary ${className}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{t("title")}</CardTitle>

                    <Badge variant="outline" className="text-xs">
                        {overallProgress > 0 ? t("complete", { percentage: Math.round(overallProgress) }) : t("complete", { percentage: 0 })}
                    </Badge>
                </div>

                <CustomProgress value={overallProgress} fillColor="bg-primary" backgroundColor="bg-primary/20" textColor="text-primary" animated showPercentage title={t("progress.overall")} />
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-2 h-full">
                {sortedHabits.map((habit) => (
                    <HabitsCard
                        userId={userId}
                        key={habit.id}
                        habit={habit}
                        showGoal={true}
                        goal={goals?.find(g => g.id === habit.goal)?.title}
                        border={false}
                        habits={habits}
                        showProccess
                        showStreak
                    />
                ))}
            </CardContent>
        </Card>
    );
}