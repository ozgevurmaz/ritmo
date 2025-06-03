import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";
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
    const isValid = weeklyFrequency === 7 || selectedDays.length === weeklyFrequency;

    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-1">
                Select Specific Days
                <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {DAYS_OF_WEEK.map(day => (
                    <div
                        key={day.short}
                        className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors
              ${selectedDays.includes(day.short)
                                ? "bg-primary/10 border-primary"
                                : "border-border hover:bg-muted"}`}
                    >
                        <Checkbox
                            id={day.short}
                            checked={selectedDays.includes(day.short)}
                            onCheckedChange={checked => {
                                const current = selectedDays;
                                let updated;

                                if (checked) {
                                    if (current.length < weeklyFrequency) {
                                        updated = [...current, day.short];
                                    } else {
                                        toast.error(`You can only select ${weeklyFrequency} days.`);
                                        return;
                                    }
                                } else {
                                    updated = current.filter(d => d !== day.short);
                                }

                                setValue(name, updated as PathValue<T, typeof name>, { shouldDirty: true });

                            }}
                            className="border-foreground/70"
                        />
                        <Label htmlFor={day.short} className="cursor-pointer font-medium">
                            {day.full}
                        </Label>
                    </div>
                ))}
            </div>

            {!isValid && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Please select exactly {weeklyFrequency} days for your weekly habit.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};
