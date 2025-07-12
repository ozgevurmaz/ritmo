create table public.admin_logs (
  id uuid not null default gen_random_uuid (),
  admin_user_id uuid null,
  action character varying(100) not null,
  target_user_id uuid null,
  timestamp timestamp with time zone null default now(),
  details text null,
  metadata jsonb null default '{}'::jsonb,
  ip_address inet null,
  constraint admin_logs_pkey primary key (id),
  constraint admin_logs_admin_user_id_fkey foreign KEY (admin_user_id) references auth.users (id) on delete set null,
  constraint admin_logs_target_user_id_fkey foreign KEY (target_user_id) references auth.users (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_admin_logs_admin_user_id on public.admin_logs using btree (admin_user_id) TABLESPACE pg_default;

create index IF not exists idx_admin_logs_target_user_id on public.admin_logs using btree (target_user_id) TABLESPACE pg_default;

create index IF not exists idx_admin_logs_timestamp on public.admin_logs using btree ("timestamp" desc) TABLESPACE pg_default;

create index IF not exists idx_admin_logs_action on public.admin_logs using btree (action) TABLESPACE pg_default;