"use client"

import CustomCalendar from "@/components/customCalendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ChevronLeft, ChevronRight, PlusCircle, Calendar, Target } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function WelcomeCard({
    name,
    selectedDate,
    handleDayChange,
    onAddTodo,
    onAddHabit,
    onDateSelect,
}: {
    name: string,
    selectedDate: Date,
    handleDayChange: (count: number) => void
    onAddTodo?: () => void,
    onAddHabit?: () => void
    onDateSelect?: (date: Date) => void,
}) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const formatDate = (selectedDate: Date) => {
        return selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <Card className="mb-6 border-primary bg-gradient-to-br from-card to-primary/10">
            <CardContent className="py-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Ritmo Dashboard</span>
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-3">
                            {getGreeting()}, {name}
                        </h1>

                        <div className="flex items-center gap-2 text-sm">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-8 w-8 hover:bg-primary/10 rounded-full transition-all duration-200 hover:scale-110"
                                onClick={() => handleDayChange(-1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200"
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
                                className="p-1 h-8 w-8 hover:bg-primary/10 rounded-full transition-all duration-200 hover:scale-110"
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
                            className="border-activities bg-activities/10 text-activities hover:bg-activities hover:text-primary-foreground transition-all duration-200"
                        >
                            <Bell className="h-4 w-4 mr-2" />
                            Alerts
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            className="border-todos bg-todos/10 text-todos hover:bg-todos hover:text-primary-foreground transition-all duration-200"
                            onClick={onAddTodo}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Todo
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            className="border-habits bg-habits/10 text-habits hover:bg-habits hover:text-primary-foreground transition-all duration-200"
                            onClick={onAddHabit}
                        >
                            <Target className="h-4 w-4 mr-2" />
                            Add Habit
                        </Button>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-primary/20">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                        <p className="text-sm italic text-muted-foreground font-medium">
                            "Discipline is choosing between what you want now and what you want most."
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}