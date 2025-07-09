interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  banned_until?: string;
  raw_user_meta_data?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
  raw_app_meta_data?: {
    provider?: string;
    providers?: string[];
    role?: string;
  };
  username?: string;
  name?: string;
  surname?: string;
  avatar_url?: string;
  habits_count?: number;
  goals_count?: number;
  friends_count?: number;
  streak_days?: number;
  total_activities?: number;
  last_activity_at?: string;
  status: UserStatus;
}

type UserStatus = 'active' | 'banned' | 'unconfirmed';