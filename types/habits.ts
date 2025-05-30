interface HabitType {
    id: string
    title: string
    goal: string | null
    frequencyPerDay: number
    reminderTimes: string[]
    completedToday: number
    streak: number
    customMessage: string
    allowSkip: boolean
    category: string
    endDate: string | null
    visibility: "public" | "private"
    sharedWith?: string[]
}