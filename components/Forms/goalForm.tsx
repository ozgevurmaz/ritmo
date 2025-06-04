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
import { formatDateForQuery } from '@/lib/utils';
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

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalFormProps {
  editingGoal?: GoalType | null;
  userId: string;
}

const DEFAULT_HABIT_BASE: Omit<HabitFormValues, 'id' | 'startDate' | 'endDate' | 'customMessage' | 'category' | 'visibility' | 'sharedWith'> = {
  title: '',
  goal: null,
  frequencyPerDay: 1,
  reminderTimes: [],
  allowSkip: false,
  weeklyFrequency: 7,
  selectedDays: []
};

const GoalForm: React.FC<GoalFormProps> = ({
  editingGoal = null,
  userId,
}) => {
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
    control
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: getDefaultValues()
  });

  const watchedValues = watch();
  const { visibility, sharedWith, category, startDate, endDate, motivation, title: GoalTitle } = watchedValues;

  const [addedHabits, setAddedHabits] = useState<HabitFormValues[]>([])

  const defaultHabit = useMemo(() => ({
    ...DEFAULT_HABIT_BASE,
    id: addedHabits.length.toString(),
    customMessage: motivation || "",
    category: category || '',
    startDate: startDate || formatDateForQuery(new Date()),
    endDate: endDate || '',
    visibility: visibility || 'private',
    sharedWith: sharedWith || [],
  }), [addedHabits.length, motivation, category, startDate, endDate, visibility, sharedWith]);

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

  const editingHabit = useMemo(() => ({
    ...defaultHabit,
    startDate: startDate || formatDateForQuery(new Date()),
    endDate: endDate || '',
    visibility: visibility || 'private',
    sharedWith: sharedWith || [],
    category: category || '',
    customMessage: motivation || ""
  }), [startDate, endDate, visibility, sharedWith, category, motivation]);

  const handleNewHabitSave = (habitData: HabitFormValues) => {
    setAddedHabits(prev => [...prev, habitData]);
    toast.success("Quick habit added!");
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
        const updatedGoal = {
          ...editingGoal,
          ...data,
        };

        await updateGoal({
          updatedGoal,
          currentLinkedHabits: selectedHabits,
          newaddedHabits: addedHabits,
        });

        toast.success("Goal updated successfully!");
      } else {
        await addGoal({
          goalData: goalPayload,
          newHabits: newQuickHabits,
          linkedHabits: updatedExistingHabits,
        });
      }

      toast.success("Goal and habits created successfully!");
      handleClose();
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : "An error occurred while saving the goal.";
      toast.error(errorMessage);
      console.error('Goal save error:', err);
    }

    router.push("/goals")
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
      toast.success("Goal deleted successfully.");
      handleClose();
      router.push("/goals");
    } catch (err) {
      toast.error("Failed to delete goal.");
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
          title={isEditing ? 'Edit Goal' : 'Create New Goal'}
          description={isEditing
            ? 'Update your goal and manage associated habits.'
            : 'Set a meaningful goal and create or link habits that will help you achieve it.'
          }
          variant='page'
          textColor='text-goals'
        >

          <form className="space-y-8 py-6 w-full" onSubmit={handleSubmit(onSubmit)}>
            {/* Goal Information */}
            <FormWrapper
              variant='element'
              title=" Goal Information"
              icon={Flag}    
              >

              {/* Title */}
              <TitleInput<GoalFormData>
                control={control}
                errors={errors}
                name="title"
                label="Goal Title"
                placeholder="e.g., Run a marathon, Build a portfolio, Learn Spanish"
              />

              {/* Description */}

              <TextAreaInput<GoalFormData>
                control={control}
                errors={errors}
                name="description"
                setValue={setValue}
                showPredefinedMessages={false}
                label="Description"
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
              goalTitle={GoalTitle}
              enableAddHabit={enableAddHabit}
              defaultGoalHabit={editingHabit}
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
              submitLabel="Create Goal"
              editLabel="Edit Goal"
              isEdit={isEditing}
              cancelHref="/goals"
              onDelete={handleDeleteGoal}
              showDelete={!!editingGoal}
            />

            <DeleteConfirmDialog
              open={showDeleteConfirm}
              onClose={cancelDelete}
              onConfirm={handleDeleteGoal}
              title="Delete this goal?"
              description="This will permanently remove your goal from the system."
            />

          </form>
        </FormWrapper>
      </div>
  );
};

export default GoalForm;