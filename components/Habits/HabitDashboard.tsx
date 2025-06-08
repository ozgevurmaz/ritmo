"use client"

import React, { useState, useMemo } from "react";
import { useDeleteHabit } from "@/lib/Mutations/habits/useDeleteHabit";
import HabitForm from "../Forms/habitForm";
import PageHeaders from "../shared/Headers/PageHeaders";
import { formatDateForQuery } from "@/lib/utils";
import { useHabits } from "@/lib/Queries/habits/useHabit";
import AnalyticsCard from "../shared/AnalyticsCard";
import { useHabitsAnalytics } from "@/hooks/analytics";
import HabitTabs from "./HabitTabs";

interface HabitDashboardProps {
  userId: string
}

export const HabitDashboard: React.FC<HabitDashboardProps> = ({
  userId,

}) => {
  const [showHabitForm, setShowHabitForm] = useState<boolean>(false)
  const [editingHabit, setEditingHabit] = useState<HabitType | null>(null)

  const { mutateAsync: deleteHabit } = useDeleteHabit(userId)


  const { data: habits = [] } = useHabits(userId)

  const analyticsData = useHabitsAnalytics(habits)

  // Categorize habits
  const categorizedHabits = useMemo(() => {
    const now = new Date();
    const today = formatDateForQuery(now);

    return {
      active: habits.filter(habit =>
        habit.startDate <= today && (!habit.endDate || new Date(habit.endDate) >= now)
      ),
      completed: habits.filter(habit =>
        habit.endDate && new Date(habit.endDate) < now
      ),
      upcoming: habits.filter(habit =>
        habit.startDate > today
      ),
      paused: habits.filter(habit =>
        habit.streak === 0 && habit.completedToday === 0
      )
    };
  }, [habits]);

  const handleDeleteHabit = async (habitId: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      await deleteHabit(habitId);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <PageHeaders
        title="Habit Dashboard"
        defination="Track and manage your daily habits"
        showButton
        buttonAction={() => {
          setEditingHabit(null)
          setShowHabitForm(true)
        }}
        textColor="text-habits"
        buttonStyle="bg-habits hover:bg-habits/60"
      />

      <AnalyticsCard data={analyticsData} />

      <HabitTabs habits={habits} userId={userId} />

      <HabitForm isOpen={showHabitForm} setIsOpen={() => setShowHabitForm(false)} userId={userId} editingHabit={editingHabit} />
    </div>
  );
};
