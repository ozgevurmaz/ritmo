interface DatabaseType {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id?: string
                    name?: string
                    surname?: string
                    email?: string
                    username?: string
                    role?: string
                    avatar?: string | null
                    streak?: number
                    notifications?: number[]
                    messages?: number[]
                    timezone?: string | null
                    premium?: boolean
                    bio?: string
                }
                Insert: {
                    id?: string
                    name?: string
                    surname?: string
                    email?: string
                    username?: string
                    role?: string
                    avatar?: string | null
                    streak?: number
                    notifications?: number[]
                    messages?: number[]
                    timezone?: string | null
                    premium?: boolean
                    bio?: string
                }
                Update: Partial<DatabaseType['public']['Tables']['profiles']['Insert']>
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
