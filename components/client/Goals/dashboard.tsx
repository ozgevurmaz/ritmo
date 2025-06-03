'use client'

import React from 'react'
import { useGoals } from '@/lib/Queries/goals/useGoal'
import { useHabits } from '@/lib/Queries/habits/useHabit'
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, PlayCircle, Timer, FunctionSquare } from "lucide-react"
import { GoalSection } from './goalsSection'

interface GoalsPageProps {
    userId: string
}

export default function GoalsPage({ userId }: GoalsPageProps) {
    const { data: goals = [] } = useGoals(userId)
    const { data: habits = [] } = useHabits(userId)

    const today = new Date()

    const completedGoals = goals.filter(goal => goal.complated)

    const currentGoals = goals.filter(goal =>
        !goal.complated &&
        new Date(goal.startDate) <= today &&
        new Date(goal.endDate) >= today
    )

    const upcomingGoals = goals.filter(goal =>
        !goal.complated &&
        new Date(goal.startDate) > today
    )

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-goals">Goals</h1>
                    <p className="text-muted-foreground mt-1">
                        Track your progress and achieve your dreams
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                        {goals.length} Total Goals
                    </Badge>
                </div>
            </div>

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