'use client'

import DailyCard from "@/components/Dashboard/client/DailyCard";
import GoalsInfoCard from "@/components/Dashboard/client/goalsInfoCard";
import WelcomeCard from "@/components/Dashboard/client/WelcomeCard";
import HabitsForm from "@/components/Forms/habitForm";
import { useValidGoals } from "@/lib/Queries/goals/useValidGoals";
import { useUpcomingGoals } from "@/lib/Queries/goals/useUpcomingGoals";
import { useValidHabits } from "@/lib/Queries/habits/useValidHabits";
import { useProfile } from "@/lib/Queries/useProfile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/shared/pageStyles/Loading";
import { useTranslations } from "next-intl";
import { getTimezone } from "@/lib/utils/user/getTimeZone";
import { formatDateForQuery } from "@/lib/utils/date/formatDate";
import { useUpdateProfile } from "@/lib/Mutations/profiles/useUpdateProfile";

export default function Home() {
  const t = useTranslations('auth');

  const router = useRouter();
  const { data: profile, isLoading, error } = useProfile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isHabitFormOpen, setHabitFormOpen] = useState<boolean>(false);

  const { data: habits, isLoading: habitsLoading } = useValidHabits({ userId: profile?.id || "", date: formatDateForQuery(currentDate) })
  const { data: goals, isLoading: goalsLoading } = useValidGoals({ userId: profile?.id || "", date: formatDateForQuery(currentDate) })
  const { data: upcomingGoals, isLoading: upcomingGoalsLoading } = useUpcomingGoals({ userId: profile?.id || "", date: formatDateForQuery(currentDate) })

  const updateProfile = useUpdateProfile(profile?.id || "")
  const currentTimezone = getTimezone();
  useEffect(() => {
    if (profile && currentTimezone !== profile?.timezone) {
      updateProfile.mutate({ updates: { timezone: currentTimezone } })
    }
  }, [profile, currentTimezone, updateProfile])

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

  if (habitsLoading && goalsLoading && upcomingGoalsLoading) return <LoadingScreen />

  return (
    <div>
      <WelcomeCard
        name={profile.name}
        selectedDate={currentDate}
        handleDayChange={changeDay}
        onDateSelect={setCurrentDate}
        setHabitFormOpen={() => setHabitFormOpen(true)}
      />

      <HabitsForm
        isOpen={isHabitFormOpen}
        setIsOpen={() => setHabitFormOpen(false)}
        userId={profile.id}
      />

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
        <DailyCard className="col-span-1 md:col-span-2" habits={habits || []} userId={profile.id} />
        <div>
          <GoalsInfoCard goals={goals || []} upcomingGoals={upcomingGoals || []} />
        </div>
      </div>
    </div>
  );
}
