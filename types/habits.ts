interface HabitsType {
    id: string
    title: string
    goal: string | null
    frequencyPerDay: number
    times: string[]
    completedToday: number
    streak: number
    customMessage: string
    allowSkip: boolean
    category: string
}