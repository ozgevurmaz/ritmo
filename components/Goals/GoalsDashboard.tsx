'use client'

import React from 'react'
import { useGoals } from '@/lib/Queries/goals/useGoal'
import { useHabits } from '@/lib/Queries/habits/useHabit'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, PlayCircle, Timer, FunctionSquare } from "lucide-react"
import { GoalSection } from './goalsSection'
import PageHeaders from '../shared/Headers/PageHeaders'
import { useRouter } from 'next/navigation'
import AnalyticsCard from '../shared/AnalyticsCard'
import { useGoalsAnalytics } from '@/hooks/analytics'

interface GoalsDashboardProps {
    userId: string
}

export default function GoalsDashboard({ userId }: GoalsDashboardProps) {
    const router = useRouter()

    const { data: goals = [] } = useGoals(userId)
    const { data: habits = [] } = useHabits(userId)

    const analyticsData = useGoalsAnalytics(goals)

    const today = new Date()

    const completedGoals = goals.filter(goal => goal.completed)

    const currentGoals = goals.filter(goal =>
        !goal.completed &&
        new Date(goal.startDate) <= today &&
        new Date(goal.endDate) >= today
    )

    const upcomingGoals = goals.filter(goal =>
        !goal.completed &&
        new Date(goal.startDate) > today
    )

    return (
        <div className="space-y-6 p-6">

            <PageHeaders
                title="Goals"
                defination="Track your progress and achieve your dreams"
                showButton
                buttonAction={() => router.push(`/goals/add`)}
                textColor="text-goals"
                buttonStyle="bg-goals hover:bg-goals/60"
            />

            <AnalyticsCard data={analyticsData} />

            <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="current" className="flex items-center gap-2 data-[state=active]:text-goals">
                        <PlayCircle className="h-4 w-4" />
                        Current ({currentGoals.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center gap-2 data-[state=active]:text-goals">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed ({completedGoals.length})
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="flex items-center gap-2 data-[state=active]:text-goals">
                        <Timer className="h-4 w-4" />
                        Upcoming ({upcomingGoals.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="mt-6">
                    <GoalSection
                        goals={currentGoals}
                        habits={habits}
                        title="Current Goals"
                        icon={PlayCircle}
                        emptyMessage="No current goals. Start a new goal to begin your journey!"
                        showHabits={true}
                        userId={userId}
                    />
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                    <GoalSection
                        goals={completedGoals}
                        habits={habits}
                        title="Completed Goals"
                        icon={CheckCircle2}
                        emptyMessage="No completed goals yet. Keep working on your current goals!"
                        showHabits={false}
                        userId={userId}
                    />
                </TabsContent>

                <TabsContent value="upcoming" className="mt-6">
                    <GoalSection
                        goals={upcomingGoals}
                        habits={habits}
                        title="Upcoming Goals"
                        icon={FunctionSquare}
                        emptyMessage="No upcoming goals yet. Find new ones for yourself.!"
                        showHabits={true}
                        userId={userId}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}