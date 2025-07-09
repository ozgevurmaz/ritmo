"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ban, Repeat } from 'lucide-react';
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslations } from 'next-intl';

interface RepeatSelectionProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
}

const REPEAT_OPTIONS = [
    { value: 'never', icon: Ban },
    { value: 'daily', icon: Repeat },
    { value: 'weekly', icon: Repeat },
    { value: 'monthly', icon: Repeat },
    { value: 'yearly', icon: Repeat }
];

export const RepeatSelection = <T extends FieldValues>({ control, name }: RepeatSelectionProps<T>) => {
    const t = useTranslations('forms.repeat');

    return (
        <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-1">
                <Repeat className="h-4 w-4" />
                {t('label')}
            </div>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('placeholder')} />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                            {REPEAT_OPTIONS.map(option => {
                                const IconComponent = option.icon;
                                return (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                            <IconComponent className="h-4 w-4" />
                                            {t(`options.${option.value}`)}
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    );
};
