create table public.profiles (
  id uuid not null,
  name text null,
  username text null,
  avatar_url text null,
  role text null default 'client'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  streak bigint null default '0'::bigint,
  notifications bigint null default '0'::bigint,
  messages bigint null default '0'::bigint,
  surname text null,
  email character varying null,
  lang text null,
  theme text null default '''light'''::text,
  premium boolean not null default false,
  timezone text null,
  bio text null,
  constraint profiles_pkey primary key (id),
  constraint profiles_username_key unique (username),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id),
  constraint profiles_bio_check check ((length(bio) < 150)),
  constraint profiles_role_check check (
    (role = any (array['admin'::text, 'client'::text]))
  )
) TABLESPACE pg_default;

create trigger update_profiles_updated_at BEFORE
update on profiles for EACH row
execute FUNCTION update_user_stats ();