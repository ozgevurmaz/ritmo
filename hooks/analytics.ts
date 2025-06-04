import { useMemo } from 'react';
import {
  TrendingUp,
  Calendar,
  BarChart3,
  Activity,
  Target,
  CheckCircle,
  Zap,
  Trophy,
} from "lucide-react";

export const useHabitsAnalytics = (habits: HabitType[]): BaseAnalyticsData[] => {
  return useMemo(() => {
    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => {
      const today = new Date();
      const endDate = h.endDate ? new Date(h.endDate) : null;
      return !endDate || endDate >= today;
    }).length;
    
    const completedToday = habits.reduce((sum, habit) => sum + habit.completedToday, 0);
    const totalDailyTarget = habits.reduce((sum, habit) => sum + habit.frequencyPerDay, 0);
    const averageStreak = habits.length > 0
      ? habits.reduce((sum, habit) => sum + habit.streak, 0) / habits.length
      : 0;
    const completionRate = totalDailyTarget > 0
      ? (completedToday / totalDailyTarget) * 100
      : 0;

    return [
      {
        label: "Active Habits",
        value: activeHabits,
        icon: Activity,
        colorClass: "text-habits"
      },
      {
        label: "Avg. Streak",
        value: Math.round(averageStreak * 10) / 10,
        icon: TrendingUp,
        colorClass: "text-success"
      },
      {
        label: "Today's Progress",
        value: `${completedToday}/${totalDailyTarget}`,
        icon: Calendar,
        colorClass: "text-activities"
      },
      {
        label: "Completion Rate",
        value: `${Math.round(completionRate)}%`,
        icon: BarChart3,
        colorClass: "text-primary",
        showProgress: true,
        progressValue: completionRate
      }
    ];
  }, [habits]);
};

// Todos Analytics Hook
export const useTodosAnalytics = (todos: TodoType[]): BaseAnalyticsData[] => {
  return useMemo(() => {
    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.completed).length;
    const pendingTodos = totalTodos - completedTodos;
    const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // High priority pending tasks
    const highPriorityPending = todos.filter(t =>
      !t.completed && (t.urgent === "High" || t.importance === "High")
    ).length;

    // Overdue tasks
    const overdueTodos = todos.filter(t => {
      if (t.completed) return false;
      const deadlineDate = new Date(t.deadline);
      return deadlineDate < today;
    }).length;

    return [
      {
        label: "Total Tasks",
        value: totalTodos,
        icon: CheckCircle,
        colorClass: "text-todos"
      },
      {
        label: "Completed",
        value: completedTodos,
        icon: Trophy,
        colorClass: "text-success"
      },
      {
        label: "High Priority",
        value: highPriorityPending,
        icon: Zap,
        colorClass: "text-destructive"
      },
      {
        label: "Completion Rate",
        value: `${Math.round(completionRate)}%`,
        icon: BarChart3,
        colorClass: "text-primary",
        showProgress: true,
        progressValue: completionRate
      }
    ];
  }, [todos]);
};

// Goals Analytics Hook
export const useGoalsAnalytics = (goals: GoalType[]): BaseAnalyticsData[] => {
  return useMemo(() => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed).length;
    const activeGoals = totalGoals - completedGoals;

    // Calculate average progress based on completed days vs total days
    const averageProgress = goals.length > 0
      ? goals.reduce((sum, goal) => {
        if (goal.completed) return sum + 100;

        const startDate = new Date(goal.startDate);
        const endDate = new Date(goal.endDate);
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const progress = totalDays > 0 ? (goal.completedDays / totalDays) * 100 : 0;

        return sum + Math.min(progress, 100);
      }, 0) / goals.length
      : 0;

    // Goals ending soon (within 7 days)
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const endingSoon = goals.filter(g => {
      if (g.completed) return false;
      const endDate = new Date(g.endDate);
      return endDate >= today && endDate <= weekFromNow;
    }).length;

    return [
      {
        label: "Active Goals",
        value: activeGoals,
        icon: Target,
        colorClass: "text-goals"
      },
      {
        label: "Completed",
        value: completedGoals,
        icon: Trophy,
        colorClass: "text-success"
      },
      {
        label: "Avg. Progress",
        value: `${Math.round(averageProgress)}%`,
        icon: TrendingUp,
        colorClass: "text-primary",
        showProgress: true,
        progressValue: averageProgress
      },
      {
        label: "Ending Soon",
        value: endingSoon,
        icon: Calendar,
        colorClass: "text-activities"
      }
    ];
  }, [goals]);
};

// Combined Analytics Hook (for dashboard overview)
export const useCombinedAnalytics = (
  habits: HabitType[],
  todos: TodoType[],
  goals: GoalType[]
): BaseAnalyticsData[] => {
  return useMemo(() => {
    const totalItems = habits.length + todos.length + goals.length;
    const completedTodos = todos.filter(t => t.completed).length;
    const completedGoals = goals.filter(g => g.completed).length;

    // Active habits (not expired)
    const today = new Date();
    const activeHabits = habits.filter(h => {
      const endDate = h.endDate ? new Date(h.endDate) : null;
      return !endDate || endDate >= today;
    }).length;

    // Today's habit progress
    const todayHabitProgress = habits.reduce((sum, habit) =>
      sum + habit.completedToday, 0
    );
    const todayHabitTarget = habits.reduce((sum, habit) =>
      sum + habit.frequencyPerDay, 0
    );
    const todayProductivity = todayHabitTarget > 0
      ? (todayHabitProgress / todayHabitTarget) * 100
      : 0;

    return [
      {
        label: "Total Items",
        value: totalItems,
        icon: Activity,
        colorClass: "text-activities"
      },
      {
        label: "Active Habits",
        value: activeHabits,
        icon: Zap,
        colorClass: "text-habits"
      },
      {
        label: "Completed Items",
        value: completedTodos + completedGoals,
        icon: CheckCircle,
        colorClass: "text-success"
      },
      {
        label: "Today's Focus",
        value: `${Math.round(todayProductivity)}%`,
        icon: Target,
        colorClass: "text-primary",
        showProgress: true,
        progressValue: todayProductivity
      }
    ];
  }, [habits, todos, goals]);
};