'use client'

import DailyCard from "@/components/client/Dashboard/DailyCard";
import GoalsInfoCard from "@/components/client/Dashboard/goalsInfoCard";
import StatisticsCard from "@/components/client/Dashboard/statisticsCard";
import WelcomeCard from "@/components/client/Dashboard/WelcomeCard";
import GoalForm from "@/components/client/Forms/goalForm";
import HabitsForm from "@/components/client/Forms/habitForm";
import TodoForm from "@/components/client/Forms/todoForm";
import { useGoals } from "@/lib/Queries/useGoal";
import { useHabits } from "@/lib/Queries/useHabit";
import { useProfile } from "@/lib/Queries/useProfile";
import { useTodos } from "@/lib/Queries/useTodo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useProfile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTodoFormOpen, setTodoFormOpen] = useState<boolean>(false)
  const [isHabitFormOpen, setHabitFormOpen] = useState<boolean>(false)
  const [isGoalFormOpen, setGoalFormOpen] = useState<boolean>(false)

  const { data: todos, isLoading: todosLoading } = useTodos(profile?.id || "")
  const { data: habits, isLoading: habitsLoading } = useHabits(profile?.id || "")
  const { data: goals, isLoading: goalsLoading } = useGoals(profile?.id || "")

  useEffect(() => {
    if (!profile) {
      router.push("/auth")
    }
  }, [profile, router])

  if (!profile) return null

  if (error) return <div>Error loading profile: {error.message}</div>;

  const changeDay = (count: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + count);
      return newDate;
    });
  };

  return (
    <div>
      <WelcomeCard
        name={profile.name}
        selectedDate={currentDate}
        handleDayChange={changeDay}
        onDateSelect={setCurrentDate}
        setHabitFormOpen={() => setHabitFormOpen(true)}
        setTodoFormOpen={() => setTodoFormOpen(true)}
      />

      <TodoForm
        userId={profile.id}
        isOpen={isTodoFormOpen}
        setIsOpen={() => setTodoFormOpen(false)}
      />

      <HabitsForm
        isOpen={isHabitFormOpen}
        setIsOpen={() => setHabitFormOpen(false)}
        userId={profile.id}
      />

      <GoalForm
        isOpen={isGoalFormOpen}
        setIsOpen={() => setGoalFormOpen(false)}
        userId={profile.id}
      />

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
        <DailyCard className="col-span-1 md:col-span-2" todos={todos || []} habits={habits || []} userId={profile.id} />
        <div>
          <StatisticsCard todos={todos || []} goals={goals || []} habits={habits || []} />
          <GoalsInfoCard goals={goals || []} setGoalFormOpen={() => setGoalFormOpen(true)} />
        </div>
      </div>
    </div>
  );
}
