"use client"

import React, { useState, useMemo } from "react";
import HabitForm from "../Forms/habitForm";
import PageHeaders from "../shared/Headers/PageHeaders";
import { useHabits } from "@/lib/Queries/habits/useHabit";
import AnalyticsCard from "../shared/AnalyticsCard";
import { useHabitsAnalytics } from "@/hooks/analytics";
import HabitTabs from "./HabitTabs";
import { useTranslations } from "next-intl";

interface HabitDashboardProps {
  userId: string
}

export const HabitDashboard: React.FC<HabitDashboardProps> = ({
  userId,
}) => {

  const t = useTranslations("habits")
  const [showHabitForm, setShowHabitForm] = useState<boolean>(false)
  const [editingHabit, setEditingHabit] = useState<HabitType | null>(null)

  const { data: habits = [] } = useHabits(userId)

  const analyticsData = useHabitsAnalytics(habits)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <PageHeaders
        title={t("title")}
        definition={t("definition")}
        showButton
        buttonAction={() => {
          setEditingHabit(null)
          setShowHabitForm(true)
        }}
        textColor="text-habits"
        buttonStyle="bg-habits hover:bg-habits/60"
        buttonText={t("add-button")}
      />

      <AnalyticsCard data={analyticsData} />

      <HabitTabs habits={habits} userId={userId} />

      <HabitForm isOpen={showHabitForm} setIsOpen={() => setShowHabitForm(false)} userId={userId} editingHabit={editingHabit} />
    </div>
  );
};
