"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import SingleGoalInfoCard from "./singleGoalInfoCardType"
import { useRouter } from "next/navigation"
import { HabitsCard } from "../Habits/HabitsCard"
import { useState } from "react"
import HabitsForm from "../Forms/habitForm"
import { useTranslations } from "next-intl"

export const GoalSection = ({
    goals,
    habits,
    title,
    icon: Icon,
    emptyMessage,
    showHabits = false,
    userId
}: {
    goals: GoalType[]
    habits: HabitType[]
    title: string
    icon: React.ElementType
    emptyMessage: string
    showHabits?: boolean
    userId: string
}) => {

    const t = useTranslations()
    const router = useRouter();
    const [editingHabit, setEditingHabit] = useState<HabitType | []>([])
    const [showHabitEdit, setShowHabitEdit] = useState<boolean>(false)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                    <Badge variant="secondary" className="ml-2 bg-goals/50">
                        {goals.length}
                    </Badge>
                </div>
            </div>

            {goals.length === 0 ? (
                <Card className="border-dashed border-2 border-muted-foreground/25">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-minted flex items-center justify-center mb-4">
                            <Icon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            {emptyMessage}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {goals.map((goal) => (
                        <Card key={goal.id} className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <SingleGoalInfoCard goal={goal} />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push(`/goals/edit/${goal.slug}`)}
                                        className="ml-4 flex items-center gap-2 hover:bg-goals"
                                    >
                                        <Edit className="h-4 w-4" />
                                        {t("forms.goal.edit-title")}
                                    </Button>
                                </div>
                            </CardHeader>

                            {showHabits && goal.habits.length > 0 && (
                                <CardContent className="pt-0">
                                    <div className="border-t border-border pt-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 rounded-full bg-habits opacity-60"></div>
                                            <h4 className="text-sm font-semibold text-habits uppercase tracking-wide">
                                                {t("goals.related-habits")}
                                            </h4>
                                            <Badge variant="outline" className="text-xs text-habits border-habits">
                                                {goal.habits.length}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {habits
                                                .filter(habit => goal.habits.includes(habit.id))
                                                .map((habit) => (
                                                    <HabitsCard
                                                        key={habit.id}
                                                        habit={habit}
                                                        showEdit={true}
                                                        showDelete={true}
                                                        editAction={() => {
                                                            setEditingHabit(habit)
                                                            setShowHabitEdit(true)
                                                        }}
                                                    />
                                                ))
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}
            <HabitsForm isOpen={showHabitEdit} setIsOpen={() => {
                setShowHabitEdit(false)
                setEditingHabit([])
            }}
                userId={userId}
            />
        </div>
    )
}