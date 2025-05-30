interface DatabaseType {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    name: string
                    surname: string
                    email: string
                    username: string
                    role: string
                    avatar: string | null
                    streak: number
                    notifications: number[]
                    messages: number[]
                }
                Insert: {
                    id: string
                    name: string
                    surname: string
                    email: string
                    username: string
                    role: string
                    avatar?: string | null
                    streak?: number
                    notifications?: number[]
                    messages?: number[]
                }
                Update: Partial<DatabaseType['public']['Tables']['profiles']['Insert']>
            }

            todos: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    urgent: "High" | "Medium" | "Low"
                    importance: "High" | "Medium" | "Low"
                    deadline: string
                    time: string
                    notifyBefore: string
                    completed: boolean
                    repeat: "never" | "daily" | "weekly" | "monthly" | "yearly"
                    tags: string[]
                    category: string
                    visibility: "public" | "private"
                    sharedWith: string[] | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    urgent: "High" | "Medium" | "Low"
                    importance: "High" | "Medium" | "Low"
                    deadline: string
                    time: string
                    notifyBefore: string
                    completed?: boolean
                    repeat?: "never" | "daily" | "weekly" | "monthly" | "yearly"
                    tags?: string[]
                    category: string
                    visibility?: "public" | "private"
                    sharedWith?: string[] | null
                    created_at?: string
                }
                Update: Partial<DatabaseType['public']['Tables']['todos']['Insert']>
            }

            habits: {
                Row: {
                    id: string
                    user_id: string
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
                    sharedWith: string[] | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    goal?: string | null
                    frequencyPerDay: number
                    reminderTimes: string[]
                    completedToday?: number
                    streak?: number
                    customMessage: string
                    allowSkip: boolean
                    category: string
                    endDate?: string | null
                    visibility: "public" | "private"
                    sharedWith?: string[] | null
                    created_at?: string
                }
                Update: Partial<DatabaseType["public"]["Tables"]["habits"]["Insert"]>
            }

            goals: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description?: string | null
                    motivation?: string | null
                    habits: string[]
                    start_date: string
                    end_date: string
                    completed_days: number
                    shared_with?: string[] | null
                    visibility: "public" | "private"
                    category: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    motivation?: string | null
                    habits?: string[]
                    start_date: string
                    end_date: string
                    completed_days?: number
                    shared_with?: string[] | null
                    visibility?: "public" | "private"
                    category: string
                    created_at?: string
                }
                Update: Partial<DatabaseType["public"]["Tables"]["goals"]["Insert"]>
            }
        }
    }
}
