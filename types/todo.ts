interface TodoType {
    id: string,
    title: string,
    urgent: "High" | "Medium" | "Low",
    importance: "High" | "Medium" | "Low",
    deadline: string,
    time?: string | null,
    notifyBefore: string,
    completed: boolean,
    repeat: "never" | "daily" | "weekly" | "monthly" | "yearly",
    tags: string[],
    category: string
    visibility: "public" | "private"
    sharedWith?: string[]
}