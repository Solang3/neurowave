-- ==========================================
-- NEUROWAVE — Schema de Supabase
-- Ejecutá esto en el SQL Editor de tu
-- proyecto en supabase.com
-- ==========================================

-- Perfiles de usuario (extiende auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Suscripciones
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  provider text not null check (provider in ('mercadopago', 'paypal')),
  provider_subscription_id text unique,
  status text not null default 'free' check (status in ('free', 'pro', 'cancelled', 'expired')),
  currency text check (currency in ('ARS', 'USD')),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Playlists
create table public.playlists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  wave_type text not null check (wave_type in ('delta', 'theta', 'alpha', 'beta', 'gamma')),
  use_case text,
  cover_emoji text,
  is_pro boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Tracks
create table public.tracks (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid references public.playlists on delete cascade,
  title text not null,
  wave_type text not null check (wave_type in ('delta', 'theta', 'alpha', 'beta', 'gamma')),
  duration_seconds int,
  audio_path text not null,   -- path en Supabase Storage
  is_pro boolean default false,
  sort_order int default 0,
  play_count int default 0,
  created_at timestamptz default now()
);

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.playlists enable row level security;
alter table public.tracks enable row level security;

-- Profiles: cada usuario solo ve el suyo
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Subscriptions: cada usuario solo ve la suya
create policy "Users can view own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

-- Playlists: todos ven las free, solo Pro ve las Pro
create policy "Anyone can view free playlists"
  on public.playlists for select
  using (
    is_pro = false
    or exists (
      select 1 from public.subscriptions
      where user_id = auth.uid() and status = 'pro'
    )
  );

-- Tracks: mismo criterio que playlists
create policy "Anyone can view free tracks"
  on public.tracks for select
  using (
    is_pro = false
    or exists (
      select 1 from public.subscriptions
      where user_id = auth.uid() and status = 'pro'
    )
  );

-- ==========================================
-- Storage bucket para los audios
-- ==========================================

-- Crear bucket 'audio' en Storage > New bucket
-- Configurarlo como privado (Private)
-- Los archivos se sirven con URLs firmadas desde la API

-- ==========================================
-- Trigger para crear perfil automáticamente
-- al registrarse un nuevo usuario
-- ==========================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
