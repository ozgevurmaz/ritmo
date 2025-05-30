"use client"

import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Target, Eye, EyeOff } from 'lucide-react';
import { goalSchema } from '@/lib/zod/client/goal';
import { categories, contacts } from '@/lib/constants';
import { toast } from 'sonner';
import { useAddGoal } from '@/lib/Mutations/goals/useAddGoal';
import { useHabits } from '@/lib/Queries/useHabit';
import { useUpdateGoal } from '@/lib/Mutations/goals/useUpdateGoal';
import { useUpdateHabit } from '@/lib/Mutations/habits/useUpdateHabit';
import { useDeleteGoal } from '@/lib/Mutations/goals/useDeleteGoal';

type GoalFormData = z.infer<typeof goalSchema>;

const GoalForm = (
  { isOpen,
    setIsOpen,
    userId,
    editingGoal = null
  }:
    {
      isOpen: boolean,
      setIsOpen: () => void,
      userId: string,
      editingGoal?: GoalType | null
    }) => {

  const { mutateAsync: addGoal } = useAddGoal(userId)
  const { mutateAsync: updateGoal } = useUpdateGoal(userId)
  const { mutateAsync: updateHabit } = useUpdateHabit(userId)
  const { mutate: deleteGoal } = useDeleteGoal(userId)
  const { data: habits, isLoading: habitsLoading } = useHabits(userId)


  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: editingGoal?.title || "",
      description: editingGoal?.description || "",
      motivation: editingGoal?.motivation || "",
      habits: editingGoal?.habits || [],
      startDate: editingGoal?.startDate || "",
      endDate: editingGoal?.endDate || "",
      sharedWith: editingGoal?.sharedWith || [],
      visibility: editingGoal?.visibility || "private",
      category: editingGoal?.category || ""
    }
  });

  const visibility = watch("visibility");

  const handleHabitChange = (habit: string, checked: boolean) => {
    let newHabits: string[];
    if (checked) {
      newHabits = [...selectedHabits, habit];
    } else {
      newHabits = selectedHabits.filter(h => h !== habit);
    }
    setSelectedHabits(newHabits);
    setValue("habits", newHabits);
  };

  const handleContactChange = (contact: string, checked: boolean) => {
    let newContacts: string[];
    if (checked) {
      newContacts = [...selectedContacts, contact];
    } else {
      newContacts = selectedContacts.filter(c => c !== contact);
    }
    setSelectedContacts(newContacts);
    setValue("sharedWith", newContacts);
  };

  const onSubmit: SubmitHandler<GoalFormData> = async (data) => {
    try {
      if (editingGoal) {
        console.log("Sending goal:", data);

        updateGoal({ ...editingGoal, ...data })

        toast.success("Goal edited successfully.")
      } else {
        console.log("Sending goal:", data);

        addGoal({ ...data })
        const inserted = await addGoal({ ...data });

        const newGoalId = inserted?.[0]?.id;
        if (!newGoalId) throw new Error("Goal ID not returned");

        await Promise.all(
          data.habits.map((habitId) =>
            updateHabit({ habitId, updates: { goal: newGoalId } })
          )
        );

        toast.success("Goal added successfully.")
      }

      reset();
      setSelectedHabits([]);
      setSelectedContacts([]);
      setIsOpen();
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Error creating goal. Please try again.");
    }
  };


  const resetForm = () => {
    reset();
    setSelectedHabits([]);
    setSelectedContacts([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Create Your Goal
          </DialogTitle>
          <DialogDescription>
            Set up your goal with specific habits and track your progress over time.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6 py-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Goal Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., Get Healthier This Year"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-destructivetext-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe what you want to achieve and why it's important to you..."
                rows={3}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="motivation">What motivates you?</Label>
              <Textarea
                id="motivation"
                {...register("motivation")}
                placeholder="What drives you to achieve this goal? How will you feel when you accomplish it?"
                rows={2}
                className={errors.motivation ? "border-destructive" : ""}
              />
              {errors.motivation && (
                <p className="text-destructive text-sm mt-1">{errors.motivation.message}</p>
              )}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <Label>Category *</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-destructive text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
                className={errors.startDate ? "border-destructive" : ""}
              />
              {errors.startDate && (
                <p className="text-destructive text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
                className={errors.endDate ? "border-destructive" : ""}
              />
              {errors.endDate && (
                <p className="text-destructive text-sm mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Habits Selection */}
          <div>
            <Label>Daily Habits *</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Choose habits that will help you achieve your goal
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-input shadow-xs rounded-md p-3">
              {habitsLoading && <div>Loading..</div>}
              {habits?.map((habit) => (
                <div key={habit.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={habit.id}
                    checked={selectedHabits.includes(habit.id)}
                    onCheckedChange={(checked) => handleHabitChange(habit.id, checked as boolean)}
                    className='border-foreground'
                  />
                  <Label htmlFor={habit.id} className="text-sm font-normal cursor-pointer">
                    {habit.title}
                  </Label>
                </div>
              ))}
            </div>
            {errors.habits && (
              <p className="text-destructive text-sm mt-1">{errors.habits.message}</p>
            )}
          </div>

          {/* Visibility Settings */}
          <div>
            <Label>Visibility</Label>
            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" className='border-foreground/70' />
                    <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                      <EyeOff className="h-4 w-4" />
                      Private - Only I can see this goal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" className='border-foreground/70' />
                    <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                      <Eye className="h-4 w-4" />
                      Public - Others can view my progress
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* Share With Contacts */}
          {visibility === "public" && (
            <div>
              <Label>Share with specific people</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Choose people who can view and encourage your progress
              </p>
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
                {contacts.map((contact) => (
                  <div key={contact} className="flex items-center space-x-2">
                    <Checkbox
                      id={contact}
                      checked={selectedContacts.includes(contact)}
                      onCheckedChange={(checked) => handleContactChange(contact, checked as boolean)}
                      className='border-foreground'
                    />
                    <Label htmlFor={contact} className="text-sm font-normal cursor-pointer">
                      {contact}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            {
              editingGoal &&
              <Button
                type="button"
                variant="destructive"
                onClick={() => deleteGoal(editingGoal.id)}
                disabled={isSubmitting}
              >
                Delete
              </Button>
            }
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalForm;