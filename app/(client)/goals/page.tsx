"use client"

import GoalsPage from '@/components/client/Goals/dashboard'
import { useProfile } from '@/lib/Queries/useProfile';
import React from 'react'

const Goals = () => {
    const { data: profile, isLoading, error } = useProfile();
    if (!profile) return
    return (
        <GoalsPage userId={profile.id} />
    )
}

export default Goals