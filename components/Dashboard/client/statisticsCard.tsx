'use client'

import AnalyticsCard from '@/components/shared/AnalyticsCard';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useCombinedAnalytics } from '@/hooks/analytics';
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
) {

    const analyticsData = useCombinedAnalytics(habits = habits, todos = todos, goals = goals)

    return (
        <Card className="col-span-2 md:col-span-1 mb-5 border-primary">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center">
                    <BarChart className="h-4 w-4 mr-2" />
                    <span>Statistics</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-3">
                <AnalyticsCard data={analyticsData} className='lg:grid-cols-2!' />
            </CardContent>
        </Card>
    );
}