interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  details?: string;
  metadata?: Record<string, any>;
}