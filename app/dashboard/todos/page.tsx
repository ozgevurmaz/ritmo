"use client"

import LoadingScreen from '@/components/shared/pageStyles/Loading';
import TodosDashboard from '@/components/Todos/TodosDashboard';
import { useProfile } from '@/lib/Queries/useProfile';
import React from 'react'

const Todos = () => {
    const { data: profile, isLoading, error } = useProfile();

    if (!profile) return

    if (isLoading) return <LoadingScreen />

    return (
        <TodosDashboard userId={profile.id} />
    )
}

export default Todos