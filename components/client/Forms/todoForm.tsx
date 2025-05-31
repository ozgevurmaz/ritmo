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
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Plus, X, Calendar, Clock, Bell, EyeOff, Eye, Ban } from 'lucide-react';
import { todoSchema } from '@/lib/zod/client/todo';
import { categories, contacts } from '@/lib/constants';
import { formatDateForQuery, getPriorityColor, getPriorityLabel } from '@/lib/utils';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAddTodo } from '@/lib/Mutations/todos/useAddTodo';
import { useUpdateTodo } from '@/lib/Mutations/todos/useUpdateTodo';
import { useDeleteTodo } from '@/lib/Mutations/todos/useDeleteTodo';

type TodoFormData = z.infer<typeof todoSchema>;

const notificationOptions = [
    { value: 'never', label: 'Never' },
    { value: '0', label: 'At time' },
    { value: '5', label: '5 minutes before' },
    { value: '15', label: '15 minutes before' },
    { value: '30', label: '30 minutes before' },
    { value: '60', label: '1 hour before' },
    { value: '120', label: '2 hours before' },
    { value: '1440', label: '1 day before' }
];

const TodoForm = (
    {
        isOpen, setIsOpen, editingTodo = null, userId
    }:
        {
            isOpen: boolean,
            setIsOpen: () => void,
            editingTodo?: TodoType | null
            userId: string
        }) => {

    const { mutateAsync: addToDo } = useAddTodo(userId)
    const { mutateAsync: updateTodo } = useUpdateTodo(userId)
    const { mutate: deleteTodo } = useDeleteTodo(userId);

    const [tagInput, setTagInput] = useState('');
    const [tagsList, setTagsList] = useState<string[]>(editingTodo?.tags || []);
    const [selectedContacts, setSelectedContacts] = useState<string[]>(editingTodo?.sharedWith || []);

    // Set proper default values
    const getDefaultValues = () => ({
        title: editingTodo?.title || '',
        urgent: editingTodo?.urgent || 'Medium',
        importance: editingTodo?.importance || 'Medium',
        deadline: editingTodo?.deadline || formatDateForQuery(new Date),
        time: editingTodo?.time || null,
        notifyBefore: editingTodo?.notifyBefore || 'never',
        repeat: editingTodo?.repeat || 'never',
        category: editingTodo?.category || '',
        tags: editingTodo?.tags || [],
        visibility: editingTodo?.visibility || 'private',
        sharedWith: editingTodo?.sharedWith || [],
        type: editingTodo?.type || 'event'
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
        watch,
        control
    } = useForm<TodoFormData>({
        resolver: zodResolver(todoSchema),
        defaultValues: getDefaultValues()
    });

    const urgentValue = watch('urgent');
    const importanceValue = watch('importance');
    const visibility = watch('visibility');

    const onSubmit = async (data: TodoFormData) => {
        try {
            const submitData = {
                ...data,
                notifyBefore: data.notifyBefore === "never" ? null : data.notifyBefore,
                tags: tagsList,
                time: data.time === "" ? null : data.time,
                sharedWith: selectedContacts
            };

            if (editingTodo) {
                await updateTodo({ todoId: editingTodo.id, updates: submitData });
                toast.success("Todo edited successfully")
            } else {
                await addToDo(submitData);
                toast.success("Todo added successfully.")
            }

            handleClose();
        } catch (error) {
            console.error('Error saving todo:', error);
            toast.error("Error creating todo. Please try again.")
        }
    };

    const handleClose = () => {
        reset(getDefaultValues());
        setTagsList([]);
        setSelectedContacts([]);
        setTagInput('');
        setIsOpen();
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

    const addTag = () => {
        const trimmedTag = tagInput.trim().toLowerCase();
        if (trimmedTag && !tagsList.includes(trimmedTag)) {
            setTagsList(prev => [...prev, trimmedTag]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTagsList(prev => prev.filter(tag => tag !== tagToRemove));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    // Reset form when dialog opens/closes or editing todo changes
    useEffect(() => {
        if (isOpen) {
            const defaults = getDefaultValues();
            reset(defaults);
            setTagsList(editingTodo?.tags || []);
            setSelectedContacts(editingTodo?.sharedWith || []);
        }
    }, [isOpen, editingTodo, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-primary" />
                        {editingTodo ? 'Edit Todo' : 'Create New Todo'}
                    </DialogTitle>
                    <DialogDescription>
                        Add a new task with priority levels, deadlines, and notifications using the Eisenhower Matrix approach.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-6 py-4" onSubmit={handleSubmit(onSubmit)}>

                    {/* Title and Type */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium">
                                Task Title *
                            </Label>
                            <Input
                                id="title"
                                {...register('title')}
                                placeholder="What needs to be done?"
                                className={errors.title ? 'border-destructive' : ''}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title.message}</p>
                            )}
                        </div>
                        <div className='space-y-2'>
                            <Label className="text-sm font-medium">Type</Label>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="task">Task</SelectItem>
                                            <SelectItem value="event">Event</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )} />
                            {errors.type && (
                                <p className="text-xs text-destructive">{errors.type.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Priority Matrix - Urgency and Importance */}
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-medium">Priority Matrix</h3>
                            <Badge className={getPriorityColor(urgentValue, importanceValue)}>
                                {getPriorityLabel(urgentValue, importanceValue)}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Urgency *</Label>
                                <Controller
                                    name="urgent"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={errors.urgent ? 'border-destructive' : ''}>
                                                <SelectValue placeholder="Select urgency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="High">🔴 High - Needs immediate attention</SelectItem>
                                                <SelectItem value="Medium">🟡 Medium - Can wait a bit</SelectItem>
                                                <SelectItem value="Low">🟢 Low - Not time-sensitive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} />
                                {errors.urgent && (
                                    <p className="text-xs text-destructive">{errors.urgent.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Importance *</Label>
                                <Controller
                                    name="importance"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={errors.importance ? 'border-destructive' : ''}>
                                                <SelectValue placeholder="Select importance" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="High">⭐ High - Critical</SelectItem>
                                                <SelectItem value="Medium">📝 Medium - Somewhat important</SelectItem>
                                                <SelectItem value="Low">📄 Low - Nice to have</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} />
                                {errors.importance && (
                                    <p className="text-xs text-destructive">{errors.importance.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="deadline" className="text-sm font-medium flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-primary" />
                                Deadline *
                            </Label>
                            <Input
                                id="deadline"
                                type="date"
                                {...register('deadline')}
                                className={errors.deadline ? 'border-destructive' : ''}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {errors.deadline && (
                                <p className="text-xs text-destructive">{errors.deadline.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time" className="text-sm font-medium flex items-center gap-1">
                                <Clock className="h-4 w-4 text-primary" />
                                Time (Optional)
                            </Label>
                            <Input
                                id="time"
                                type="time"
                                {...register('time')}
                                className={errors.time ? 'border-destructive' : ''}
                            />
                            {errors.time && (
                                <p className="text-xs text-destructive">{errors.time.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Notification, Repeat, Categories, Tags */}
                    <div className="w-full flex flex-wrap gap-4">
                        <div className="space-y-2 flex-1">
                            <Label className="text-sm font-medium flex items-center gap-1">
                                <Bell className="h-4 w-4 text-primary" />
                                Notify Before
                            </Label>
                            <Controller
                                name="notifyBefore"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className={errors.notifyBefore ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select notification time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {notificationOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.notifyBefore && (
                                <p className="text-xs text-destructive">{errors.notifyBefore.message}</p>
                            )}
                        </div>

                        <div className="space-y-2 flex-1">
                            <Label className="text-sm font-medium">Repeat</Label>
                            <Controller
                                name="repeat"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select repeat option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="never">Never</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className='space-y-2 flex-1'>
                            <Label className="text-sm font-medium">Category *</Label>
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

                        <div className="space-y-2 flex-2 max-w-max">
                            <Label className="text-sm font-medium">Tags (Optional)</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Add a tag and press Enter"
                                    className="flex-1"
                                />
                                <Button type="button" onClick={addTag} size="sm" variant="outline">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {tagsList.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 p-2 bg-muted/20 rounded-md">
                                    {tagsList.map(tag => (
                                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className='p-0 cursor-pointer hover:text-destructive transition-colors'>
                                                <X
                                                    className="h-3 w-3 "

                                                />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Visibility Settings */}
                    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                        <Label className="text-sm font-medium">Visibility Settings</Label>
                        <Controller
                            name="visibility"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="private" id="private" className='border-foreground/70' />
                                        <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                                            <EyeOff className="h-4 w-4" />
                                            Private - Only I can see this todo
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

                        {/* Share With Contacts */}
                        {visibility === "public" && (
                            <div className="mt-4 space-y-3">
                                <div>
                                    <Label className="text-sm font-medium">Share with specific people</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Choose people who can view and encourage your progress
                                    </p>
                                </div>
                                <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-3 bg-background">
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
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="order-1 sm:order-none"
                        >
                            Cancel
                        </Button>

                        <div className="flex gap-2 order-2 sm:order-none">
                            {editingTodo && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => {
                                        deleteTodo(editingTodo.id);
                                        handleClose();
                                    }}
                                >
                                    Delete
                                </Button>
                            )}

                            <Button
                                type='submit'
                                disabled={isSubmitting}
                                className="min-w-[120px]"
                            >
                                {isSubmitting
                                    ? (editingTodo ? 'Updating...' : 'Creating...')
                                    : (editingTodo ? 'Update Todo' : 'Create Todo')
                                }
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TodoForm;