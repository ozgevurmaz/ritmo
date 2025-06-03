interface GoalType {
    id: string
    title: string
    description?: string
    motivation?: string
    habits: string[]
    startDate: string
    endDate: string
    complated:boolean
    complatedDays: number
    sharedWith?: string[]
    visibility: "public" | "private"
    category: string
    slug: string
}