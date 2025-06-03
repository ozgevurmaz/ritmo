import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import {
    Control,
    Controller,
    FieldErrors,
    FieldValues,
    Path,
    PathValue,
    UseFormSetValue,
} from 'react-hook-form';

type MotivationInputProps<T extends FieldValues> = {
    control: Control<T>;
    errors: FieldErrors<T>;
    name: Path<T>;
    setValue: UseFormSetValue<T>;
    showPredefinedMessages?: boolean;
    label?: string
};

// Predefined motivation messages
const MOTIVATION_MESSAGES = [
    "Every step counts!",
    "You're building a better you!",
    "Consistency is key!",
    "Small actions, big results!",
    "Progress over perfection!",
    "You've got this!",
    "One day at a time!",
];

export const TextAreaInput = <T extends FieldValues>({
    control,
    errors,
    name,
    setValue,
    showPredefinedMessages = true,
    label = " Custom Motivation Message (Optional)"
}: MotivationInputProps<T>) => {
    return (
        <div className="space-y-3">
            <Label htmlFor={name} className="text-sm font-medium">
                {label}
            </Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        placeholder="Enter a personal message to motivate you..."
                        className={`min-h-[80px] ${errors[name] ? 'border-destructive' : ''}`}
                        rows={3}
                    />
                )}
            />
            {errors[name] && (
                <p className="text-xs text-destructive">
                    {String(errors[name]?.message)}
                </p>
            )}

            {/* Predefined messages */}
            {showPredefinedMessages && <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                    {MOTIVATION_MESSAGES.map((message) => (
                        <Button
                            key={message}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setValue(name, message as PathValue<T, Path<T>>)}
                            className="text-xs h-8"
                        >
                            {message}
                        </Button>
                    ))}
                </div>
            </div>}
        </div>
    );
};
