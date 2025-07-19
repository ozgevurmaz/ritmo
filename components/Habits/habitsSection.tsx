import React from "react";
import { PlayCircle, Target } from "lucide-react";
import { HabitsCard } from "./HabitsCard";
import { useTranslations } from "next-intl";

interface HabitsSectionProps {
  habitsGroup: {
    grouped: { [goalName: string]: HabitType[] };
    habitsWithoutGoals: HabitType[];
  };
  totalCount: number;
  emptyTextKey: string;
  userId: string;
  habits: HabitType[];
  onEditHabit?: (habit: HabitType) => void;
}

const HabitsSection = ({
  habitsGroup,
  totalCount,
  emptyTextKey,
  userId,
  habits,
  onEditHabit,
}: HabitsSectionProps) => {
  const t = useTranslations("common.empty-states.habits");

  if (totalCount === 0) {
    return (
      <div className="text-center py-12">
        <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">{t(emptyTextKey)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.keys(habitsGroup.grouped).map((goalName) => (
        <div key={goalName} className="space-y-3">
          <div className="flex items-center gap-2 pb-2">
            <Target className="h-4 w-4 text-goals" />
            <h3 className="text-sm font-medium text-goals">{goalName}</h3>
            <div className="h-px bg-goals/20 flex-1 ml-2" />
          </div>
          {habitsGroup.grouped[goalName].map((habit) => (
            <div key={habit.id} className="space-y-2 ml-4">
              <HabitsCard
                habit={habit}
                userId={userId}
                habits={habits}
                showStreak={true}
                showGoal={false}
                showProccess={true}
                editAction={() => onEditHabit?.(habit)}
                showDelete
              />
            </div>
          ))}
        </div>
      ))}

      {habitsGroup.habitsWithoutGoals.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2">
            <PlayCircle className="h-4 w-4 text-habits" />
            <h3 className="text-sm font-medium text-habits">{t("no-goal")}</h3>
            <div className="h-px bg-habits/20 flex-1 ml-2" />
          </div>
          {habitsGroup.habitsWithoutGoals.map((habit) => (
            <div key={habit.id} className="space-y-2 ml-4">
              <HabitsCard
                habit={habit}
                userId={userId}
                habits={habits}
                showStreak={true}
                showProccess={true}
                editAction={() => onEditHabit?.(habit)}
                showDelete
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitsSection;
