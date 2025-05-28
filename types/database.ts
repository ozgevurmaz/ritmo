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
        }
    }
}
