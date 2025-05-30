"use client"

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, Plus, X, Clock, Link, EyeOff, Eye } from 'lucide-react';
import { habitSchema } from '@/lib/zod/client/habit';
import { categories, contacts, GOALS } from '@/lib/constants';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAddHabit } from '@/lib/Mutations/habits/useAddHabit';
import { useDeleteHabit } from '@/lib/Mutations/habits/useDeleteHabit';

type HabitFormData = z.infer<typeof habitSchema>;

const HabitsForm = ({
    isOpen,
    setIsOpen,
    editingHabit = null,
    userId
}: {
    isOpen: boolean,
    setIsOpen: () => void,
    editingHabit?: HabitType | null,
    userId: string
}) => {
    const { mutateAsync: addHabit } = useAddHabit(userId)
    const { mutate: deleteHabit } = useDeleteHabit(userId)

    const [timeInput, setTimeInput] = useState('');
    const [timesList, setTimesList] = useState<string[]>(editingHabit?.reminderTimes || []);

    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
        watch,
        control
    } = useForm<HabitFormData>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            title: editingHabit?.title || '',
            goal: editingHabit?.goal || null,
            frequencyPerDay: editingHabit?.frequencyPerDay || 1,
            customMessage: editingHabit?.customMessage || '',
            allowSkip: editingHabit?.allowSkip || false,
            category: editingHabit?.category || '',
            endDate: editingHabit?.endDate || '',
            visibility: editingHabit?.visibility || 'private',
            sharedWith: editingHabit?.sharedWith || []
        }
    });

    const selectedGoal = watch('goal');
    const frequencyPerDay = watch('frequencyPerDay');
    const visibility = watch('visibility')

    const onSubmit = async (data: HabitFormData) => {
        try {
            if (editingHabit) {

                addHabit({
                    ...data,
                    reminderTimes: timesList,
                    completedToday: 0,
                    streak: 0,
                    customMessage: data.customMessage || '',
                    endDate: data.endDate ? new Date(data.endDate).toISOString() : null
                })
                toast.success("Habit edited successfully.")

            } else {
                addHabit({
                    ...data,
                    reminderTimes: timesList,
                    completedToday: 0,
                    streak: 0,
                    customMessage: data.customMessage || '',
                    endDate: data.endDate ? new Date(data.endDate).toString() : null
                })
                toast.success("Habit added successfully.")
            }

            // Reset form
            reset();
            setTimesList([]);
            setIsOpen();
        } catch (error) {
            console.error('Error creating habit:', error);
            toast.error("Error creating habit. Please try again.")
        }
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

    const addTime = () => {
        if (timeInput && !timesList.includes(timeInput)) {
            if (timesList.length < frequencyPerDay) {
                setTimesList(prev => [...prev, timeInput]);
                setTimeInput('');
            }
        }
    };

    const removeTime = (timeToRemove: string) => {
        setTimesList(prev => prev.filter(time => time !== timeToRemove));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTime();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Create New Habit
                    </DialogTitle>
                    <DialogDescription>
                        Build a new habit that will help you achieve your goals. Start small and be consistent.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-6 py-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Habit Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Habit Title *
                        </Label>
                        <Input
                            id="title"
                            {...register('title')}
                            placeholder="e.g., Morning Exercise, Read for 30 minutes, Meditate"
                            className={errors.title ? 'border-destructive' : ''}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Link to Goal */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Link to Goal (Optional)</Label>
                        <Select onValueChange={(value) => setValue('goal', value === 'none' ? null : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a goal to link this habit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Goal</SelectItem>
                                {GOALS.map(goal => (
                                    <SelectItem key={goal.id} value={goal.id}>
                                        <div className="flex items-center gap-2">
                                            <span>{goal.title}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {goal.category}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedGoal && selectedGoal !== 'none' && (
                            <div className="p-3 bg-success/20 rounded-lg border border-success">
                                <p className="text-sm text-success flex gap-1">
                                    <Link className='w-4 h-4' /> Linked to: <strong>{GOALS.find(g => g.id === selectedGoal)?.title}</strong>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Frequency and Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="frequency" className="text-sm font-medium">
                                Frequency per Day *
                            </Label>
                            <Input
                                id="frequency"
                                type="number"
                                min="1"
                                max="20"
                                {...register('frequencyPerDay', { valueAsNumber: true })}
                                className={errors.frequencyPerDay ? 'border-destructive' : ''}
                            />
                            {errors.frequencyPerDay && (
                                <p className="text-xs text-destructive">{errors.frequencyPerDay.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">How many times per day?</p>
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
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-sm font-medium flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            End Date
                        </Label>
                        <Input
                            id="endDate"
                            type="date"
                            {...register('endDate')}
                            className={errors.endDate ? 'border-destructive' : ''}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.endDate && (
                            <p className="text-xs text-destructive">{errors.endDate.message}</p>
                        )}
                        <p className="text-xs text-muted">Set a target end date for this habit</p>
                    </div>

                    {/* Reminder Times */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Reminder Times (Optional)
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                type="time"
                                value={timeInput}
                                onChange={(e) => setTimeInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Set reminder time"
                                disabled={timesList.length >= frequencyPerDay}
                            />
                            <Button
                                type="button"
                                onClick={addTime}
                                size="sm"
                                variant="outline"
                                disabled={!timeInput || timesList.length >= frequencyPerDay}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {timesList.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {timesList.map(time => (
                                    <Badge key={time} variant="outline" className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {time}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                                            onClick={() => removeTime(time)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <p className="text-xs text-muted">
                            {timesList.length}/{frequencyPerDay} reminder times set
                        </p>
                    </div>

                    {/* Custom Message */}
                    <div className="space-y-2">
                        <Label htmlFor="customMessage" className="text-sm font-medium">
                            Custom Motivation Message (Optional)
                        </Label>
                        <input
                            id="customMessage"
                            {...register('customMessage')}
                            placeholder="e.g., 'Every step counts!', 'You're building a better you!', 'Consistency is key!'"
                            className={errors.customMessage ? 'border-destructive' : ''}
                        />
                        {errors.customMessage && (
                            <p className="text-xs text-destructive">{errors.customMessage.message}</p>
                        )}
                        <p className="text-xs text-muted">A personal message to motivate you</p>
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

                    {/* Allow Skip Option */}
                    <div className="flex items-center space-x-2 p-3 rounded-lg">
                        <Checkbox
                            id="allowSkip"
                            onCheckedChange={(checked) => setValue('allowSkip', !!checked)}
                            className='border-foreground'
                        />
                        <div className="flex-1">
                            <Label htmlFor="allowSkip" className="text-sm font-medium cursor-pointer">
                                Allow skipping this habit
                            </Label>
                            <p className="text-xs text-gray-500">
                                Enable this if it's okay to skip this habit occasionally without breaking your streak
                            </p>
                        </div>
                    </div>


                    <DialogFooter className="flex justify-between gap-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsOpen();
                                reset();
                                setTimesList([]);
                            }}
                        >
                            Cancel
                        </Button>

                        {
                            editingHabit &&
                            <Button
                                type='button'
                                variant="destructive"
                                className="min-w-[120px]"
                                onClick={() => { deleteHabit(editingHabit?.id) }}
                            >
                                Delete
                            </Button>
                        }

                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            className="min-w-[120px]"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Habit'}
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

    );
};

export default HabitsForm;