"use client"
import { HabitDashboard } from "@/components/Habits/HabitDashboard"
import LoadingScreen from "@/components/shared/pageStyles/Loading";
import { useGoals } from "@/lib/Queries/goals/useGoal";
import { useHabits } from "@/lib/Queries/habits/useHabit";
import { useProfile } from "@/lib/Queries/useProfile"



const Habits = () => {
  const { data: profile, isLoading, error } = useProfile();

  if (!profile) return

  if (isLoading) return <LoadingScreen />

  return (
    <HabitDashboard
      userId={profile.id}
    />
  )
}

export default Habits