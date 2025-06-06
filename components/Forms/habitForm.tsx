"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import {
    Calendar,
    Target,
    Clock,
    Sparkles,
    WandSparkles
} from 'lucide-react';
import { habitSchema } from '@/lib/zod/client/habit';
import { toast } from 'sonner';
import { useAddHabit } from '@/lib/Mutations/habits/useAddHabit';
import { useDeleteHabit } from '@/lib/Mutations/habits/useDeleteHabit';
import { useUpdateHabit } from '@/lib/Mutations/habits/useUpdateHabit';
import { formatDateForQuery } from '@/lib/utils';
import { PrivacyCard } from './Cards/PrivacyCard';
import { CategorySelection } from './Selectors/CategorySelection';
import { FormWrapper } from './Wrapper/FormWrapper';
import { DateRangePicker } from './Inputs/DatePicker';
import { TextAreaInput } from './Inputs/TextAreaInput';
import { TitleInput } from './Inputs/TitleInput';
import { FormActions } from './Cards/FormActions';
import { DeleteConfirmDialog } from '../shared/DeleteConfirmDialog';
import { RelatedGoalSelection } from './Selectors/RelatedGoalSelection';
import { FrequencyInput } from './Inputs/FrequencyInput';
import { WeeklyDaySelector } from './Selectors/WeeklyDaySelector';
import { ReminderTimeInput } from './Inputs/ReminderTimes';
import { CheckboxCard } from './Cards/CheckedBoxCard';

type HabitFormData = z.infer<typeof habitSchema>;

interface HabitsFormProps {
    isOpen: boolean;
    setIsOpen: () => void;
    editingHabit?: HabitType | null;
    editingGoalHabit?: HabitFormData | null;
    userId: string;
    fromGoal?: boolean;
    setGoalHabits?: (habitData: any) => void;
    goalTitle?: string
}

const HabitsForm: React.FC<HabitsFormProps> = ({
    isOpen,
    setIsOpen,
    editingHabit = null,
    editingGoalHabit = null,
    userId,
    fromGoal = false,
    setGoalHabits,
    goalTitle
}) => {
    const { mutateAsync: addHabit } = useAddHabit(userId);
    const { mutateAsync: updateHabit } = useUpdateHabit(userId);
    const { mutate: deleteHabit } = useDeleteHabit(userId);

    const [timeInput, setTimeInput] = useState('');
    const [timesList, setTimesList] = useState<string[]>(editingHabit?.reminderTimes || []);
    const [selectedContacts, setSelectedContacts] = useState<string[]>(editingHabit?.sharedWith || []);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


    const isEditing = Boolean(editingHabit);

    const {
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        setValue,
        reset,
        watch,
        control
    } = useForm<HabitFormData>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            title: editingGoalHabit?.title || editingHabit?.title || '',
            goal: editingGoalHabit?.goal || editingHabit?.goal || null,
            frequencyPerDay: editingGoalHabit?.frequencyPerDay || editingHabit?.frequencyPerDay || 1,
            customMessage: editingGoalHabit?.customMessage || editingHabit?.customMessage || '',
            allowSkip: editingGoalHabit?.allowSkip || editingHabit?.allowSkip || false,
            category: editingGoalHabit?.category || editingHabit?.category || '',
            startDate: editingGoalHabit?.startDate || editingHabit?.startDate || formatDateForQuery(new Date()),
            endDate: editingGoalHabit?.endDate || editingHabit?.endDate || '',
            visibility: editingGoalHabit?.visibility || editingHabit?.visibility || 'private',
            sharedWith: editingGoalHabit?.sharedWith || editingHabit?.sharedWith || [],
            weeklyFrequency: editingGoalHabit?.weeklyFrequency || editingHabit?.weeklyFrequency || 7,
            selectedDays: editingGoalHabit?.selectedDays || editingHabit?.selectedDays || []
        }
    });

    const watchedValues = watch();
    const { frequencyPerDay, visibility, weeklyFrequency, selectedDays, goal: selectedGoal } = watchedValues;

    // Validation for selected days
    const isDaySelectionValid = useMemo(() => {
        if (weeklyFrequency === 7) return true;
        return selectedDays.length === weeklyFrequency;
    }, [weeklyFrequency, selectedDays]);

    useEffect(() => {
        if (isOpen && editingHabit) {
            reset({
                title: editingHabit.title || '',
                goal: editingHabit.goal || null,
                frequencyPerDay: editingHabit.frequencyPerDay || 1,
                customMessage: editingHabit.customMessage || '',
                allowSkip: editingHabit.allowSkip || false,
                category: editingHabit.category || '',
                startDate: editingHabit.startDate || formatDateForQuery(new Date()),
                endDate: editingHabit.endDate || '',
                visibility: editingHabit.visibility || 'private',
                sharedWith: editingHabit.sharedWith || [],
                weeklyFrequency: editingHabit.weeklyFrequency || 7,
                selectedDays: editingHabit.selectedDays || [],
            });

            setTimesList(editingHabit.reminderTimes || []);
            setSelectedContacts(editingHabit.sharedWith || []);
        }
    }, [editingHabit, isOpen, reset]);

    const onSubmit = async (data: HabitFormData) => {

        if (!isDaySelectionValid) {
            toast.error(`Please select exactly ${weeklyFrequency} days for your habit.`);
            return;
        }

        try {
            const habitData = {
                ...data,
                reminderTimes: timesList,
                customMessage: data.customMessage || '',
                startDate: data.startDate ? formatDateForQuery(new Date(data.startDate)) : formatDateForQuery(new Date()),
                endDate: data.endDate ? formatDateForQuery(new Date(data.endDate)) : null,
                sharedWith: selectedContacts
            };

            if (fromGoal && setGoalHabits) {
                setGoalHabits(habitData);
                handleClose();
                toast.success("Habit will be created with goal!");
                return;
            }

            if (isEditing) {
                await updateHabit({ habitId: editingHabit!.id, updates: habitData });
                toast.success("Habit updated successfully!");
            } else {
                await addHabit(habitData);
                toast.success("Habit created successfully!");
            }

            handleClose();
        } catch (error) {
            console.error('Error saving habit:', error);
            toast.error(isEditing ? "Error updating habit. Please try again." : "Error creating habit. Please try again.");
        }
    };

    const handleClose = () => {
        reset();
        setTimesList([]);
        setSelectedContacts([]);
        setShowDeleteConfirm(false);
        setIsOpen();
    };

    const handleContactChange = (contact: string, checked: boolean) => {
        const newContacts = checked
            ? [...selectedContacts, contact]
            : selectedContacts.filter(c => c !== contact);

        setSelectedContacts(newContacts);
        setValue("sharedWith", newContacts, { shouldDirty: true });
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (editingHabit) {
            deleteHabit(editingHabit.id);
            toast.success("Habit deleted successfully.");
            handleClose();
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="min-w-4/5 lg:min-w-2/3 max-h-[90vh] overflow-y-auto">
                <FormWrapper
                    variant="dialog"
                    title={isEditing ? 'Edit Habit' : 'Create New Habit'}
                    icon={Target}
                    description={isEditing
                        ? 'Update your habit details to better align with your goals.'
                        : 'Build a new habit that will help you achieve your goals. Start small and be consistent.'
                    }
                >
                    <form
                        className="space-y-8 py-6" onSubmit={(e) => {
                            if (fromGoal) {
                                e.stopPropagation();
                            }
                            handleSubmit(onSubmit)(e);
                        }}>
                        {/* Basic Information */}
                        <FormWrapper title='Basic Information' icon={Sparkles} variant="element">
                            {/* Habit Title */}
                            <div className='flex flex-wrap gap-4'>
                                <div className='flex-2'>
                                    <TitleInput<HabitFormData>
                                        control={control}
                                        errors={errors}
                                        name="title"
                                        label="Habit Title"
                                        placeholder="e.g., Drink 2L water, Meditate 10 mins, Read 10 pages"
                                    />
                                </div>

                                {/* Category */}
                                <CategorySelection<HabitFormData>
                                    control={control}
                                    controlName="category"
                                    errors={errors}
                                />
                            </div>

                            {/* Link to Goal */}
                            <RelatedGoalSelection<HabitFormData>
                                control={control}
                                setValue={setValue}
                                name="goal"
                                userId={userId}
                                goalTitle={goalTitle}
                                disabled={fromGoal}
                            />

                        </FormWrapper>

                        {/* Frequency Settings */}
                        <FormWrapper title='Frequency Settings' icon={Calendar} variant="element">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FrequencyInput<HabitFormData>
                                    control={control}
                                    errors={errors}
                                    name="frequencyPerDay"
                                    label="Times per Day"
                                    max={20}
                                    helperText="How many times per day?"
                                />

                                <FrequencyInput<HabitFormData>
                                    control={control}
                                    errors={errors}
                                    name="weeklyFrequency"
                                    label="Days per Week"
                                    min={1}
                                    max={7}
                                    helperText="How many days a week?"
                                />
                            </div>

                            {/* Day Selection */}
                            {weeklyFrequency < 7 && (
                                <WeeklyDaySelector<HabitFormData>
                                    selectedDays={selectedDays}
                                    weeklyFrequency={weeklyFrequency}
                                    setValue={setValue}
                                    name="selectedDays"
                                />
                            )}
                        </FormWrapper>

                        {/* Schedule & Reminders */}
                        <FormWrapper title='Schedule & Reminders' icon={Clock} variant="element">
                            {/* Dates */}
                            <DateRangePicker<HabitFormData>
                                control={control}
                                errors={errors}
                                startName='startDate'
                                endName='endDate'
                                type="habit"
                            />

                            {/* Reminder Times */}
                            <ReminderTimeInput
                                timeInput={timeInput}
                                setTimeInput={setTimeInput}
                                timesList={timesList}
                                setTimesList={setTimesList}
                                frequencyPerDay={frequencyPerDay}
                            />
                        </FormWrapper>

                        {/* Motivation & Settings */}
                        <FormWrapper title='Motivation & Settings' icon={WandSparkles} variant="element">
                            <TextAreaInput<HabitFormData>
                                control={control}
                                errors={errors}
                                name="customMessage"
                                setValue={setValue}
                            />

                            {/* Allow Skip Option */}
                            <CheckboxCard<HabitFormData>
                                label="Allow skipping this habit"
                                description="Enable this if it's okay to skip this habit occasionally without breaking your streak"
                                name="allowSkip"
                                value={watch("allowSkip")}
                                setValue={setValue}
                            />
                        </FormWrapper>

                        {/* Privacy & Sharing */}
                        <PrivacyCard<HabitFormData>
                            userId={userId}
                            control={control}
                            visibility={visibility}
                            visibilityName='visibility'
                            selectedContacts={selectedContacts}
                            handleContactChange={handleContactChange}
                        />

                        <FormActions
                            isSubmitting={isSubmitting}
                            submitLabel="Save Habit"
                            onCancel={() => setIsOpen}
                            onDelete={handleDelete}
                            showDelete={!!editingHabit && !fromGoal}
                        />

                        {!fromGoal && (
                            <DeleteConfirmDialog
                                open={showDeleteConfirm}
                                onClose={cancelDelete}
                                onConfirm={confirmDelete}
                                title="Delete this habit?"
                                description="This will permanently remove your habit from the system."
                            />
                        )}

                    </form>
                </FormWrapper>
            </DialogContent>
        </Dialog>
    );
};

export default HabitsForm;