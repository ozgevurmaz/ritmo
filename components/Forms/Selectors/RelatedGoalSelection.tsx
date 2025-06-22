import React from 'react'
import {
    Control,
    FieldValues,
    UseFormSetValue,
    Path,
    Controller,
    useWatch
} from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'lucide-react';
import { useGoals } from '@/lib/Queries/goals/useGoal';
import { useTranslations } from 'next-intl';

interface RelatedGoalSelectionProps<T extends FieldValues> {
    control: Control<T>;
    setValue: UseFormSetValue<T>;
    name: Path<T>;
    userId: string;
    goalTitle?: string;
    disabled: boolean
}

export const RelatedGoalSelection = <T extends FieldValues>({
    control,
    setValue,
    name,
    userId,
    goalTitle,
    disabled
}: RelatedGoalSelectionProps<T>) => {
    const t = useTranslations()
    const { data: goals, isLoading: goalsLoading } = useGoals(userId);
    const selectedGoal = useWatch({ control, name }) as string | null;

    return (
        <div className="space-y-2">
            <div className="text-sm font-medium">{t("forms.habit.fields.goal-selection.label")}</div>

            <Controller
                disabled={!!goalTitle}
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        onValueChange={(value) =>
                            setValue(name, value === 'none' ? null : value as any, { shouldDirty: true })
                        }
                        value={field.value || 'none'}
                        disabled={disabled}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={goalsLoading ? t("forms.habit.fields.goal-selection.loading") : t("forms.habit.fields.goal-selection.placeholder")} />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                            <SelectItem value="none">{t("forms.habit.fields.goal-selection.no-goal")}</SelectItem>
                            {goals?.map((goal: GoalType) => (
                                <SelectItem key={goal.id} value={goal.id}>
                                    <div className="flex items-center gap-2">
                                        <span>{goal.title}</span>
                                        <Badge variant="outline" className="text-xs">{goal.category}</Badge>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />

            {selectedGoal && selectedGoal !== 'none' && (
                <Alert className="border-goals bg-goals/20">
                    <Link className="h-4 w-4 text-goals/90" />
                    <AlertDescription className="text-goals">
                        <strong>{t("forms.habit.fields.goal-selection.linked-label")}</strong> {goals?.find((g: GoalType) => g.id === selectedGoal)?.title}
                    </AlertDescription>
                </Alert>
            )}

            {goalTitle && (
                <Alert className="border-goals bg-goals/20">
                    <Link className="h-4 w-4 text-goals/90" />
                    <AlertDescription className="text-goals">
                        <strong>{t("forms.habit.fields.goal-selection.linked-label")}</strong> {goalTitle}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};
