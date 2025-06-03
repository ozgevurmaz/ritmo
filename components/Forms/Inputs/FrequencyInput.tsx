import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import {
    Controller,
    Control,
    FieldErrors,
    FieldValues,
    Path
} from "react-hook-form";

type FrequencyInputProps<T extends FieldValues> = {
    control: Control<T>;
    errors: FieldErrors<T>;
    name: Path<T>;
    label: string;
    max?: number;
    min?: number;
    helperText?: string;
};

export const FrequencyInput = <T extends FieldValues>({
    control,
    errors,
    name,
    label,
    max = 20,
    min,
    helperText,
}: FrequencyInputProps<T>) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium flex items-center gap-1">
                {label}
                <span className="text-destructive">*</span>
            </Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Input
                        id={name}
                        type="number"
                        {...field}
                        max={max}
                        min={min}
                        value={field.value ?? ""}
                        onChange={(e) =>
                            field.onChange(e.target.value === "" ? undefined : +e.target.value)
                        }
                        className={errors[name] ? "border-destructive" : ""}
                    />
                )}
            />
            {errors[name] && (
                <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {String(errors[name]?.message)}
                </p>
            )}
            {helperText && (
                <p className="text-xs text-muted-foreground">{helperText}</p>
            )}
        </div>
    );
};
