"use client"

import React, { useState } from 'react'

import HabitsForm from '../habitForm';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useHabits } from '@/lib/Queries/habits/useHabit';
import { HabitsCard } from '../../Habits/HabitsCard';
import { FormWrapper } from '../Wrapper/FormWrapper';

interface HabitManagmentHabit {
    userId: string
    goalTitle: string
    addedHabits: HabitFormValues[]
    selectedHabits: HabitType[]
    enableAddHabit: boolean
    defaultGoalHabit: HabitFormValues

    handleNewHabitSave: (habit: HabitFormValues) => void;
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
    goalTitle,
    addedHabits,
    enableAddHabit = false,
    selectedHabits,
    defaultGoalHabit
}: HabitManagmentHabit) => {

    const { data: allHabits } = useHabits(userId)
    let totalSelectedHabits = addedHabits.length + selectedHabits.length;

    const [showHabitForm, setShowHabitForm] = useState(false);
    const [editingHabit, setEditingHabit] = useState<HabitType | null>(null)
    const [editingGoalHabit, setEditingGoalHabit] = useState<HabitFormValues | null>(null)

    const filteredAvailableHabits = allHabits
        ?.filter((habit) => habit.goal === null)
        ?.filter((habit) => !selectedHabits.some(h => h.id === habit.id));

    return (
        <FormWrapper
            title='Habit Management'
            icon={RotateCcw}
            variant="element"
        >
            <div className='overflow-y-auto space-y-4 w-full h-100 relative'>

                <Button
                    disabled={!enableAddHabit}
                    type="button"
                    onClick={() => {
                        setEditingGoalHabit(defaultGoalHabit)
                        setShowHabitForm(true)
                    }}
                    className="relative"
                >
                    Add New Habit
                </Button>
                {totalSelectedHabits === 0 && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Please select at least one habit to link with this goal.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Selected Habits Section */}
                {(selectedHabits.length > 0 || addedHabits.length > 0) && (
                    <div>
                        <h4 className="font-medium mb-3">Selected Habits</h4>
                        <div className="space-y-2">
                            {selectedHabits.map((habit) => (
                                <HabitsCard
                                    key={habit.id}
                                    habit={habit}
                                    showDelete
                                    showEdit
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

                {/* New Habits Section */}
                {addedHabits.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-3">New Habits</h4>
                        <div className="space-y-2">
                            {addedHabits.map((habit) => (
                                <HabitsCard
                                    key={habit.id}
                                    newHabit={habit}
                                    showGoal
                                    showDelete
                                    showEdit
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

                {/* Available Habits Section */}
                {filteredAvailableHabits && filteredAvailableHabits.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-3">Available Habits</h4>
                        <div className="space-y-2">
                            {filteredAvailableHabits.map((habit) => (
                                <HabitsCard
                                    key={habit.id}
                                    checkbox
                                    checkboxAction={(checked) => {
                                        if (checked) {
                                            handleSelectExistingHabit(habit)
                                        }
                                    }}
                                    habit={habit}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <HabitsForm
                    editingGoalHabit={editingGoalHabit}
                    isOpen={showHabitForm}
                    setIsOpen={() => setShowHabitForm(false)}
                    userId={userId}
                    fromGoal={true}
                    setGoalHabits={handleNewHabitSave}
                    goalTitle={goalTitle}
                />
            </div>
        </FormWrapper>
    )
}