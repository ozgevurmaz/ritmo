"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Target,
  Flag,
} from 'lucide-react';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';
import { useAddGoal } from '@/lib/Mutations/goals/useAddGoal'
import { useHabits } from '@/lib/Queries/habits/useHabit';
import { useDeleteGoal } from '@/lib/Mutations/goals/useDeleteGoal';
import { useUpdateGoal } from '@/lib/Mutations/goals/useUpdateGoal';
import { goalSchema } from '@/lib/zod/client/goal';
import { FormWrapper } from './Wrapper/FormWrapper';
import { TitleInput } from './Inputs/TitleInput';
import { TextAreaInput } from './Inputs/TextAreaInput';
import { CategorySelection } from './Selectors/CategorySelection';
import { DateRangePicker } from './Inputs/DatePicker';
import { HabitManagment } from './Cards/HabitManagment';
import { PrivacyCard } from './Cards/PrivacyCard';
import { FormActions } from './Cards/FormActions';
import { DeleteConfirmDialog } from '../shared/DeleteConfirmDialog';
import { useTranslations } from 'next-intl';
import { formatDateForQuery } from '@/lib/utils/date/formatDate';
import { HabitData } from './quickHabitForm';

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalFormProps {
  editingGoal?: GoalType | null;
  userId: string;
}

const GoalForm: React.FC<GoalFormProps> = ({
  editingGoal = null,
  userId,
}) => {
  const t = useTranslations();
  const router = useRouter();

  const { data: allHabits } = useHabits(userId)
  const { mutateAsync: updateGoal } = useUpdateGoal(userId)
  const { mutateAsync: deleteGoal } = useDeleteGoal(userId)
  const { mutateAsync: addGoal } = useAddGoal(userId)

  const [selectedContacts, setSelectedContacts] = useState<string[]>(editingGoal?.sharedWith || []);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = Boolean(editingGoal);

  const getDefaultValues = (): GoalFormData => ({
    title: editingGoal?.title || '',
    description: editingGoal?.description || '',
    motivation: editingGoal?.motivation || '',
    habits: editingGoal?.habits || [],
    startDate: editingGoal?.startDate || formatDateForQuery(new Date()),
    endDate: editingGoal?.endDate || '',
    sharedWith: editingGoal?.sharedWith || [],
    visibility: editingGoal?.visibility || 'private',
    category: editingGoal?.category || ''
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
    control,
    getValues
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: getDefaultValues()
  });

  const watchedValues = watch();
  const { visibility, sharedWith, category, startDate, endDate, motivation, title: GoalTitle } = watchedValues;

  const [addedHabits, setAddedHabits] = useState<HabitData[]>([])

  const [selectedHabits, setSelectedHabits] = useState<HabitType[]>([]);

  useEffect(() => {
    if (editingGoal?.habits && allHabits && allHabits.length > 0) {
      const foundHabits = allHabits.filter(h =>
        editingGoal.habits.includes(h.id)
      );
      setSelectedHabits(foundHabits);
    }
  }, [editingGoal?.habits, allHabits]);

  const enableAddHabit = useMemo(() => {
    return !!(endDate && startDate && GoalTitle && category);
  }, [endDate, startDate, GoalTitle, category]);

  const handleNewHabitSave = (habitData: HabitData) => {
    setAddedHabits(prev => [...prev, habitData]);
    toast.success(t("forms.habit.toasts.create-success"));
  };

  const handleSelectExistingHabit = (habitData: HabitType) => {
    setSelectedHabits((prev) => [...prev, habitData])
  }

  const handleRemoveNewHabit = (habitTitle: string) => {
    setAddedHabits(prev => prev.filter(h => h.title !== habitTitle));
  };

  const handleRemoveExistingHabit = (habitId: string) => {
    setSelectedHabits((prev) => prev.filter(h => h.id !== habitId))
  }

  const onSubmit = async (data: GoalFormData) => {
    try {
      //New Habit
      const goalPayload = {
        ...data,
        habits: [],
      };

      //  New Habits
      const newQuickHabits = addedHabits.map(habit => ({
        ...habit,
        startDate,
        endDate,
        goal: null,
      }));

      // Selected Habits
      const updatedExistingHabits = selectedHabits.map(habit => ({
        id: habit.id,
        updates: {
          goal: null,
          endDate,
        },
      }));

      if (editingGoal) {
        setValue("category", editingGoal.category)
        const updatedGoal = {
          ...editingGoal,
          ...data,
        };

        await updateGoal({
          updatedGoal,
          currentLinkedHabits: selectedHabits,
          newaddedHabits: addedHabits,
        });

        toast.success(t("forms.goal.toasts.update-success"));
      } else {
        await addGoal({
          goalData: goalPayload,
          newHabits: newQuickHabits,
          linkedHabits: updatedExistingHabits,
        });
        toast.success(t("forms.goal.toasts.create-success"));
      }

      handleClose();
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : t("forms.goal.toasts.create-error");
      toast.error(errorMessage);
      console.error('Goal save error:', err);
    }

    router.push("/dashboard/goals")
  };

  const handleContactChange = (contact: string, checked: boolean) => {
    const newContacts = checked
      ? [...selectedContacts, contact]
      : selectedContacts.filter(c => c !== contact);

    setSelectedContacts(newContacts);
    setValue("sharedWith", newContacts, { shouldDirty: true });
  };

  const handleClose = () => {
    reset(getDefaultValues());
    setSelectedContacts([]);
    setSelectedHabits([]);
    setAddedHabits([]);
    setShowDeleteConfirm(false);
  };

  const handleDeleteGoal = useCallback(async () => {
    if (!editingGoal) return;

    try {
      await deleteGoal(editingGoal.id);
      toast.success(t("forms.goal.toasts.delete-success"));
      handleClose();
      router.push("/dashboard/goals");
    } catch (err) {
      toast.error(t("forms.goal.toasts.delete-error"));
      console.error('Delete error:', err);
    }
  }, [editingGoal, deleteGoal, handleClose, router]);

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="w-full overflow-y-auto">
      <FormWrapper
        icon={Target}
        title={isEditing ? t("forms.goal.edit-title") : t("forms.goal.create-title")}
        description={isEditing
          ? t("forms.goal.edit-description")
          : t("forms.goal.create-description")
        }
        variant='page'
        textColor='text-goals'
      >

        <form className="space-y-8 py-6 w-full" onSubmit={handleSubmit(onSubmit)}>
          {/* Goal Information */}
          <FormWrapper
            variant='element'
            title={t("forms.goal.goal-info")}
            icon={Flag}
          >

            {/* Title */}
            <TitleInput<GoalFormData>
              control={control}
              errors={errors}
              name="title"
              label={t("forms.goal.title.label")}
              placeholder={t("forms.goal.title.placeholder")}
            />

            {/* Description */}

            <TextAreaInput<GoalFormData>
              control={control}
              errors={errors}
              name="description"
              setValue={setValue}
              showPredefinedMessages={false}
              label={t("forms.description.label")}
              placeholder={t("forms.description.placeholder")}
            />

            {/* Motivation */}
            <TextAreaInput<GoalFormData>
              control={control}
              errors={errors}
              name="motivation"
              setValue={setValue}
            />

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* Category */}
              <CategorySelection<GoalFormData>
                control={control}
                controlName="category"
                errors={errors}
                disabled={isEditing}
              />
              <div className='col-span-2'>
                {/*Dates */}
                <DateRangePicker<GoalFormData>
                  control={control}
                  errors={errors}
                  startMinDate="2025-01-01"
                  startName='startDate'
                  endName='endDate' />
              </div>
            </div>
          </FormWrapper>

          {/* Habit Management */}
          <HabitManagment
            userId={userId}
            addedHabits={addedHabits}
            selectedHabits={selectedHabits}
            handleNewHabitSave={handleNewHabitSave}
            handleSelectExistingHabit={handleSelectExistingHabit}
            handleRemoveNewHabit={handleRemoveNewHabit}
            handleRemoveExistingHabit={handleRemoveExistingHabit}
            enableAddHabit={enableAddHabit}
          />

          {/* Privacy & Sharing */}
          <PrivacyCard<GoalFormData>
            userId={userId}
            control={control}
            visibility={visibility}
            visibilityName='visibility'
            selectedContacts={selectedContacts}
            handleContactChange={handleContactChange}
          />

          <FormActions
            isSubmitting={isSubmitting}
            submitLabel={t("forms.goal.actions.save")}
            editLabel={t("forms.goal.actions.edit")}
            isEdit={isEditing}
            cancelHref="/goals"
            onDelete={handleDeleteGoal}
            showDelete={!!editingGoal}
          />

          <DeleteConfirmDialog
            open={showDeleteConfirm}
            onClose={cancelDelete}
            onConfirm={handleDeleteGoal}
            title={t("forms.goal.delete-confirm.title")}
            description={t("forms.goal.delete-confirm.description")}
          />

        </form>
      </FormWrapper>
    </div>
  );
};

export default GoalForm;