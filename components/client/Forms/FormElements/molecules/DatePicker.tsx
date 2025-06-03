import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { Control, Controller, FieldErrors, FieldValues, Path } from "react-hook-form";

interface DateRangePickerProps<T extends FieldValues> {
    control: Control<T>;
    errors: FieldErrors<T>;
    startName: Path<T>;
    endName?: Path<T>;
    startMinDate?: string;
    type?: "habit" | "goal" | "todo";
}

export const DateRangePicker = <T extends FieldValues>({
    control,
    errors,
    startName,
    endName,
    startMinDate,
    type = "goal"
}: DateRangePickerProps<T>) => {
    return (
        <div className={`grid grid-cols-1 gap-4 ${type !== "todo" && "md:grid-cols-2"}`}>
            {/* Start Date */}
            <div className="space-y-2">
                <Label htmlFor={startName} className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {type === "todo" ? "Date" : "Start Date"}
                    <span className="text-destructive">*</span>
                </Label>
                <Controller
                    name={startName}
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="date"
                            {...field}
                            min={startMinDate || new Date().toISOString().split("T")[0]}
                            className={errors[startName] ? "border-destructive" : ""}
                        />
                    )}
                />
                {errors[startName] && (
                    <p className="text-xs text-destructive">{String(errors[startName]?.message)}</p>
                )}
            </div>

            {/* End Date */}
            {type !== "todo" && endName &&
                <div className="space-y-2">
                    <Label htmlFor={endName} className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        End Date
                        {type === "goal" && <span className="text-destructive">*</span>}
                    </Label>
                    <Controller
                        name={endName}
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="date"
                                {...field}
                                min={startMinDate || new Date().toISOString().split("T")[0]}
                                className={errors[endName] ? "border-destructive" : ""}
                            />
                        )}
                    />
                    {errors[endName] && (
                        <p className="text-xs text-destructive">{String(errors[endName]?.message)}</p>
                    )}
                    {type === "habit" && <p className="text-xs text-muted-foreground">Leave empty for ongoing habit</p>}
                </div>}


        </div>
    );
};
