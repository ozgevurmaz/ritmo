"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface CustomTimePickerProps {
    isTimePickerOpen: boolean;
    setIsTimePickerOpen: (open: boolean) => void;
    selectedTime?: string;
    onTimeSelect?: (time: string) => void;
    use24Hour?: boolean;
}

export default function CustomTimePicker({
    isTimePickerOpen,
    setIsTimePickerOpen,
    selectedTime,
    onTimeSelect,
    use24Hour = true
}: CustomTimePickerProps) {
    const t = useTranslations()
    const timePickerRef = useRef<HTMLDivElement>(null);

    // Parse the selected time or default to current time
    const parseTime = (timeString?: string) => {
        if (!timeString) {
            const now = new Date();
            return {
                hours: now.getHours(),
                minutes: now.getMinutes()
            };
        }

        const [hours, minutes] = timeString.split(':').map(Number);
        return { hours: hours || 0, minutes: minutes || 0 };
    };

    const { hours: initialHours, minutes: initialMinutes } = parseTime(selectedTime);

    const [hours, setHours] = useState(initialHours);
    const [minutes, setMinutes] = useState(initialMinutes);
    const [period, setPeriod] = useState<'AM' | 'PM'>(initialHours >= 12 ? 'PM' : 'AM');

    // Convert 24h to 12h format for display
    const displayHours = use24Hour ? hours : (hours === 0 ? 12 : hours > 12 ? hours - 12 : hours);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
                setIsTimePickerOpen(false);
            }
        };

        if (isTimePickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isTimePickerOpen, setIsTimePickerOpen]);

    const adjustHours = (direction: 'up' | 'down') => {
        setHours(prev => {
            if (use24Hour) {
                if (direction === 'up') {
                    return prev === 23 ? 0 : prev + 1;
                } else {
                    return prev === 0 ? 23 : prev - 1;
                }
            } else {
                if (direction === 'up') {
                    return prev === 23 ? 0 : prev + 1;
                } else {
                    return prev === 0 ? 23 : prev - 1;
                }
            }
        });
    };

    const adjustMinutes = (direction: 'up' | 'down') => {
        setMinutes(prev => {
            if (direction === 'up') {
                return prev === 59 ? 0 : prev + 1;
            } else {
                return prev === 0 ? 59 : prev - 1;
            }
        });
    };

    const handlePeriodToggle = () => {
        setPeriod(prev => {
            const newPeriod = prev === 'AM' ? 'PM' : 'AM';
            // Adjust hours when period changes
            setHours(prevHours => {
                if (newPeriod === 'PM' && prevHours < 12) {
                    return prevHours + 12;
                } else if (newPeriod === 'AM' && prevHours >= 12) {
                    return prevHours - 12;
                }
                return prevHours;
            });
            return newPeriod;
        });
    };

    const handleTimeConfirm = () => {
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        if (onTimeSelect) {
            onTimeSelect(formattedTime);
        }
        setIsTimePickerOpen(false);
    };

    const generateQuickTimes = () => {
        const times = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 15) {
                times.push({ hours: h, minutes: m });
            }
        }
        return times;
    };

    const quickTimes = generateQuickTimes();

    const formatQuickTime = (h: number, m: number) => {
        if (use24Hour) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        } else {
            const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
            const period = h >= 12 ? 'PM' : 'AM';
            return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
        }
    };

    return (
        <div
            ref={timePickerRef}
            className="absolute bg-background rounded-lg border border-primary/20 shadow-lg z-50 top-10 left-0 min-w-[280px] p-4"
        >
            {/* Time Adjusters */}
            <div className="flex items-center justify-center gap-4 mb-4">
                {/* Hours */}
                <div className="flex flex-col items-center">
                    <Button
                        variant="ghost"
                        type="button"
                        size="sm"
                        onClick={() => adjustHours('up')}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                        <ChevronUp className="h-4 w-4" />
                    </Button>

                    <div className="text-2xl font-bold py-2 min-w-[60px] text-center border rounded">
                        {use24Hour ? hours.toString().padStart(2, '0') : displayHours.toString().padStart(2, '0')}
                    </div>

                    <Button
                        variant="ghost"
                        type="button"
                        size="sm"
                        onClick={() => adjustHours('down')}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>

                <div className="text-2xl font-bold">:</div>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                    <Button
                        variant="ghost"
                        type="button"
                        size="sm"
                        onClick={() => adjustMinutes('up')}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                        <ChevronUp className="h-4 w-4" />
                    </Button>

                    <div className="text-2xl font-bold py-2 min-w-[60px] text-center border rounded">
                        {minutes.toString().padStart(2, '0')}
                    </div>

                    <Button
                        variant="ghost"
                        type="button"
                        size="sm"
                        onClick={() => adjustMinutes('down')}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>

                {/* AM/PM Toggle */}
                {!use24Hour && (
                    <div className="flex flex-col items-center ml-2">
                        <div className="h-8"></div>
                        <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={handlePeriodToggle}
                            className="py-2 min-w-[50px] text-center hover:bg-primary/10"
                        >
                            {period}
                        </Button>
                        <div className="h-8"></div>
                    </div>
                )}
            </div>

            {/* Quick Select Times */}
            <div className="border-t border-primary/20 pt-4 mb-4">
                <h4 className="text-sm font-medium mb-2 text-center">{t("forms.time-input.quick-select")}</h4>
                <div className="grid grid-cols-4 gap-1 max-h-32 overflow-y-auto">
                    {[
                        { h: 9, m: 0 }, { h: 12, m: 0 }, { h: 13, m: 0 }, { h: 17, m: 0 },
                        { h: 18, m: 0 }, { h: 19, m: 0 }, { h: 20, m: 0 }, { h: 21, m: 0 }
                    ].map(({ h, m }) => (
                        <Button
                            key={`${h}-${m}`}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs p-1 h-auto hover:bg-primary/10"
                            onClick={() => {
                                setHours(h);
                                setMinutes(m);
                                setPeriod(h >= 12 ? 'PM' : 'AM');
                            }}
                        >
                            {formatQuickTime(h, m)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-primary/10"
                    onClick={() => setIsTimePickerOpen(false)}
                >
                    {t("buttons.cancel")}
                </Button>
                <Button
                    type="button"
                    size="sm"
                    className="flex-1"
                    onClick={handleTimeConfirm}
                >
                       {t("buttons.confirm")}
                </Button>
            </div>

            {/* Current Selection Display */}
            <div className="mt-3 pt-3 border-t border-primary/20 text-center">
                <p className="text-sm text-muted-foreground">
                    {t("forms.time-input.selected")}: {use24Hour
                        ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
                        : `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
                    }
                </p>
            </div>
        </div>
    );
}