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

interface DailyCardProps {
    className?: string
    habits: HabitType[]
    todos: TodoType[]
    userId: string
}

export default function DailyCard({ className, todos, habits, userId }: DailyCardProps) {

    const [isRowLayout, setIsRowLayout] = useState(false);
   
    const { data: goals } = useGoals(userId)

    // Calculate progress
    const completedTodos = todos.filter(todo => todo.completed).length;
    const totalTodos = todos.length;
    const todoProgress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

    const totalHabitsToday = habits.reduce((sum, habit) => sum + habit.frequencyPerDay, 0);
    const completedHabitsToday = habits.reduce((sum, habit) => sum + habit.completedToday, 0);
    const habitProgress = totalHabitsToday > 0 ? (completedHabitsToday / totalHabitsToday) * 100 : 0;

    const overallProgress = ((completedTodos + completedHabitsToday) / (totalTodos + totalHabitsToday)) * 100;

    return (
        <Card className={`border-primary ${className}`}>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Today's Things</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsRowLayout(!isRowLayout)}
                            className="h-8 w-8 p-0"
                        >
                            {isRowLayout ? <Columns className="h-4 w-4" /> : <Rows className="h-4 w-4" />}
                        </Button>
                        <Badge variant="outline" className="text-xs">
                            {Math.round(overallProgress)}% Complete
                        </Badge>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-3 mt-4">
                    <div>
                        <CustomProgress value={overallProgress} fillColor="bg-primary" backgroundColor="bg-primary/20" textColor="text-primary" animated showPercentage title="Overall Progress" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <CustomProgress value={todoProgress} fillColor="bg-todos" backgroundColor="bg-todos/20" textColor="text-todos" animated showPercentage title="Todos" />
                        <CustomProgress value={habitProgress} fillColor="bg-habits" backgroundColor="bg-habits/20" textColor="text-habits" animated showPercentage title="Habits" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col h-full">
                <div className={`gap-6 flex-1 ${isRowLayout ? 'flex flex-col space-y-6' : 'grid grid-cols-1 md:grid-cols-2'}`}>
                    {/* Todos Section */}
                    <div className="flex flex-col h-full">
                        <h3 className="text-md font-medium text-todo flex items-center gap-2 mb-3">
                            <CheckSquare className="h-4 w-4" />
                            Todos
                        </h3>
                        <div className="space-y-2 flex-1 overflow-y-auto">
                            {todos.map((todo) => (
                                <TodosChecklist key={todo.id} todo={todo} userId={userId} />
                            ))}
                        </div>
                    </div>

                    {/* Habits Section */}
                    <div className="flex flex-col h-full">
                        <h3 className="text-md font-medium text-habit flex items-center gap-2 mb-3">
                            <RotateCcw className="h-4 w-4" />
                            Habits
                        </h3>
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