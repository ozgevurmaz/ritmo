"use client"

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Edit, Trash2 } from "lucide-react";
import StreakBadge from "@/components/client/StreakBadge";

interface SimpleHabitsCardsProps {
    habit?: HabitType
    newHabit?: HabitFormValues
    checkbox?: boolean
    checkboxAction?: (habitId: string) => void;
    checked?: boolean;
    showEdit?: boolean;
    EditAction?: () => void;
    showDelete?: boolean;
    deleteAction?: () => void;
    decrementHabit?: () => void
    incrementHabit?: () => void
    goal?: string
    showStreak?: boolean
    border?: boolean
    showGoal?:boolean
}

export const SimpleHabitsCards: React.FC<SimpleHabitsCardsProps> = ({
    habit,
    newHabit,
    checkbox = false,
    checkboxAction,
    checked,
    showEdit = true,
    EditAction,
    showDelete = true,
    deleteAction,
    decrementHabit,
    incrementHabit,
    goal,
    showGoal = false,
    showStreak = false,
    border = true
}) => {


    return (
        <div className={`w-full flex items-center space-x-3 p-3 ${border ? "border justify-between" : ""} rounded-lg hover:bg-muted`}>
            {habit && checkbox && (
                <Checkbox
                    className="cursor-pointer"
                    id={`habit-${habit.id}`}
                    checked={checked}
                    onCheckedChange={(checked) => {
                        if (checked && checkboxAction) {
                            checkboxAction(habit.id);
                        }
                    }}
                />
            )}

            <div className="flex flex-col">
                <div
                    className="text-sm font-muted-foreground"
                >
                    <span className="font-medium">{habit ? habit.title : newHabit ? newHabit.title : ""}</span>

                    {!goal && !decrementHabit && !incrementHabit &&
                    <span> • {habit ? habit.category : newHabit ? newHabit.category : ""} • {habit ? habit.frequencyPerDay : newHabit ? newHabit.frequencyPerDay : ""} x daily, {habit ? habit.weeklyFrequency : newHabit ? newHabit.weeklyFrequency : ""} days/week </span>}
                    
                    { showGoal && goal && (
                        <span className="text-xs text-goal bg-goal/10 px-2 py-0.5 rounded-full">
                                  <span className="text-goals font-semibold"> • Goal: </span>
                            {goal}
                        </span>
                    )}

                </div>

                <div className="flex items-center gap-2 mt-1">
                    {habit && decrementHabit && incrementHabit &&
                        <div>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: habit.frequencyPerDay }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (index < habit.completedToday) {
                                                decrementHabit();
                                            } else if (index === habit.completedToday) {
                                                incrementHabit();
                                            }
                                        }}
                                        className="transition-colors"
                                    >
                                        {index < habit.completedToday ? (
                                            <CheckCircle2 className="h-4 w-4 text-habit" />
                                        ) : (
                                            <Circle className="h-4 w-4 text-muted-foreground hover:text-habit" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            {habit && <span className="text-xs text-muted-foreground">
                                {habit.completedToday}/{habit.frequencyPerDay}
                            </span>}

                        </div>}
                </div>
            </div>
            <div className="flex gap-2">
                {showEdit && EditAction && (
                    <Button variant="outline" size="sm" onClick={EditAction}>
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
                {showDelete && deleteAction && (
                    <Button variant="destructive" size="sm" onClick={deleteAction}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {habit && showStreak && habit.streak > 0 && (
                <StreakBadge streak={habit.streak} isTextShown isSmall />
            )}
        </div>
    );
};
