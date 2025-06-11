"use client"
import CustomCalendar from "@/components/custom/customCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateForQuery } from "@/lib/utils";
import { Calendar, Calendar1, CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Control, Controller, FieldErrors, FieldValues, Path, useWatch } from "react-hook-form";

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

    const t = useTranslations("forms.date")

    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);

    // Watch the start date value to use it as min date for end date
    const startDateValue = useWatch({
        control,
        name: startName
    });

    // Helper function to format date for minDate prop
    const formatDateForMinDate = (date: Date | string | null | undefined): string => {
        if (!date) return formatDateForQuery(new Date());

        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toISOString().split('T')[0];
    };

    // Calculate the minimum date for end date picker
    const getEndDateMinDate = (): string => {
        if (startDateValue) {
            // If start date is selected, end date should be at least the day after start date
            const startDate = new Date(startDateValue);
            const minEndDate = new Date(startDate);
            minEndDate.setDate(startDate.getDate() + 1); // Next day after start date
            return formatDateForMinDate(minEndDate);
        }
        // If no start date selected, use startMinDate or today
        return startMinDate || formatDateForQuery(new Date());
    };

    return (
        <div className={`grid grid-cols-1 gap-4 ${type !== "todo" && "md:grid-cols-2"}`}>
            {/* Start Date */}
            <div className="space-y-2">
                <Label htmlFor={startName} className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {type === "todo" ? t("label") : t("start")}
                    <span className="text-destructive">*</span>
                </Label>
                <Controller
                    name={startName}
                    control={control}
                    render={({ field }) => (
                        <div className="relative">
                            <Button
                                type="button"
                                onClick={() => setShowStartCalendar(true)}
                                className="justify-start text-left bg-transparent border-input w-full"
                                variant="outline"
                            >
                                <span className="flex-1 text-left">
                                    {field.value
                                        ? new Date(field.value).toLocaleDateString()
                                        : t("placeholder")}
                                </span>
                                <CalendarDays className="h-4 w-4 ml-2" />
                            </Button>

                            {showStartCalendar && (
                                <CustomCalendar
                                    isCalendarOpen={showStartCalendar}
                                    setIsCalendarOpen={() => setShowStartCalendar(false)}
                                    selectedDate={field.value ? new Date(field.value) : undefined}
                                    minDate={startMinDate}
                                    onDateSelect={(date) => {
                                        const formattedDate = date.toISOString().split("T")[0];
                                        field.onChange(formattedDate);
                                        setShowStartCalendar(false);
                                    }}
                                />
                            )}
                        </div>
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
                        {t("end")}
                        {type === "goal" && <span className="text-destructive">*</span>}
                    </Label>
                    <Controller
                        name={endName}
                        control={control}
                        render={({ field }) => (
                            <div className="relative">
                                <Button
                                    type="button"
                                    onClick={() => setShowEndCalendar(true)}
                                    className="justify-start text-left bg-transparent border-input w-full"
                                    variant="outline"
                                    disabled={!startDateValue}
                                >
                                    <span className="flex-1 text-left">
                                        {field.value
                                            ? new Date(field.value).toLocaleDateString()
                                            : startDateValue
                                                ? t("pick-end")
                                                : t("select-start-date")}
                                    </span>
                                    <CalendarDays className="h-4 w-4 ml-2" />
                                </Button>

                                {showEndCalendar && startDateValue && (
                                    <CustomCalendar
                                        minDate={getEndDateMinDate()}
                                        isCalendarOpen={showEndCalendar}
                                        setIsCalendarOpen={() => setShowEndCalendar(false)}
                                        selectedDate={field.value ? new Date(field.value) : undefined}
                                        onDateSelect={(date) => {
                                            const formattedDate = date.toISOString().split("T")[0];
                                            field.onChange(formattedDate);
                                            setShowEndCalendar(false);
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    />
                    {errors[endName] && (
                        <p className="text-xs text-destructive">{String(errors[endName]?.message)}</p>
                    )}
                    {type === "habit" && <p className="text-xs text-muted-foreground">{t("leave-empty")}</p>}
                    {!startDateValue && type !== "habit" && (
                        <p className="text-xs text-muted-foreground">{t("start-date-err")}</p>
                    )}
                </div>}
        </div>
    );
};