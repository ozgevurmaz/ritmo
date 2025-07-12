create table public.goals (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  title text not null,
  description text null,
  motivation text null,
  habits text[] null default '{}'::text[],
  "startDate" date not null,
  "endDate" date not null,
  "completedDays" integer null default 0,
  "sharedWith" text[] null default '{}'::text[],
  visibility text not null default 'private'::text,
  category text not null,
  created_at timestamp with time zone null default now(),
  completed boolean null default false,
  slug text null,
  updated_at timestamp with time zone null,
  perfect_days integer null default 0,
  missed_days integer null default 0,
  completion_rate numeric null default 0.0,
  constraint goals_pkey primary key (id),
  constraint goals_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE,
  constraint goals_visibility_check check (
    (
      visibility = any (array['public'::text, 'private'::text])
    )
  )
) TABLESPACE pg_default;