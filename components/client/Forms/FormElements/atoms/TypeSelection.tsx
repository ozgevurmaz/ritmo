import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calendar, CheckSquare } from 'lucide-react';
import React from 'react'
import { Controller, Control, FieldErrors, FieldValues, Path } from 'react-hook-form';

interface TypeSelectionsProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    errors: FieldErrors<T>
}

// Task type options
const TASK_TYPES = [
    {
        value: 'task',
        label: 'Task',
        description: 'A specific action to complete',
        icon: CheckSquare
    },
    {
        value: 'event',
        label: 'Event',
        description: 'A scheduled meeting or appointment',
        icon: Calendar
    }
];

export const TypeSelection = <T extends FieldValues>({ control, name, errors }: TypeSelectionsProps<T>) => {
    return (
        <div className="space-y-2 flex-1">
            <Label htmlFor={name} className="text-sm font-medium flex items-center gap-1">
                Type
                <span className="text-destructive">*</span>
            </Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {TASK_TYPES.map(type => {
                                const IconComponent = type.icon;
                                return (
                                    <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center gap-2">
                                            <IconComponent className="h-4 w-4" />
                                            <div>
                                                <div className="font-medium">{type.label}</div>
                                                <div className="hidden md:flex text-xs text-muted-foreground">{type.description}</div>
                                            </div>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.type && (
                <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {String(errors[name]?.message)}
                </p>
            )}
        </div>
    )
}