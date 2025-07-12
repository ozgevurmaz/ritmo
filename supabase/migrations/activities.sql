create table public.activity_logs (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  action character varying(100) not null,
  timestamp timestamp with time zone null default now(),
  ip_address inet null,
  user_agent text null,
  details text null,
  metadata jsonb null default '{}'::jsonb,
  constraint activity_logs_pkey primary key (id),
  constraint activity_logs_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_activity_logs_user_id on public.activity_logs using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_activity_logs_timestamp on public.activity_logs using btree ("timestamp") TABLESPACE pg_default;

create index IF not exists idx_activity_logs_action on public.activity_logs using btree (action) TABLESPACE pg_default;