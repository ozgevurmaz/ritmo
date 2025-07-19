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
                    lang?: string
                    theme?: string
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
                    lang?: string
                    theme?: string
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
                    startDate: string | null
                    endDate: string | null
                    visibility: "public" | "private"
                    sharedWith: string[] | null
                    created_at: string
                    weeklyFrequency: number
                    selectedDays: string[] | null
                    weeklyCompleted: number | null
                    total_completed: number
                    total_missed: number
                    expected_count: number
                    completion_rate: number
                }
                Insert: {
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
                    startDate: string | null
                    endDate: string | null
                    visibility: "public" | "private"
                    sharedWith: string[] | null
                    created_at: string
                    weeklyFrequency: number
                    selectedDays: string[] | null
                    weeklyCompleted: number | null
                    total_completed: number
                    total_missed: number
                    expected_count: number
                    completion_rate: number
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
                    completed: boolean
                    slug: string
                    perfect_days: number
                    missed_days: number
                    completion_rate: number
                }
                Insert: {
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
                    completed: boolean
                    slug: string
                    perfect_days: number
                    missed_days: number
                    completion_rate: number
                }
                Update: Partial<DatabaseType["public"]["Tables"]["goals"]["Insert"]>
            }

            activity_logs: {
                Row: {
                    id: string
                    user_id: string | null
                    action: string
                    timestamp: string | null
                    ip_address: string | null
                    user_agent: string | null
                    details: string | null
                    metadata: Record<string, any> | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    action: string
                    timestamp?: string | null
                    ip_address?: string | null
                    user_agent?: string | null
                    details?: string | null
                    metadata?: Record<string, any> | null
                }
                Update: Partial<DatabaseType["public"]["Tables"]["activity_logs"]["Insert"]>
            }

            admin_logs: {
                Row: {
                    id: string
                    admin_user_id: string | null
                    action: string
                    target_user_id: string | null
                    timestamp: string | null
                    ip_address: string | null
                    details: string | null
                    metadata: Record<string, any> | null
                }
                Insert: {
                    id: string
                    admin_user_id: string | null
                    action: string
                    target_user_id: string | null
                    timestamp: string | null
                    ip_address: string | null
                    details: string | null
                    metadata: Record<string, any> | null
                }
                Update: Partial<DatabaseType["public"]["Tables"]["admin_logs"]["Insert"]>
            }

            admin_user_overview: {
                Row: {
                    id: string
                    email: string
                    created_at: string
                    last_sign_in_at: string | null
                    email_confirmed_at: string | null
                    banned_until: string | null
                    raw_user_meta_data: Record<string, any> | null
                    raw_app_meta_data: Record<string, any> | null
                    username: string | null
                    name: string | null
                    surname: string | null
                    avatar_url: string | null
                    habits_count: number | null
                    goals_count: number | null
                    friends_count: number | null
                    streak_days: number | null
                    total_activities: number | null
                    last_activity_at: string | null
                    status: "banned" | "unconfirmed" | "active"
                }
            }

            friends: {
                Row: {
                    id?: string
                    user_id: string
                    friend_id: string
                    status?: 'pending' | 'accepted' | 'rejected'
                    created_at?: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    friend_id: string
                    status?: 'pending' | 'accepted' | 'rejected'
                    created_at?: string
                }
                Update: Partial<DatabaseType["public"]["Tables"]["friends"]["Insert"]>
            }
            reset_logs: {
                Row: {
                    id?: string
                    user_id: string
                    reset_type?: string
                    status: string
                    error_message?: string
                    execution_time_ms: number
                    reset_timestamp: string
                    details?: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    reset_type?: string
                    status: string
                    error_message?: string
                    execution_time_ms: number
                    reset_timestamp: string
                    details?: string
                }
                Update: Partial<DatabaseType["public"]["Tables"]["reset_logs"]["Insert"]>
            }

            user_stats: {
                Row: {
                    id?: string
                    user_id: string
                    habits_count: number
                    goals_count: number
                    friends_count: number
                    streak_days: number
                    total_activities: number
                    last_activity_at: number
                    consistency_score: number
                    perfect_days: number
                    missed_days: number
                    total_completed_activities: number
                    habit_heatmap: Record<string, any> | null
                    category_success: Record<string, any> | null
                }
            }
        }
    }
}
