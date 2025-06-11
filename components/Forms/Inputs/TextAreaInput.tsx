import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';
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
    label?: string;
    placeholder?: string
};

export const TextAreaInput = <T extends FieldValues>({
    control,
    errors,
    name,
    setValue,
    showPredefinedMessages = true,
    label,
    placeholder
}: MotivationInputProps<T>) => {
    const t = useTranslations("forms.motivation")

    const MOTIVATION_MESSAGES: string[] = t.raw("suggestions");

    return (
        <div className="space-y-3">
            <Label htmlFor={name} className="text-sm font-medium">
                {label || t("label")}
            </Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        placeholder={placeholder || t("placeholder")}
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
                <p className="text-xs text-muted-foreground">{t("quick-suggestion")}:</p>
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
