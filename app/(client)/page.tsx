'use client'


import DailyCard from "@/components/client/Dashboard/DailyCard";
import GoalsInfoCard from "@/components/client/Dashboard/goalsInfoCard";
import StatisticsCard from "@/components/client/Dashboard/statisticsCard";
import WelcomeCard from "@/components/client/Dashboard/WelcomeCard";
import { GOALS, HABITS, TODOS } from "@/lib/constants";
import { useProfile } from "@/lib/Queries/useProfile";
import { useState } from "react";

export default function Home() {
  const { data: profile, isLoading, error } = useProfile();
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeDay = (count: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + count);
      return newDate;
    });
  };

  if (error) return <div>Error loading profile: {error.message}</div>;

  return (
    <div>
      <WelcomeCard
        name={profile?.name || ""}
        selectedDate={currentDate}
        handleDayChange={changeDay}
        onDateSelect={setCurrentDate}
      />

      <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-5">

        <DailyCard className="col-span-2" todos={TODOS} habits={HABITS} />
        <div>
          <StatisticsCard todos={TODOS} goals={GOALS} habits={HABITS} />
          <GoalsInfoCard goals={GOALS} />
        </div>
      </div>
    </div>
  );
}
