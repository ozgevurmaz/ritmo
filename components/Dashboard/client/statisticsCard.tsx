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
                    <div className="p-3 bg-todos/10 rounded-lg border border-todos/60">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-medium text-todos">Pending Tasks</h3>
                            <Clock className="h-4 w-4 text-todos" />
                        </div>
                        <p className="text-xl font-bold mt-1 text-todos">
                            {todos.filter(todo => !todo.completed).length}
                        </p>
                    </div>

                    <div className="p-3 bg-habits/10 rounded-lg border border-habits/60">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-medium text-habits">Best Streak</h3>
                            <Trophy className="h-4 w-4 text-habits" />
                        </div>
                        <p className="text-xl font-bold mt-1 text-habits">
                            {Math.max(...habits.map(habit => habit.streak))} days
                        </p>
                    </div>

                    <div className="p-3 bg-activities/10 rounded-lg border border-activities/60">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-medium text-activities">Completed</h3>
                            <Check className="h-4 w-4 text-activities" />
                        </div>
                        <p className="text-xl font-bold mt-1 text-activities">
                            {todos.filter(todo => todo.completed).length}
                        </p>
                    </div>

                    <div className="p-3 bg-goals/10 rounded-lg border border-goals/60">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-medium text-goals">Active Goals</h3>
                            <Target className="h-4 w-4 text-goals" />
                        </div>
                        <p className="text-xl font-bold mt-1 text-goals">
                            {goals.length}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}