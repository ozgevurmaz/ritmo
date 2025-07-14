"use client"

import React, { useState } from 'react'
import * as z from 'zod';
import { habitSchema } from '@/lib/zod/client/goal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TitleInput } from './Inputs/TitleInput';
import { CheckboxCard } from './Cards/CheckedBoxCard';
import { FrequencyInput } from './Inputs/FrequencyInput';
import { ReminderTimeInput } from './Inputs/ReminderTimes';
import { WeeklyDaySelector } from './Selectors/WeeklyDaySelector';
import { useTranslations } from 'next-intl';

export type HabitData = z.infer<typeof habitSchema>;

const QuickHabitForm = ({ editingHabit = null, setIsOpen, addHabit }: { editingHabit?: HabitData | null, setIsOpen: () => void, addHabit: (habit: HabitData) => void; }) => {

    const t = useTranslations()
    const {
        formState: { errors },
        setValue,
        reset,
        watch,
        control,
        getValues,
    } = useForm<HabitData>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            title: editingHabit?.title || '',
            frequencyPerDay: editingHabit?.frequencyPerDay || 1,
            allowSkip: editingHabit?.allowSkip || false,
            weeklyFrequency: editingHabit?.weeklyFrequency || 7,
            selectedDays: editingHabit?.selectedDays || [],
            reminderTimes: []
        }
    });

    const watchedValues = watch();
    const { frequencyPerDay, weeklyFrequency, selectedDays, } = watchedValues;
    const [timeInput, setTimeInput] = useState('');
    const [timesList, setTimesList] = useState<string[]>(editingHabit?.reminderTimes || []);

    const handleCancel = () => {
        reset();
        setIsOpen();
    }

    const handleAdd = () => {
        setValue("reminderTimes", timesList);
        const values = getValues()
        addHabit(values);
        handleCancel();
    }
    return (
        <div className='p-2 space-y-3'>
            <h3 className='text-xl font-semibold'>{t("forms.goal.habit-management.link-habit-title")}</h3>
            <TitleInput<HabitData>
                control={control}
                errors={errors}
                name="title"
                label={t("forms.habit.fields.title.label")}
                placeholder={t("forms.habit.fields.title.placeholder")}
            />
            <div className='grid grid-cols-3 gap-2'>
                <FrequencyInput<HabitData>
                    control={control}
                    errors={errors}
                    name="frequencyPerDay"
                    label={t("forms.habit.fields.times-per-day.label")}
                    max={20}
                    helperText={t("forms.habit.fields.times-per-day.helper")}
                />
                <span>
                    <FrequencyInput<HabitData>
                        control={control}
                        errors={errors}
                        name="weeklyFrequency"
                        label={t("forms.habit.fields.days-per-week.label")}
                        min={1}
                        max={7}
                        helperText={t("forms.habit.fields.days-per-week.helper")}
                    />

                    {weeklyFrequency < 7 && (
                        <WeeklyDaySelector<HabitData>
                            selectedDays={selectedDays}
                            weeklyFrequency={weeklyFrequency}
                            setValue={setValue}
                            name="selectedDays"
                        />
                    )}
                </span>
                <ReminderTimeInput
                    timeInput={timeInput}
                    setTimeInput={setTimeInput}
                    timesList={timesList}
                    setTimesList={setTimesList}
                    frequencyPerDay={frequencyPerDay}
                />
            </div>
            <CheckboxCard<HabitData>
                label={t("forms.habit.fields.allow-skip.label")}
                description={t("forms.habit.fields.allow-skip.description")}
                name="allowSkip"
                value={watch("allowSkip")}
                setValue={setValue}
            />
            <div className='space-x-2'>
                <Button type="button" variant="outline" onClick={handleCancel}>{t("buttons.cancel")}</Button>
                <Button type="button" variant="secondary" onClick={handleAdd}>{t("buttons.add-button")}</Button>
            </div>
        </div>
    )
}

export default QuickHabitForm