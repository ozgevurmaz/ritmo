"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
    CheckSquare,
    Calendar,
    Sparkles,
    Tag,
    Zap,
} from 'lucide-react';

import { todoSchema } from '@/lib/zod/client/todo';
import { formatDateForQuery, getPriorityColor, getPriorityLabel } from '@/lib/utils';

import { useAddTodo } from '@/lib/Mutations/todos/useAddTodo';
import { useUpdateTodo } from '@/lib/Mutations/todos/useUpdateTodo';
import { useDeleteTodo } from '@/lib/Mutations/todos/useDeleteTodo';
import { PRIORITY_EXPLANATIONS } from '@/lib/constants';

import { NotificationSelect } from './Selectors/NotificationSelection';
import { RepeatSelection } from './Selectors/RepeatSelection';
import { TypeSelection } from './Selectors/TypeSelection';
import { TagsInput } from './Inputs/TagsInput';
import { CategorySelection } from './Selectors/CategorySelection';
import { FormWrapper } from './Wrapper/FormWrapper';
import { DateRangePicker } from './Inputs/DatePicker';
import { TimeInput } from './Inputs/TimeInput';
import { PriorityMatrixSection } from './Selectors/PriortySelection';
import { TitleInput } from './Inputs/TitleInput';

import { FormActions } from './Cards/FormActions';
import { DeleteConfirmDialog } from '../shared/DeleteConfirmDialog';
import { PrivacyCard } from './Cards/PrivacyCard';

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
    isOpen: boolean;
    setIsOpen: () => void;
    editingTodo?: TodoType | null;
    userId: string;
}

const TodoForm: React.FC<TodoFormProps> = ({
    isOpen,
    setIsOpen,
    editingTodo = null,
    userId
}) => {
    const { mutateAsync: addToDo } = useAddTodo(userId);
    const { mutateAsync: updateTodo } = useUpdateTodo(userId);
    const { mutate: deleteTodo } = useDeleteTodo(userId);

    const [tagInput, setTagInput] = useState('');
    const [tagsList, setTagsList] = useState<string[]>(editingTodo?.tags || []);
    const [selectedContacts, setSelectedContacts] = useState<string[]>(editingTodo?.sharedWith || []);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const isEditing = Boolean(editingTodo);

    // Enhanced default values function
    const getDefaultValues = () => ({
        title: editingTodo?.title || '',
        urgent: editingTodo?.urgent || 'Medium',
        importance: editingTodo?.importance || 'Medium',
        deadline: editingTodo?.deadline || formatDateForQuery(new Date()),
        time: editingTodo?.time || '',
        notifyBefore: editingTodo?.notifyBefore || 'never',
        repeat: editingTodo?.repeat || 'never',
        category: editingTodo?.category || '',
        tags: editingTodo?.tags || [],
        visibility: editingTodo?.visibility || 'private',
        sharedWith: editingTodo?.sharedWith || [],
        type: editingTodo?.type || 'task'
    });

    const {
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        setValue,
        reset,
        watch,
        control
    } = useForm<TodoFormData>({
        resolver: zodResolver(todoSchema),
        defaultValues: getDefaultValues()
    });

    const watchedValues = watch();
    const { urgent: urgentValue, importance: importanceValue, visibility } = watchedValues;

    const priorityInfo = useMemo(() => {
        const priorityKey = `${importanceValue}-${urgentValue}` as keyof typeof PRIORITY_EXPLANATIONS;
        return {
            label: getPriorityLabel(urgentValue, importanceValue),
            color: getPriorityColor(urgentValue, importanceValue),
            explanation: PRIORITY_EXPLANATIONS[priorityKey] || 'Unknown priority level'
        };
    }, [urgentValue, importanceValue]);

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (isOpen) {
            const defaults = getDefaultValues();
            reset(defaults);
            setTagsList(editingTodo?.tags || []);
            setSelectedContacts(editingTodo?.sharedWith || []);
        } else {
            setDeleteConfirmOpen(false);
        }
    }, [isOpen, editingTodo, reset]);

    const onSubmit = async (data: TodoFormData) => {
        try {
            const submitData = {
                ...data,
                notifyBefore: data.notifyBefore === "never" ? null : data.notifyBefore,
                tags: tagsList,
                time: data.time === "" ? null : data.time,
                sharedWith: selectedContacts
            };

            if (isEditing) {
                await updateTodo({ todoId: editingTodo!.id, updates: submitData });
                toast.success("Todo updated successfully!");
            } else {
                await addToDo(submitData);
                toast.success("Todo created successfully!");
            }

            handleClose();
        } catch (error) {
            console.error('Error saving todo:', error);
            toast.error(isEditing ? "Error updating todo. Please try again." : "Error creating todo. Please try again.");
        }
    };

    const handleClose = () => {
        reset(getDefaultValues());
        setTagsList([]);
        setSelectedContacts([]);
        setTagInput('');
        setDeleteConfirmOpen(false);
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
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (editingTodo) {
            deleteTodo(editingTodo.id);
            toast.success("Todo deleted successfully.");
            handleClose();
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="min-w-4/5 lg:min-w-2/3 max-h-[90vh] overflow-y-auto px-2 md:p-4">
                <FormWrapper
                    variant="dialog"
                    title={isEditing ? 'Edit Todo' : 'Create New Todo'}
                    icon={CheckSquare}
                    description={isEditing
                        ? 'Update your task details and priorities.'
                        : 'Add a new task with priority levels, deadlines, and notifications.'
                    }>
                    <form className="space-y-8 py-3 md:py-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Basic Information */}
                        <FormWrapper title='Basic Information' icon={Sparkles} variant="element">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Title */}
                                <div className='flex-1 md:flex-2'>
                                    <TitleInput<TodoFormData>
                                        control={control}
                                        errors={errors}
                                        name="title"
                                        label="Task Title"
                                        placeholder="e.g., Schedule dentist appointment, Submit report, Call mom"
                                    />
                                </div>
                                <div className='md:flex-1'>
                                    {/* Type */}
                                    <TypeSelection
                                        control={control}
                                        name="type"
                                        errors={errors} />
                                </div>
                            </div>

                            {/* Category */}
                            <CategorySelection<TodoFormData>
                                control={control}
                                controlName="category"
                                errors={errors}
                            />
                        </FormWrapper>

                        {/* Priority Matrix */}
                        <FormWrapper title="Priority Matrix" icon={Zap} variant="element">
                            <Badge className={priorityInfo.color} variant="secondary" >
                                {priorityInfo.label}
                            </Badge>
                            <PriorityMatrixSection<TodoFormData>
                                control={control}
                                errors={errors}
                                urgencyName="urgent"
                                importanceName="importance"
                            />
                            <Alert className={priorityInfo.color}>
                                <AlertDescription className={priorityInfo.color}>
                                    <strong>Current Priority:</strong> {priorityInfo.explanation}
                                </AlertDescription>
                            </Alert>
                        </FormWrapper>

                        {/* Schedule & Timing */}
                        <FormWrapper title="Schedule & Timing" icon={Calendar} variant="element">
                            {/* Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DateRangePicker<TodoFormData>
                                    control={control}
                                    startName='deadline'
                                    errors={errors}
                                    type="todo"
                                />
                                <TimeInput<TodoFormData>
                                    control={control}
                                    controlName="time"
                                    errors={errors}
                                />
                            </div>

                            {/* Notifications and Repeat */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <NotificationSelect<TodoFormData>
                                    control={control}
                                    errors={errors}
                                    name="notifyBefore"
                                />

                                <RepeatSelection
                                    control={control}
                                    name="repeat"
                                />
                            </div>
                        </FormWrapper>

                        {/* Tags & Organization */}
                        <FormWrapper title="Tags & Organization" icon={Tag} variant="element">
                            <TagsInput<TodoFormData>
                                control={control}
                                errors={errors}
                                name="tags"
                                setValue={setValue}
                            />
                        </FormWrapper>

                        {/* Privacy & Sharing */}
                        <PrivacyCard<TodoFormData>
                            userId={userId}
                            control={control}
                            visibility={visibility}
                            visibilityName='visibility'
                            selectedContacts={selectedContacts}
                            handleContactChange={handleContactChange}
                        />

                        {/* Footer Actions */}

                        <FormActions
                            isSubmitting={isSubmitting}
                            submitLabel="Save Task"
                            onCancel={() => isOpen}
                            onDelete={handleDelete}
                            showDelete={!!editingTodo}
                        />

                        <DeleteConfirmDialog
                            open={deleteConfirmOpen}
                            onClose={cancelDelete}
                            onConfirm={confirmDelete}
                            title="Delete this task?"
                            description="This will permanently remove your task from the system."
                        />

                    </form>
                </FormWrapper>
            </DialogContent>
        </Dialog>
    );
};

export default TodoForm;