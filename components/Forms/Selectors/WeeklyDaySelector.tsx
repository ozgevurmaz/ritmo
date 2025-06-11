import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";
import { useTranslations } from "next-intl";
import { DAYS_OF_WEEK } from "@/lib/constants";

interface WeeklyDaySelectorProps<T extends FieldValues> {
    selectedDays: string[];
    weeklyFrequency: number;
    setValue: UseFormSetValue<T>;
    name: Path<T>;
}

export const WeeklyDaySelector = <T extends FieldValues>({
    selectedDays,
    weeklyFrequency,
    setValue,
    name
}: WeeklyDaySelectorProps<T>) => {
    const t = useTranslations('forms.days-selection');
    const isValid = weeklyFrequency === 7 || selectedDays.length === weeklyFrequency;
    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-1">
                {t("days-label")}
                <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {DAYS_OF_WEEK.map(day => (
                    <div
                        key={day}
                        className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors
              ${selectedDays.includes(t(`days.${day}.short`))
                                ? "bg-primary/10 border-primary"
                                : "border-border hover:bg-muted"}`}
                    >
                        <Checkbox
                            id={t(`days.${day}.short`)}
                            checked={selectedDays.includes(t(`days.${day}.short`))}
                            onCheckedChange={checked => {
                                const current = selectedDays;
                                let updated;

                                if (checked) {
                                    if (current.length < weeklyFrequency) {
                                        updated = [...current, t(`days.${day}.short`)];
                                    } else {
                                        toast.error(t("days-error", { count: weeklyFrequency }))
                                        return;
                                    }
                                } else {
                                    updated = current.filter(d => d !== t(`days.${day}.short`));
                                }

                                setValue(name, updated as PathValue<T, typeof name>, { shouldDirty: true });

                            }}
                            className="border-foreground/70"
                        />
                        <Label htmlFor={t(`days.${day}.short`)} className="cursor-pointer font-medium">
                            {t(`days.${day}.full`)}
                        </Label>
                    </div>
                ))}
            </div>

            {!isValid && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {t("days-alert", { count: weeklyFrequency })}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};
