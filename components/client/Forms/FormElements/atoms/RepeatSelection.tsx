import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ban, Repeat } from 'lucide-react';
import React from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface RepeatSelectionProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
}
const REPEAT_OPTIONS = [
    { value: 'never', label: 'Never', icon: Ban },
    { value: 'daily', label: 'Daily', icon: Repeat },
    { value: 'weekly', label: 'Weekly', icon: Repeat },
    { value: 'monthly', label: 'Monthly', icon: Repeat },
    { value: 'yearly', label: 'Yearly', icon: Repeat }
];

export const RepeatSelection = <T extends FieldValues>({ control, name }: RepeatSelectionProps<T>) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium flex items-center gap-1">
                <Repeat className="h-4 w-4" />
                Repeat
            </Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select repeat option" />
                        </SelectTrigger>
                        <SelectContent>
                            {REPEAT_OPTIONS.map(option => {
                                const IconComponent = option.icon;
                                return (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                            <IconComponent className="h-4 w-4" />
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    )
}