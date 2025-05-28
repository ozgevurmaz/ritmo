interface GoalType {
    id: string
    title: string
    description: string
    motivation: string
    habits: string[]
    startDate: string
    endDate: string
    completedDays: number
    sharedWith: string[]
    visibility: "public" | "private"
    category: string
}