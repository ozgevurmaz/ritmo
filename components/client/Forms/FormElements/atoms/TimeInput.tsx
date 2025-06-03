import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { Control, Controller, FieldErrors, FieldValues, Path } from "react-hook-form";

interface TimeInputProps<T extends FieldValues> {
    control: Control<T>;
    errors: FieldErrors<T>;
    controlName: Path<T>;
    label?: string;
    description?: string;
}

export const TimeInput = <T extends FieldValues>({
    control,
    errors,
    controlName,
    label = "Time",
    description
}: TimeInputProps<T>) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={controlName} className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {label}
            </Label>
            <Controller
                name={controlName}
                control={control}
                render={({ field }) => (
                    <Input
                        type="time"
                        {...field}
                        className={errors[controlName] ? "border-destructive" : ""}
                    />
                )}
            />
            {errors[controlName] && (
                <p className="text-xs text-destructive">{String(errors[controlName]?.message)}</p>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
    );
};
