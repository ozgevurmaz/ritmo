"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Flame, Edit } from "lucide-react"
import { CustomProgress } from "@/components/custom/customProgress"
import HabitsForm from "../Forms/habitForm"
import { useState } from "react"

export const HabitCard = ({ habit, userId }: { habit: HabitType, userId: string }) => {
    const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false)
    const progressPercent = Math.round((habit.completedToday / habit.frequencyPerDay) * 100)

    return (
        <Card className="bg-background/50 border border-border/50 hover:border-border transition-all duration-200">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-habits"></div>
                            <h5 className="font-medium text-sm text-habits">{habit.title}</h5>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                <span>{habit.completedToday}/{habit.frequencyPerDay} today</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                <span>{habit.streak} day streak</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditFormOpen(true)}
                            className="h-7 w-7 p-0 hover:bg-muted hover:text-habits "
                        >
                            <Edit className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                <CustomProgress
                    value={progressPercent}
                    backgroundColor="bg-habits/20"
                    fillColor="bg-habits"
                    textColor="text-habits"
                    headerPosition="outside-end"
                    animated
                    showPercentage
                />

            </CardContent>

            <HabitsForm isOpen={isEditFormOpen} setIsOpen={() => setIsEditFormOpen(false)} editingHabit={habit} userId={userId} />
        </Card>
    )
}