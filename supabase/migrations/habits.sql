create table public.habits (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  title text not null,
  goal uuid null,
  "frequencyPerDay" integer not null,
  "reminderTimes" text[] not null,
  "completedToday" integer null default 0,
  streak integer null default 0,
  "customMessage" text not null,
  "allowSkip" boolean not null default false,
  category text not null,
  "endDate" date null,
  visibility text not null,
  "sharedWith" uuid[] null,
  created_at timestamp with time zone null default now(),
  "weeklyFrequency" integer null default 7,
  "selectedDays" text[] null default '{}'::text[],
  "weeklyCompleted" bigint null,
  "startDate" date null,
  updated_at timestamp with time zone null,
  total_completed integer null default 0,
  total_missed integer null default 0,
  expected_count integer null default 0,
  completion_rate numeric null default 0.0,
  constraint habits_pkey primary key (id),
  constraint habits_goal_fkey foreign KEY (goal) references goals (id),
  constraint habits_user_id_fkey1 foreign KEY (user_id) references profiles (id),
  constraint habits_visibility_check check (
    (
      visibility = any (array['public'::text, 'private'::text])
    )
  )
) TABLESPACE pg_default;