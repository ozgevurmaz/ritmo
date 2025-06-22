"use client"

import CustomCalendar from "@/components/custom/customCalendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getGreetingKey } from "@/lib/utils";
import { ChevronLeft, ChevronRight, PlusCircle, Calendar, Target } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function WelcomeCard({
    name,
    selectedDate,
    handleDayChange,
    onDateSelect,
    setTodoFormOpen,
    setHabitFormOpen
}: {
    name: string,
    selectedDate: Date,
    handleDayChange: (count: number) => void
    onDateSelect?: (date: Date) => void,
    setTodoFormOpen?: () => void,
    setHabitFormOpen?: () => void,
}) {
    const t = useTranslations()
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const greetingKey = getGreetingKey();

    return (
        <Card className="mb-6 border-primary bg-gradient-to-br from-card to-primary/10">
            <CardContent className="py-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Ritmo</span>
                        </div>
                        <div className="flex">
                            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                                {t('welcome-card.greeting', {
                                    greeting: t(`welcome-card.${greetingKey}`),
                                    name
                                })}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-8 w-8 rounded-full transition-all duration-200 hover:scale-110"
                                onClick={() => handleDayChange(-1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 hover:text-primary transition-all duration-200"
                                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                >
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="font-medium">{formatDate(selectedDate)}</span>
                                </Button>

                                {isCalendarOpen && (
                                    <CustomCalendar
                                        isCalendarOpen={isCalendarOpen}
                                        setIsCalendarOpen={() => setIsCalendarOpen(false)}
                                        selectedDate={selectedDate}
                                        onDateSelect={(date: Date) => {
                                            onDateSelect?.(date);
                                        }}
                                    />
                                )}
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-8 w-8 rounded-full transition-all duration-200 hover:scale-110"
                                onClick={() => handleDayChange(1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">

                        <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent border-border hover:text-todos text-todos transition-all duration-200"
                            onClick={setTodoFormOpen}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            {t("todos.add-button")}
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            className="border-habits bg-transparent text-habits hover:text-habits transition-all duration-200"
                            onClick={setHabitFormOpen}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            {t("habits.add-button")}
                        </Button>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-primary/20">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                        <p className="text-sm italic text-muted-foreground font-medium">
                            {t("welcome-card.quote")}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}