import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Control, Controller, Path, FieldValues, UseFormSetValue, PathValue } from "react-hook-form";

interface CheckboxCardProps<T extends FieldValues> {
    label: string;
    description?: string;
    name: Path<T>;
    value: boolean;
    setValue: UseFormSetValue<T>;
}

export const CheckboxCard = <T extends FieldValues>({
    label,
    description,
    name,
    value,
    setValue
}: CheckboxCardProps<T>) => {
    return (
        <div className="flex items-start space-x-3 p-3 rounded-lg border">
            <Checkbox
                id={name}
                checked={value}
                onCheckedChange={(checked) => setValue(name, !!checked as PathValue<T, Path<T>>, { shouldDirty: true })}
                className="border-foreground mt-1"
            />
            <div className="space-y-1">
                <Label htmlFor={name} className="text-sm font-medium cursor-pointer">
                    {label}
                </Label>
                {description && (
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};
