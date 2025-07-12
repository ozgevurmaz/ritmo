create table public.reset_logs (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  reset_type text not null,
  status text not null,
  error_message text null,
  execution_time_ms integer null,
  reset_timestamp timestamp with time zone null default now(),
  created_at timestamp with time zone null default now(),
  details text null,
  constraint reset_logs_pkey primary key (id),
  constraint reset_logs_user_id_fkey1 foreign KEY (user_id) references profiles (id),
  constraint reset_logs_status_check check (
    (
      status = any (
        array[
          'success'::text,
          'failed'::text,
          'in_progress'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_reset_logs_user_id on public.reset_logs using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_reset_logs_status on public.reset_logs using btree (status) TABLESPACE pg_default;

create index IF not exists idx_reset_logs_reset_timestamp on public.reset_logs using btree (reset_timestamp) TABLESPACE pg_default;

create index IF not exists idx_reset_logs_reset_type on public.reset_logs using btree (reset_type) TABLESPACE pg_default;

create trigger cleanup_logs_trigger
after INSERT on reset_logs for EACH row
execute FUNCTION trigger_cleanup_logs ();