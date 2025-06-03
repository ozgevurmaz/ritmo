import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import React from 'react';
import {
    Control,
    Controller,
    FieldErrors,
    FieldValues,
    Path
} from 'react-hook-form';

type TitleInputProps<T extends FieldValues> = {
    control: Control<T>;
    errors: FieldErrors<T>;
    name: Path<T>;
    label?: string;
    placeholder: string;
};

export const TitleInput = <T extends FieldValues>({
    control,
    errors,
    name,
    label = "Title",
    placeholder
}: TitleInputProps<T>) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium flex items-center gap-1">
                {label}
                <span className="text-destructive">*</span>
            </Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Input
                        id={name}
                        {...field}
                        placeholder={placeholder}
                        className={errors[name] ? 'border-destructive focus-visible:ring-destructive' : ''}
                    />
                )}
            />
            {errors[name] && (
                <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {String(errors[name]?.message)}
                </p>
            )}
        </div>
    );
};