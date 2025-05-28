import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Flame } from "lucide-react";

interface HabitsCheckboxType {
    habit: HabitsType
    decrementHabit: () => void
    incrementHabit: () => void
}

export default function HabitsCheckbox({ habit, decrementHabit, incrementHabit }: HabitsCheckboxType) {
    return (
        <div key={habit.id} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground flex items-center gap-2">
                        {habit.title}
                        {habit.goal && (
                            <span className="text-xs text-goal bg-goal/10 px-2 py-0.5 rounded-full">
                                <span className="text-goals font-semibold">Goal:</span> {habit.goal}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: habit.frequencyPerDay }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (index < habit.completedToday) {
                                            decrementHabit();
                                        } else if (index === habit.completedToday) {
                                            incrementHabit();
                                        }
                                    }}
                                    className="transition-colors"
                                >
                                    {index < habit.completedToday ? (
                                        <CheckCircle2 className="h-4 w-4 text-habit" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground hover:text-habit" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {habit.completedToday}/{habit.frequencyPerDay}
                        </span>
                    </div>
                </div>
                {habit.streak > 0 && (
                    <Badge variant="outline" className="text-xs text-habit border-habit">
                        <Flame className="w-4 h-4" /> {habit.streak} day streak
                    </Badge>
                )}
            </div>
        </div>)
}