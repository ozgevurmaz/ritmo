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
    startDate: string
    endDate: string | null
    visibility: "public" | "private"
    sharedWith?: string[]
    selectedDays: string[]
    weeklyFrequency: number
    weeklyCompleted: number
}

interface HabitFormValues {
    id: string
    title: string
    goal: string | null
    frequencyPerDay: number
    reminderTimes: string[]
    customMessage: string
    allowSkip: boolean
    category: string
    startDate: string
    endDate: string
    visibility: 'public' | 'private'
    sharedWith: string[]
    weeklyFrequency: number
    selectedDays: string[]
}