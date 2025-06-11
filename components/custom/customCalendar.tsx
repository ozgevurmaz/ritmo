"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CustomCalendar({
    isCalendarOpen,
    setIsCalendarOpen,
    selectedDate,
    onDateSelect,
    minDate,
    maxDate,
}: {
    isCalendarOpen: boolean
    setIsCalendarOpen: () => void
    selectedDate?: Date
    onDateSelect?: (date: Date) => void
    minDate?: string
    maxDate?: string
}) {
     const t = useTranslations("forms.date")
    const calendarRef = useRef<HTMLDivElement>(null);
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
    const today = new Date();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen();
            }
        };

        if (isCalendarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCalendarOpen, setIsCalendarOpen]);

    // Helper function to create dates at noon to avoid timezone issues
    const createSafeDate = (year: number, month: number, day: number) => {
        return new Date(year, month, day, 12, 0, 0, 0);
    };

    // Helper function to normalize dates for comparison
    const normalizeDate = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
    };

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // First day of the month
        const firstDayOfMonth = createSafeDate(year, month, 1);
        // Last day of the month
        const lastDayOfMonth = new Date(year, month + 1, 0);
        // First day of the week for the first day of month (0 = Sunday)
        const firstDayOfWeek = firstDayOfMonth.getDay();

        const days = [];

        // Add previous month's trailing days
        const prevMonthDaysCount = firstDayOfWeek;
        const prevMonthLastDate = new Date(year, month, 0).getDate();

        for (let i = prevMonthDaysCount - 1; i >= 0; i--) {
            const day = createSafeDate(year, month - 1, prevMonthLastDate - i);
            days.push({
                date: day,
                isCurrentMonth: false,
                isPreviousMonth: true,
            });
        }
        
        // Add current month's days
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const date = createSafeDate(year, month, day);
            days.push({
                date: date,
                isCurrentMonth: true,
                isPreviousMonth: false
            });
        }

        // Add next month's leading days to complete the grid
        const remainingDays = 42 - days.length; // 6 rows × 7 days = 42
        for (let day = 1; day <= remainingDays; day++) {
            const date = createSafeDate(year, month + 1, day);
            days.push({
                date: date,
                isCurrentMonth: false,
                isPreviousMonth: false
            });
        }

        return days;
    };

    const isToday = (date: Date) => {
        const normalizedToday = normalizeDate(today);
        const normalizedDate = normalizeDate(date);
        return normalizedDate.getTime() === normalizedToday.getTime();
    };

    const isSelected = (date: Date) => {
        if (!selectedDate) return false;
        const normalizedSelected = normalizeDate(selectedDate);
        const normalizedDate = normalizeDate(date);
        return normalizedDate.getTime() === normalizedSelected.getTime();
    };

    const isPastDate = (date: Date) => {
        const normalizedToday = normalizeDate(today);
        const normalizedDate = normalizeDate(date);
        return normalizedDate.getTime() < normalizedToday.getTime();
    };

    const handleDateClick = (date: Date) => {
        if (onDateSelect) {
            // Create a clean date object for the selected date
            const cleanDate = createSafeDate(
                date.getFullYear(), 
                date.getMonth(), 
                date.getDate()
            );
            onDateSelect(cleanDate);
        }
        // Don't close calendar immediately - let user see selection
        setTimeout(() => {
            setIsCalendarOpen();
        }, 150);
    };

    const navigateMonth = (direction: number) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const monthNames : string[] = t.raw("monthNames")

    const calendarDays = generateCalendarDays();

    const isDisabledDate = (date: Date) => {
        const normalizedDate = normalizeDate(date);
        
        if (minDate) {
            const min = normalizeDate(new Date(minDate));
            if (normalizedDate.getTime() < min.getTime()) return true;
        }
        
        if (maxDate) {
            const max = normalizeDate(new Date(maxDate));
            if (normalizedDate.getTime() > max.getTime()) return true;
        }

        return false;
    };

    return (
        <div
            ref={calendarRef}
            className="absolute bg-background rounded-lg border border-primary/20 shadow-lg z-50 top-10 left-0 min-w-[300px] p-4"
        >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <h3 className="font-semibold text-sm">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-xs text-center p-2 font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((dayInfo, index) => {
                    const { date, isCurrentMonth } = dayInfo;
                    const dayIsToday = isToday(date);
                    const dayIsSelected = isSelected(date);
                    const dayIsPast = isPastDate(date);

                    return (
                        <Button
                            key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                            variant={dayIsSelected ? "default" : "ghost"}
                            size="sm"
                            disabled={isDisabledDate(date)}
                            className={`h-8 w-8 p-0 text-xs transition-all duration-200 cursor-pointer ${isDisabledDate(date) ? "opacity-30 pointer-events-none" : ""
                                } ${!isCurrentMonth
                                    ? 'text-muted-foreground/40 hover:text-muted-foreground/60 hover:bg-muted/20'
                                    : dayIsPast
                                        ? 'text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/30'
                                        : 'hover:bg-primary/10 hover:text-primary'
                                } ${dayIsToday && !dayIsSelected
                                    ? 'ring-2 ring-primary/50 font-bold text-primary'
                                    : ''
                                } ${dayIsSelected
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                                    : ''
                                }`}
                            onClick={() => handleDateClick(date)}
                        >
                            {date.getDate()}
                        </Button>
                    );
                })}
            </div>

            {/* Today button */}
            <div className="mt-3 pt-3 border-t border-primary/20">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs hover:bg-primary/10"
                    onClick={() => handleDateClick(today)}
                >
                    {t("back-today")} - {today.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    })}
                </Button>
            </div>
        </div>
    );
}