"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { useState } from "react";
import { Control, Controller, FieldErrors, FieldValues, Path } from "react-hook-form";
import CustomTimePicker from "./CustomTimePicker";

interface TimeInputProps<T extends FieldValues> {
    control: Control<T>;
    errors: FieldErrors<T>;
    controlName: Path<T>;
    label?: string;
    description?: string;
    use24Hour?: boolean;
}

export const TimeInput = <T extends FieldValues>({
    control,
    errors,
    controlName,
    label = "Time",
    description,
    use24Hour = true
}: TimeInputProps<T>) => {
    const [showTimePicker, setShowTimePicker] = useState(false);

    const formatDisplayTime = (timeString?: string) => {
        if (!timeString) return "Select time";
        
        if (use24Hour) {
            return timeString;
        } else {
            // Convert 24h to 12h format for display
            const [hours, minutes] = timeString.split(':').map(Number);
            const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
            const period = hours >= 12 ? 'PM' : 'AM';
            return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
        }
    };

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
                    <div className="relative">
                        <Button
                            type="button"
                            onClick={() => setShowTimePicker(true)}
                            className={`justify-start text-left bg-transparent border-input w-full ${
                                errors[controlName] ? "border-destructive" : ""
                            }`}
                            variant="outline"
                        >
                            <span className="flex-1 text-left">
                                {formatDisplayTime(field.value)}
                            </span>
                            <Clock className="h-4 w-4 ml-2" />
                        </Button>

                        {showTimePicker && (
                            <CustomTimePicker
                                isTimePickerOpen={showTimePicker}
                                setIsTimePickerOpen={setShowTimePicker}
                                selectedTime={field.value}
                                use24Hour={use24Hour}
                                onTimeSelect={(time) => {
                                    field.onChange(time);
                                }}
                            />
                        )}
                    </div>
                )}
            />
            {errors[controlName] && (
                <p className="text-xs text-destructive">{String(errors[controlName]?.message)}</p>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
    );
};