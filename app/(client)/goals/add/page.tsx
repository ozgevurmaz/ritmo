"use client"

import GoalForm from '@/components/client/Forms/goalForm'
import { useProfile } from '@/lib/Queries/useProfile'
import React from 'react'

const AddGoal = () => {
    const { data: profile } = useProfile()
    if (!profile) return;
    return (
        <GoalForm userId={profile.id} />
    )
}

export default AddGoal