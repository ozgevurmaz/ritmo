'use client';

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Control, Controller, FieldErrors, FieldValues, Path } from "react-hook-form";

interface PriorityMatrixProps<T extends FieldValues> {
    control: Control<T>;
    errors: FieldErrors<T>;
    urgencyName: Path<T>;
    importanceName: Path<T>;
}

const levels = ["Low", "Medium", "High"];

export const PriorityMatrixSection = <T extends FieldValues>({
    control,
    errors,
    urgencyName,
    importanceName,
}: PriorityMatrixProps<T>) => {
    const t = useTranslations('forms.todo.priority');

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Urgency */}
            <div className="space-y-2">
                <div className="text-sm font-medium flex items-center gap-1">
                    {t('urgency')}
                    <span className="text-destructive">*</span>
                </div>
                <Controller
                    name={urgencyName}
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={errors[urgencyName] ? "border-destructive" : ""}>
                                <SelectValue placeholder={t('selectUrgency')} />
                            </SelectTrigger>
                            <SelectContent className="bg-background">
                                {levels.map((level) => (
                                    <SelectItem key={level} value={level}>
                                        {t(`levels.${level}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors[urgencyName] && (
                    <p className="text-xs text-destructive">{t('required')}</p>
                )}
            </div>

            {/* Importance */}
            <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                    {t('importance')}
                    <span className="text-destructive">*</span>
                </Label>
                <Controller
                    name={importanceName}
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={errors[importanceName] ? "border-destructive" : ""}>
                                <SelectValue placeholder={t('selectImportance')} />
                            </SelectTrigger>
                            <SelectContent className="bg-background">
                                {levels.map((level) => (
                                    <SelectItem key={level} value={level}>
                                        {t(`levels.${level}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors[importanceName] && (
                    <p className="text-xs text-destructive">{t('required')}</p>
                )}
            </div>
        </div>
    );
};
