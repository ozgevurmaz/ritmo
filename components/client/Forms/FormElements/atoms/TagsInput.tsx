import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import {
    Control,
    Controller,
    FieldErrors,
    FieldValues,
    Path,
    PathValue,
    UseFormSetValue
} from 'react-hook-form';

type TagsInputProps<T extends FieldValues> = {
    control: Control<T>;
    errors: FieldErrors<T>;
    name: Path<T>;
    setValue: UseFormSetValue<T>;
};

export const TagsInput = <T extends FieldValues>({
    control,
    errors,
    name,
    setValue
}: TagsInputProps<T>) => {
    const [inputValue, setInputValue] = useState("");

    const handleAddTag = (tags: string[], value: string) => {
        const newTag = value.trim();
        if (newTag && !tags.includes(newTag)) {
            const updated = [...tags, newTag];
            setValue(name, updated as PathValue<T, Path<T>>);
        }
    };

    const handleRemoveTag = (tags: string[], tagToRemove: string) => {
        const updated = tags.filter(tag => tag !== tagToRemove);
        setValue(name, updated as PathValue<T, Path<T>>);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">Tags (optional)</Label>
            <Controller
                name={name}
                control={control}
                defaultValue={[] as PathValue<T, Path<T>>}
                render={({ field }) => (
                    <>
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    handleAddTag(field.value || [], inputValue);
                                    setInputValue("");
                                }
                            }}
                            placeholder="Press Enter or comma to add"
                            className={errors[name] ? 'border-destructive' : ''}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {field.value?.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                    {tag}
                                    <X
                                        className="w-3 h-3 cursor-pointer"
                                        onClick={() => handleRemoveTag(field.value, tag)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </>
                )}
            />
            {errors[name] && (
                <p className="text-xs text-destructive">{String(errors[name]?.message)}</p>
            )}
        </div>
    );
};
