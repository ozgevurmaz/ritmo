"use client"

import GoalsDashboard from '@/components/Goals/GoalsDashboard'
import LoadingScreen from '@/components/shared/pageStyles/Loading';
import { useProfile } from '@/lib/Queries/useProfile';
import React from 'react'

const Goals = () => {
    const { data: profile, isLoading, error } = useProfile();

    if (isLoading) return <LoadingScreen />
    if (!profile) return
    
    return (
        <GoalsDashboard userId={profile.id} />
    )
}

export default Goals