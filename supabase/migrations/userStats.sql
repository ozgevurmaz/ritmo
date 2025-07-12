create table public.user_stats (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  habits_count integer null default 0,
  goals_count integer null default 0,
  friends_count integer null default 0,
  streak_days integer null default 0,
  total_activities integer null default 0,
  last_activity_at timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  consistency_score integer null default 0,
  perfect_days integer null default 0,
  missed_days integer null default 0,
  total_completed_activities integer null default 0,
  habit_heatmap jsonb null,
  category_success jsonb null,
  constraint user_stats_pkey primary key (id),
  constraint user_stats_user_id_key unique (user_id),
  constraint user_stats_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger update_user_stats_updated_at BEFORE
update on user_stats for EACH row
execute FUNCTION update_user_stats ();