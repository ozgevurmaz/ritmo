"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Target, Clock, CheckSquare, RotateCcw } from "lucide-react";
import { useState } from "react";
import { TODOS, HABITS } from "@/lib/constants";
import { CustomProgress } from "@/components/custom/customProgress";
import TodosChecklist from "./todosCheckbox";
import HabitsCheckbox from "./habitsCheckbox";

interface DailyCardProps {
    className?: string
    habits: HabitsType[]
    todos: TodoType[]
}

export default function DailyCard({ className, todos, habits }: DailyCardProps) {
    const [currentTodos, setCurrentTodos] = useState<TodoType[]>(todos);
    const [currentHabits, setCurrentHabits] = useState<HabitsType[]>(habits);

    // Calculate progress
    const completedTodos = todos.filter(todo => todo.completed).length;
    const totalTodos = todos.length;
    const todoProgress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

    const totalHabitsToday = habits.reduce((sum, habit) => sum + habit.frequencyPerDay, 0);
    const completedHabitsToday = habits.reduce((sum, habit) => sum + habit.completedToday, 0);
    const habitProgress = totalHabitsToday > 0 ? (completedHabitsToday / totalHabitsToday) * 100 : 0;

    const overallProgress = ((completedTodos + completedHabitsToday) / (totalTodos + totalHabitsToday)) * 100;

    const toggleTodo = (id: string) => {
        setCurrentTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const incrementHabit = (id: string) => {
        setCurrentHabits(prev => prev.map(habit =>
            habit.id === id && habit.completedToday < habit.frequencyPerDay
                ? { ...habit, completedToday: habit.completedToday + 1 }
                : habit
        ));
    };

    const decrementHabit = (id: string) => {
        setCurrentHabits(prev => prev.map(habit =>
            habit.id === id && habit.completedToday > 0
                ? { ...habit, completedToday: habit.completedToday - 1 }
                : habit
        ));
    };

    return (
        <Card className={`border-primary ${className}`}>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Today's Things</CardTitle>
                    <Badge variant="outline" className="text-xs">
                        {Math.round(overallProgress)}% Complete
                    </Badge>
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

            <CardContent className="space-y-4">
                {/* Todos Section */}
                <div className="space-y-3">
                    <h3 className="text-md font-medium text-todo flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        Todos
                    </h3>
                    <div className="space-y-2">
                        {todos.map((todo) => (
                            <TodosChecklist key={todo.id} todo={todo} toggleTodo={() => toggleTodo(todo.id)} />
                        ))}
                    </div>
                </div>

                {/* Habits Section */}
                <div className="space-y-3">
                    <h3 className="text-md font-medium text-habit flex items-center gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Habits
                    </h3>
                    <div className="space-y-2">
                        {habits.map((habit) => (
                            <HabitsCheckbox key={habit.id} habit={habit} decrementHabit={() => decrementHabit(habit.id)} incrementHabit={() => incrementHabit(habit.id)} />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}