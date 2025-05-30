'use client'

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
    Check,
    Clock,
    Target,
    Trophy,
    BarChart
} from 'lucide-react';

export default function StatisticsCard(
    {
        goals,
        todos,
        habits
    }:
        {
            goals: GoalType[],
            todos: TodoType[],
            habits: HabitType[]
        }
){
    return (
        <Card className="col-span-2 md:col-span-1 mb-5 border-primary">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center">
                    <BarChart className="h-4 w-4 mr-2" />
                    <span>Statistics</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-3">
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-chart-2/20 rounded-lg border border-chart-2/60">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-medium text-chart-2">Pending Tasks</h3>
                            <Clock className="h-4 w-4 text-chart-2" />
                        </div>
                        <p className="text-xl font-bold mt-1 text-chart-2">
                            {todos.filter(todo => !todo.completed).length}
                        </p>
                    </div>

                    <div className="p-3 bg-chart-1/20 rounded-lg border border-chart-1/60">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-medium text-chart-1">Best Streak</h3>
                            <Trophy className="h-4 w-4 text-chart-1" />
                        </div>
                        <p className="text-xl font-bold mt-1 text-chart-1">
                            {Math.max(...habits.map(habit => habit.streak))} days
                        </p>
                    </div>

                    <div className="p-3 bg-chart-5/20 rounded-lg border border-chart-5/60">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-medium text-chart-5">Completed</h3>
                            <Check className="h-4 w-4 text-chart-5" />
                        </div>
                        <p className="text-xl font-bold mt-1 text-chart-5">
                            {todos.filter(todo => todo.completed).length}
                        </p>
                    </div>

                    <div className="p-3 bg-chart-4/20 rounded-lg border border-chart-4/60">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-medium text-chart-4">Active Goals</h3>
                            <Target className="h-4 w-4 text-chart-4" />
                        </div>
                        <p className="text-xl font-bold mt-1 text-chart-4">
                            {goals.length}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}