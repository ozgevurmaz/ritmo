"use client"

import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Ban, Bell, Calendar, Clock } from "lucide-react";
import { Control, Controller, FieldErrors, FieldValues, Path } from "react-hook-form";
import { useTranslations } from "next-intl";

type NotificationSelectProps<T extends FieldValues> = {
    control: Control<T>;
    errors: FieldErrors<T>;
    name: Path<T>;
};

const NOTIFICATION_OPTIONS = [
    { value: 'never', icon: Ban },
    { value: '0', icon: Bell },
    { value: '5', icon: Clock },
    { value: '15', icon: Clock },
    { value: '30', icon: Clock },
    { value: '60', icon: Clock },
    { value: '120', icon: Clock },
    { value: '1440', icon: Calendar }
];

export const NotificationSelect = <T extends FieldValues>({
    control,
    errors,
    name
}: NotificationSelectProps<T>) => {
    const t = useTranslations('forms.notifications');

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">{t('label')}</Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors[name] ? "border-destructive" : ""}>
                            <SelectValue placeholder={t('placeholder')} />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                            {NOTIFICATION_OPTIONS.map(option => {
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
            {errors[name] && (
                <p className="text-xs text-destructive">{String(errors[name]?.message)}</p>
            )}
        </div>
    );
};
