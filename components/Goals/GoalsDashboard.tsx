'use client'

import React from 'react'
import { useGoals } from '@/lib/Queries/goals/useGoal'

import PageHeaders from '../shared/Headers/PageHeaders'
import { useRouter } from 'next/navigation'
import AnalyticsCard from '../shared/AnalyticsCard'
import { useGoalsAnalytics } from '@/hooks/analytics'
import GoalTabs from './GoalTabs'
import { useTranslations } from 'next-intl'

interface GoalsDashboardProps {
    userId: string
}

export default function GoalsDashboard({ userId }: GoalsDashboardProps) {
    const t = useTranslations()
    const router = useRouter()
    const { data: goals = [] } = useGoals(userId)
    const analyticsData = useGoalsAnalytics(goals)
    return (
        <div className="space-y-6 p-6">

            <PageHeaders
                title={t("goals.title")}
                definition={t("goals.definition")}
                buttonText={t("goals.add-button")}
                showButton
                buttonAction={() => router.push(`/dashboard/goals/add`)}
                textColor="text-goals"
                buttonStyle="bg-goals hover:bg-goals/60"
            />

            <AnalyticsCard data={analyticsData} />

            <GoalTabs goals={goals} userId={userId} />

        </div>
    )
}