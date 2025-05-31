interface TodoType {
    id: string,
    title: string,
    type: "event" | "task",
    urgent: "High" | "Medium" | "Low",
    importance: "High" | "Medium" | "Low",
    deadline: string,
    time?: string | null,
    notifyBefore: string | null,
    completed: boolean,
    repeat: "never" | "daily" | "weekly" | "monthly" | "yearly",
    tags: string[],
    category: string
    visibility: "public" | "private"
    sharedWith?: string[]
    completedAt: string | null
}