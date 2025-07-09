
interface UserStats {
  user_id: string;
  habits_count: number;
  goals_count: number;
  friends_count: number;
  streak_days: number;
  total_activities: number;
  last_activity_at?: string;
  created_at: string;
  updated_at: string;
}

interface AdminLog {
  id: string;
  admin_user_id?: string;
  action: string;
  target_user_id?: string;
  timestamp: string;
  details?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
}

interface UserFilters {
  query?: string;
  status?: 'all' | 'active' | 'banned' | 'unconfirmed';
  provider?: 'all' | 'email' | 'google' | 'github';
  dateFrom?: string;
  dateTo?: string;
}

interface AdminUserStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  unconfirmedUsers: number;
  newUsersThisWeek: number;
}

// Common admin actions
enum AdminActions {
  USER_BANNED = 'user_banned',
  USER_UNBANNED = 'user_unbanned',
  USER_DELETED = 'user_deleted',
  PASSWORD_RESET_SENT = 'password_reset_sent',
  EMAIL_CONFIRMED = 'email_confirmed',
  USER_VIEWED = 'user_viewed',
  LOGS_VIEWED = 'logs_viewed',
  USERS_EXPORTED = 'users_exported',
}

// User activity actions
enum UserActions {
  LOGIN = 'login',
  LOGOUT = 'logout',
  HABIT_CREATED = 'habit_created',
  HABIT_COMPLETED = 'habit_completed',
  GOAL_CREATED = 'goal_created',
  GOAL_ACHIEVED = 'goal_achieved',
  FRIEND_ADDED = 'friend_added',
  PASSWORD_RESET_REQUESTED = 'password_reset_requested',
  PROFILE_UPDATED = 'profile_updated',
}

// API Response types
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}