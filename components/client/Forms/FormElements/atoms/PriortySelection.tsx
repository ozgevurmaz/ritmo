import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { getPriorityColor, getPriorityLabel } from "@/lib/utils";
import { useMemo } from "react";
import { Control, Controller, FieldErrors, FieldValue, FieldValues, Path } from "react-hook-form";

interface PriorityMatrixProps<T extends FieldValues> {
    control: Control<T>;
    errors: FieldErrors<T>;
    urgencyName: Path<T>;
    importanceName: Path<T>;
}

const urgencies = ["Low", "Medium", "High"];
const importances = ["Low", "Medium", "High"];

export const PriorityMatrixSection = <T extends FieldValues>({
    control,
    errors,
    urgencyName,
    importanceName,
}: PriorityMatrixProps<T>) => {

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Urgency */}
            <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                    Urgency
                    <span className="text-destructive">*</span>
                </Label>
                <Controller
                    name={urgencyName}
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={errors[urgencyName] ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select urgency" />
                            </SelectTrigger>
                            <SelectContent>
                                {urgencies.map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors[urgencyName] && (
                    <p className="text-xs text-destructive">{String(errors[urgencyName]?.message)}</p>
                )}
            </div>

            {/* Importance */}
            <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                    Importance
                    <span className="text-destructive">*</span>
                </Label>
                <Controller
                    name={importanceName}
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={errors[importanceName] ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select importance" />
                            </SelectTrigger>
                            <SelectContent>
                                {importances.map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors[importanceName] && (
                    <p className="text-xs text-destructive">{String(errors[importanceName]?.message)}</p>
                )}
            </div>
        </div>
    );
};
