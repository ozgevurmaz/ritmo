"use client"

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Target,
  Activity,
  Calendar,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { HabitsCard } from "@/components/Habits/HabitsCard";
import { useDeleteHabit } from "@/lib/Mutations/habits/useDeleteHabit";
import HabitForm from "../Forms/habitForm";
import PageHeaders from "../shared/Headers/PageHeaders";
import { formatDateForQuery } from "@/lib/utils";
import { useHabits } from "@/lib/Queries/habits/useHabit";
import LoadingScreen from "../shared/pageStyles/Loading";
import { useGoals } from "@/lib/Queries/goals/useGoal";
import AnalyticsCard from "../shared/AnalyticsCard";
import { useHabitsAnalytics } from "@/hooks/analytics";

interface HabitDashboardProps {
  userId: string
}

export const HabitDashboard: React.FC<HabitDashboardProps> = ({
  userId,

}) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [showHabitForm, setShowHabitForm] = useState<boolean>(false)
  const [editingHabit, setEditingHabit] = useState<HabitType | null>(null)
  const [activeTab, setActiveTab] = useState("active");

  const { mutateAsync: deleteHabit } = useDeleteHabit(userId)

  const { data: goals = [] } = useGoals(userId)
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

  const habitsByGoal = useMemo(() => {
    const groupHabitsByGoal = (habits: HabitType[]) => {
      const grouped = new Map<string, HabitType[]>();
      const unassigned: HabitType[] = [];

      habits.forEach(habit => {
        if (habit.goal) {
          if (!grouped.has(habit.goal)) {
            grouped.set(habit.goal, []);
          }
          grouped.get(habit.goal)!.push(habit);
        } else {
          unassigned.push(habit);
        }
      });

      return { grouped, unassigned };
    };

    return {
      active: groupHabitsByGoal(categorizedHabits.active || []),
      completed: groupHabitsByGoal(categorizedHabits.completed || []),
      upcoming: groupHabitsByGoal(categorizedHabits.upcoming || [])
    };
  }, [categorizedHabits]);

  const handleDeleteHabit = async (habitId: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      await deleteHabit(habitId);
    }
  };

  const renderHabitsByGoal = (goalId: string, goalTitle: string, habitsForGoal: HabitType[]) => (
    <div key={goalId} className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-goals" />
          <h3 className="text-lg font-semibold text-goals">{goalTitle}</h3>
          <Badge variant="secondary" className="bg-goals/10 text-goals">
            {habitsForGoal.length} habit{habitsForGoal.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {habitsForGoal.reduce((sum, h) => sum + h.completedToday, 0)}/
          {habitsForGoal.reduce((sum, h) => sum + h.frequencyPerDay, 0)} completed today
        </div>
      </div>

      <div className="grid gap-2 ml-6">
        {habitsForGoal.map(habit => (
          <HabitsCard
            key={habit.id}
            habit={habit}
            border={false}
            showStreak={true}
            editAction={() => {
              setEditingHabit(habit)
              setShowHabitForm(true)
            }}
            deleteAction={() => handleDeleteHabit(habit.id)}
          />
        ))}
      </div>
    </div>
  );

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



      <HabitForm isOpen={showHabitForm} setIsOpen={() => setShowHabitForm(false)} userId={userId} editingHabit={editingHabit} />
    </div>
  );
};
