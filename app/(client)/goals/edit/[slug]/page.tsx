"use client";

import GoalForm from "@/components/client/Forms/goalForm";
import { useSelectedGoal } from "@/lib/Queries/goals/useSelectedGoal";
import { useProfile } from "@/lib/Queries/useProfile";
import { useParams } from "next/navigation";
import React from "react";

const EditGoal = () => {
  const { slug } = useParams();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const userId = profile?.id ?? "";
  const { data: selectedGoal, isLoading: goalLoading } = useSelectedGoal({
    userId,
    slug: slug as string,
  });

  const isLoading = profileLoading || goalLoading || !profile?.id;

  if (isLoading) return <div>Loading...</div>;

  return <GoalForm userId={profile.id} editingGoal={selectedGoal} />;
};

export default EditGoal;
