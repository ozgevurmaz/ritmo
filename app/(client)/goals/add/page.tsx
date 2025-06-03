"use client"

import GoalForm from '@/components/Forms/goalForm'
import LoadingScreen from '@/components/shared/pageStyles/Loading'
import { useProfile } from '@/lib/Queries/useProfile'
import React from 'react'

const AddGoal = () => {
    const { data: profile, isLoading } = useProfile()
    if (!profile) return;
    if (isLoading) return <LoadingScreen />
    return (
        <GoalForm userId={profile.id} />
    )
}

export default AddGoal