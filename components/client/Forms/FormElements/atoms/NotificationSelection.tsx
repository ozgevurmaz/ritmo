import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Ban, Bell, Calendar, Clock } from "lucide-react";
import { Control, Controller, FieldErrors, FieldValues, Path } from "react-hook-form";

type NotificationSelectProps<T extends FieldValues> = {
    control: Control<T>;
    errors: FieldErrors<T>;
    name: Path<T>;
};

const NOTIFICATION_OPTIONS = [
    { value: 'never', label: 'No notification', icon: Ban },
    { value: '0', label: 'At time', icon: Bell },
    { value: '5', label: '5 minutes before', icon: Clock },
    { value: '15', label: '15 minutes before', icon: Clock },
    { value: '30', label: '30 minutes before', icon: Clock },
    { value: '60', label: '1 hour before', icon: Clock },
    { value: '120', label: '2 hours before', icon: Clock },
    { value: '1440', label: '1 day before', icon: Calendar }
];

export const NotificationSelect = <T extends FieldValues>({
    control,
    errors,
    name
}: NotificationSelectProps<T>) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">Notification</Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors[name] ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select notification time" />
                        </SelectTrigger>
                        <SelectContent>
                            {NOTIFICATION_OPTIONS.map(option => {
                                const IconComponent = option.icon;
                                return (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                            <IconComponent className="h-4 w-4" />
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors[name] && (
                <p className="text-xs text-destructive">{String(errors[name]?.message)}</p>
            )}
        </div>
    );
};
