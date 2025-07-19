"use client"

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Edit, Trash2 } from "lucide-react";
import StreakBadge from "@/components/custom/StreakBadge";
import { useUpdateHabitProgress } from "@/lib/Mutations/habits/useUpdateHabitProgress";
import { useTranslations } from "next-intl";
import { DeleteConfirmDialog } from "../shared/DeleteConfirmDialog";
import { toast } from "sonner";
import { useDeleteHabit } from "@/lib/Mutations/habits/useDeleteHabit";

interface HabitsCardProps {
    habit?: HabitType
    newHabit?: HabitFormValues
    checkbox?: boolean
    checkboxAction?: (habitId: string) => void;
    checked?: boolean;
    showEdit?: boolean;
    editAction?: () => void;
    showDelete?: boolean;
    deleteAction?: () => void;
    goal?: string
    showStreak?: boolean
    border?: boolean
    showGoal?: boolean
    userId: string,
    habits?: HabitType[],
    showProccess?: boolean
}

export const HabitsCard: React.FC<HabitsCardProps> = ({
    habit,
    newHabit,
    checkbox = false,
    checkboxAction,
    checked,
    editAction,
    deleteAction,
    goal,
    showGoal = false,
    showStreak = false,
    border = true,
    userId,
    habits,
    showProccess = false,
    showDelete
}) => {
    const t = useTranslations()
    const { mutate: updateHabitProgress } = useUpdateHabitProgress(userId);
    const { mutate: deleteHabit } = useDeleteHabit(userId);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const completed = habit?.completedToday === habit?.frequencyPerDay
    const incrementHabit = (id: string) => {
        const habit = habits?.find(h => h.id === id);
        if (!habit) return;

        const nextCount = habit.completedToday + 1;

        if (nextCount <= habit.frequencyPerDay) {
            updateHabitProgress({ habitId: id, completedToday: nextCount });
        }
    };

    const decrementHabit = (id: string) => {
        const habit = habits?.find(h => h.id === id);
        if (!habit) return;

        const nextCount = habit.completedToday - 1;

        if (nextCount <= habit.frequencyPerDay) {
            updateHabitProgress({ habitId: id, completedToday: nextCount });
        }
    };

    const handleClose = () => {
        setShowDeleteConfirm(false);
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (habit) {
            deleteHabit(habit.id || "");
            toast.success(t("forms.habit.toasts.delete-success"));
            setShowDeleteConfirm(false);
            handleClose();
        }
    };

    return (
        <div className={`w-full flex items-center space-x-3 py-3 px-6 ${border ? "border" : ""} ${completed ? "opacity-80" : ""} justify-between rounded-lg hover:bg-muted`}>
            {habit && checkbox && (
                <Checkbox
                    className="cursor-pointer"
                    id={`habit-${habit.id}`}
                    checked={checked}
                    disabled={completed}
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
                    <span className={`font-medium ${completed ? "line-through" : ""}`}>
                        {habit ? habit.title : newHabit ? newHabit.title : ""}
                    </span>

                    {!goal && !decrementHabit && !incrementHabit &&
                        <span> • {habit ? habit.category : newHabit ? newHabit.category : ""} • {habit ? habit.frequencyPerDay : newHabit ? newHabit.frequencyPerDay : ""} x daily, {habit ? habit.weeklyFrequency : newHabit ? newHabit.weeklyFrequency : ""} days/week </span>}

                    {showGoal && goal && (
                        <span className="text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded-full ml-2">
                            <span className="text-secondary-foreground font-semibold">{t("habits.goal")}:</span>
                            {goal}
                        </span>
                    )}

                </div>

                <div className="flex items-center gap-2 mt-1">
                    {(showProccess && habit) &&
                        <div>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: habit.frequencyPerDay }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (index < habit.completedToday) {
                                                decrementHabit(habit.id);
                                            } else if (index === habit.completedToday) {
                                                incrementHabit(habit.id);
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
                {habit && showStreak && (
                    <StreakBadge streak={habit.streak} isTextShown isSmall />
                )}

                {editAction && (
                    <Button variant="outline" size="sm" onClick={editAction}>
                        <Edit className="h-4 w-4" />
                    </Button>
                )}

                {deleteAction && (
                    <Button variant="destructive" size="sm" onClick={deleteAction}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}

                {(showDelete && !deleteAction) && (
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <DeleteConfirmDialog
                open={showDeleteConfirm}
                onClose={handleClose}
                onConfirm={confirmDelete}
                title={t("forms.habit.delete.title")}
                description={t("forms.habit.delete.description")}
            />

        </div>
    );
};
