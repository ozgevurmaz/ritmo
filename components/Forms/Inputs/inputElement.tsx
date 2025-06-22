import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import React from 'react';
import {
    Control,
    FieldErrors,
    FieldValues,
    Path
} from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';

type InputProps<T extends FieldValues> = {
    control: Control<T>;
    errors: FieldErrors<T>;
    name: Path<T>;
    label: string;
    placeholder: string;
    type?: string,
};

export const InputElement = <T extends FieldValues>({
    control,
    name,
    errors,
    label,
    placeholder,
    type = "text"
}: InputProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel htmlFor={name}>{label} </FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground" />
                            <Input
                                id={name}
                                type={type}
                                placeholder={placeholder}
                                className="pl-10"
                                {...field}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}