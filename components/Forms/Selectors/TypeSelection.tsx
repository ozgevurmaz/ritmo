'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calendar, CheckSquare } from 'lucide-react';
import React from 'react';
import { Controller, Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { useTranslations } from 'next-intl';

interface TypeSelectionsProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  errors: FieldErrors<T>;
}

export const TypeSelection = <T extends FieldValues>({ control, name, errors }: TypeSelectionsProps<T>) => {
  const t = useTranslations('forms.todo');

  const TASK_TYPES = [
    {
      value: 'task',
      label: t('types.task.label'),
      description: t('types.task.description'),
      icon: CheckSquare,
    },
    {
      value: 'event',
      label: t('types.event.label'),
      description: t('types.event.description'),
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-2 flex-1">
      <div className="text-sm font-medium flex items-center gap-1">
        {t('types.label')}
        <span className="text-destructive">*</span>
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className={errors[name] ? 'border-destructive' : ''}>
              <SelectValue placeholder={t('types.select')} />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {TASK_TYPES.map((type) => {
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
      {errors[name] && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {t('types.error')}
        </p>
      )}
    </div>
  );
};
