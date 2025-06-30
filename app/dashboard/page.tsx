'use client'

import DailyCard from "@/components/Dashboard/client/DailyCard";
import GoalsInfoCard from "@/components/Dashboard/client/goalsInfoCard";
import StatisticsCard from "@/components/Dashboard/client/statisticsCard";
import WelcomeCard from "@/components/Dashboard/client/WelcomeCard";
import HabitsForm from "@/components/Forms/habitForm";
import TodoForm from "@/components/Forms/todoForm";
import { useDailyTodos } from "@/lib/Queries/todos/useDailyTodo";
import { useValidGoals } from "@/lib/Queries/goals/useValidGoals";
import { useUpcomingGoals } from "@/lib/Queries/goals/useUpcomingGoals";
import { useValidHabits } from "@/lib/Queries/habits/useValidHabits";
import { useProfile } from "@/lib/Queries/useProfile";
import { formatDateForQuery } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/shared/pageStyles/Loading";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations('auth');

  const router = useRouter();
  const { data: profile, isLoading, error } = useProfile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTodoFormOpen, setTodoFormOpen] = useState<boolean>(false)
  const [isHabitFormOpen, setHabitFormOpen] = useState<boolean>(false)

  const { data: todos, isLoading: todosLoading } = useDailyTodos({ userId: profile?.id || "", date: formatDateForQuery(currentDate) });

  const { data: habits, isLoading: habitsLoading } = useValidHabits({ userId: profile?.id || "", date: formatDateForQuery(currentDate) })
  const { data: goals, isLoading: goalsLoading } = useValidGoals({ userId: profile?.id || "", date: formatDateForQuery(currentDate) })
  const { data: upcomingGoals, isLoading: upcomingGoalsLoading } = useUpcomingGoals({ userId: profile?.id || "", date: formatDateForQuery(currentDate) })

  useEffect(() => {
    if (isLoading) return

    if (!isLoading && !profile) {
      router.push("/auth")
    }
  }, [profile, router, isLoading])

  if (!profile) return null

  if (error) return <div>Error loading profile: {error.message}</div>;

  const changeDay = (count: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + count);
      return newDate;
    });
  };

  if (todosLoading && habitsLoading && goalsLoading && upcomingGoalsLoading) return <LoadingScreen />

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

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
        <DailyCard className="col-span-1 md:col-span-2" todos={todos || []} habits={habits || []} userId={profile.id} />
        <div>
          <StatisticsCard todos={todos || []} goals={goals || []} habits={habits || []} />
          <GoalsInfoCard goals={goals || []} upcomingGoals={upcomingGoals || []} />
        </div>
      </div>
    </div>
  );
}
