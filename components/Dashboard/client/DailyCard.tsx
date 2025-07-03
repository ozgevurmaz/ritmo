"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckSquare, RotateCcw, Columns, Rows } from "lucide-react";
import React, { useState } from "react";
import { CustomProgress } from "@/components/custom/customProgress";
import TodosChecklist from "../../Todos/todosCheckbox";
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

    return (
        <Card className={`border-primary ${className}`}>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{t("title")}</CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            {overallProgress > 0 ? t("complete", { percentage: Math.round(overallProgress) }) : t("complete", { percentage: 0 })}
                        </Badge>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-3 mt-4">
                    <div>
                        <CustomProgress value={overallProgress} fillColor="bg-primary" backgroundColor="bg-primary/20" textColor="text-primary" animated showPercentage title={t("progress.overall")} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col h-full">
                <div className={`gap-6 flex-1 grid grid-cols-1`}>
                    {/* Habits Section */}
                    <div className="flex flex-col h-full">
                
                        <div className="space-y-2 flex-1 overflow-y-auto">
                            {habits.map((habit) => (
                                <HabitsCard
                                    userId={userId}
                                    key={habit.id}
                                    habit={habit}
                                    showGoal={true}
                                    goal={goals?.find(g => g.id === habit.goal)?.title}
                                    border={false}
                                    habits={habits}
                                    showProccess
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}