"use client";

import GoalForm from "@/components/Forms/goalForm";
import LoadingScreen from "@/components/shared/pageStyles/Loading";
import { useSelectedGoal } from "@/lib/Queries/goals/useSelectedGoal";
import { useProfile } from "@/lib/Queries/useProfile";
import { useParams } from "next/navigation";
import React from "react";

const EditGoal = () => {
  const params = useParams();
  if (!params || typeof params.slug !== 'string') {
    throw new Error("Invalid route params");
  }
  const slug = params.slug;
  const { data: profile, isLoading: profileLoading } = useProfile();

  const userId = profile?.id ?? "";
  const { data: selectedGoal, isLoading: goalLoading } = useSelectedGoal({
    userId,
    slug: slug as string,
  });

  const isLoading = profileLoading || goalLoading || !profile?.id;

  if (isLoading) return <LoadingScreen />

  return <GoalForm userId={profile.id} editingGoal={selectedGoal} />;
};

export default EditGoal;
