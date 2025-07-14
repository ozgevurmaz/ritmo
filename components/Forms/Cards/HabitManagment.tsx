"use client"

import React, { useState } from 'react'
import { AlertCircle, RotateCcw, Plus, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHabits } from '@/lib/Queries/habits/useHabit';
import { FormWrapper } from '../Wrapper/FormWrapper';
import { useTranslations } from 'next-intl';
import QuickHabitForm from '../quickHabitForm';
import GoalHabitCard from '../../Goals/GoalHabitCard';
import { HabitData } from '../quickHabitForm';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

interface HabitManagmentHabit {
    userId: string
    addedHabits: HabitData[]
    selectedHabits: HabitType[]
    enableAddHabit: boolean
    handleNewHabitSave: (habit: HabitData) => void;
    handleSelectExistingHabit: (habit: HabitType) => void;
    handleRemoveNewHabit: (habitTitle: string) => void;
    handleRemoveExistingHabit: (habitId: string) => void;
}

export const HabitManagment = ({
    userId,
    handleNewHabitSave,
    handleSelectExistingHabit,
    handleRemoveNewHabit,
    handleRemoveExistingHabit,
    addedHabits,
    enableAddHabit = false,
    selectedHabits,
}: HabitManagmentHabit) => {
    const t = useTranslations()
    const { data: allHabits } = useHabits(userId)
    let totalSelectedHabits = addedHabits.length + selectedHabits.length;

    const [showHabitForm, setShowHabitForm] = useState(false);
    const [showAvailableHabits, setShowAvailableHabits] = useState(false);
    const [editingHabit, setEditingHabit] = useState<HabitType | null>(null)
    const [editingGoalHabit, setEditingGoalHabit] = useState<HabitData | null>(null)

    const filteredAvailableHabits = allHabits
        ?.filter((habit) => habit.goal === null)
        ?.filter((habit) => !selectedHabits.some(h => h.id === habit.id));

    const handleAddNewHabit = () => {
        setShowHabitForm(true);
        setShowAvailableHabits(false);
    };

    const handleLinkExistingHabit = () => {
        setShowAvailableHabits(!showAvailableHabits);
        setShowHabitForm(false);
    };

    const handleCloseForm = () => {
        setShowHabitForm(false);
        setEditingHabit(null);
        setEditingGoalHabit(null);
    };

    return (
        <FormWrapper
            title={t("forms.goal.habit-management.title")}
            icon={RotateCcw}
            variant="element"
        >
            <div className='space-y-4 w-full'>

                {/* Action Buttons */}
                <div className='flex gap-2 flex-wrap'>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddNewHabit}
                        disabled={!enableAddHabit}
                        className='flex items-center gap-2'
                    >
                        <Plus className='h-4 w-4' />
                        {t("forms.habit.create-title")}
                    </Button>

                    {filteredAvailableHabits && filteredAvailableHabits.length > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleLinkExistingHabit}
                            disabled={!enableAddHabit}
                            className='flex items-center gap-2'
                        >
                            <RotateCcw className='h-4 w-4' />
                            {t("forms.goal.habit-management.link-habit")} ({filteredAvailableHabits.length})
                        </Button>
                    )}
                </div>

                {/* Quick Habit Form */}
                {showHabitForm && (
                    <div className='bg-muted/30 border border-border rounded-lg p-4'>
                        <div className='flex justify-between items-center mb-3'>
                            <h4 className='font-medium'>
                                {editingGoalHabit ? t("forms.habit.edit-title") : t("forms.habit.create-title")}
                            </h4>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleCloseForm}
                                className='h-6 w-6 p-0'
                            >
                                <X className='h-4 w-4' />
                            </Button>
                        </div>
                        <QuickHabitForm
                            editingHabit={editingGoalHabit}
                            setIsOpen={handleCloseForm}
                            addHabit={handleNewHabitSave}
                        />
                    </div>
                )}

                {/* Available Habits Collapsible */}
                {filteredAvailableHabits && filteredAvailableHabits.length > 0 && (
                    <Collapsible open={showAvailableHabits} onOpenChange={setShowAvailableHabits}>
                        <CollapsibleContent className="space-y-2">
                            <div className='bg-muted/20 border border-border rounded-lg p-3'>
                                <h4 className="font-medium mb-3 text-sm">
                                    {t("forms.goal.habit-management.section.available")}
                                </h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {filteredAvailableHabits.map((habit) => (
                                        <GoalHabitCard
                                            key={habit.id}
                                            checkboxAction={(checked) => {
                                                if (checked) {
                                                    handleSelectExistingHabit(habit)
                                                }
                                            }}
                                            title={habit.title}
                                            frequencyPerDay={habit.frequencyPerDay}
                                            allowSkip={habit.allowSkip}
                                            weeklyFrequency={habit.weeklyFrequency}
                                            selectedDays={habit.selectedDays}
                                            reminderTimes={habit.reminderTimes}
                                            id={habit.id}
                                            category={habit.category}
                                            variant="default"
                                            showCheckbox
                                        />
                                    ))}
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}

                {/* No Habits Alert */}
                {totalSelectedHabits === 0 && !showHabitForm && (
                    <Alert variant="default" className='border-warning/20 bg-warning/5'>
                        <AlertCircle className="h-4 w-4 text-warning" />
                        <AlertDescription className='text-warning'>
                            {!enableAddHabit
                                ? t("forms.goal.habit-management.alert.no-info")
                                : t("forms.goal.habit-management.alert.no-habit")
                            }
                        </AlertDescription>
                    </Alert>
                )}

                {/* Selected Habits Summary */}
                {totalSelectedHabits > 0 && (
                    <div className='flex items-center gap-2 p-2 bg-accent/10 rounded-lg border border-accent/20'>
                        <Badge variant="secondary" >
                            {t("forms.goal.habit-management.new-count", { new: totalSelectedHabits })}
                        </Badge>
                        <span className='text-sm text-muted-foreground'>
                            {addedHabits.length > 0 && `${addedHabits.length} ${t("forms.goal.habit-management.new-habit")}`}
                            {addedHabits.length > 0 && selectedHabits.length > 0 && ', '}
                            {selectedHabits.length > 0 && `${selectedHabits.length} ${t("forms.goal.habit-management.selected-habit")}`}
                        </span>
                    </div>
                )}

                {/* Selected Existing Habits */}
                {selectedHabits.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                            {t("forms.goal.habit-management.section.selected")} ({selectedHabits.length})
                        </h4>
                        <div className="space-y-2">
                            {selectedHabits.map((habit) => (
                                <GoalHabitCard
                                    key={habit.id}
                                    title={habit.title}
                                    frequencyPerDay={habit.frequencyPerDay}
                                    allowSkip={habit.allowSkip}
                                    weeklyFrequency={habit.weeklyFrequency}
                                    selectedDays={habit.selectedDays}
                                    reminderTimes={habit.reminderTimes}
                                    id={habit.id}
                                    category={habit.category}
                                    variant="default"
                                    showActions
                                    deleteAction={() => handleRemoveExistingHabit(habit.id)}
                                    editAction={() => {
                                        setEditingHabit(habit)
                                        setShowHabitForm(true)
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* New Habits */}
                {addedHabits.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                            {t("forms.goal.habit-management.section.new")} ({addedHabits.length})
                        </h4>
                        <div className="space-y-2">
                            {addedHabits.map((habit, index) => (
                                <GoalHabitCard
                                    key={index}
                                    title={habit.title}
                                    frequencyPerDay={habit.frequencyPerDay}
                                    allowSkip={habit.allowSkip}
                                    weeklyFrequency={habit.weeklyFrequency}
                                    selectedDays={habit.selectedDays}
                                    reminderTimes={habit.reminderTimes}
                                    deleteAction={() => handleRemoveNewHabit(habit.title)}
                                    editAction={() => {
                                        setEditingGoalHabit(habit)
                                        setShowHabitForm(true)
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </FormWrapper>
    )
}