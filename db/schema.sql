-- Portfolio admin panel schema.
-- Safe to run more than once: every statement is idempotent.
-- Paste this whole file into the Supabase SQL editor (or run `npm run db:migrate`).

create extension if not exists pgcrypto;

-- Administrators -------------------------------------------------------------

create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  name          text not null default '',
  password_hash text not null,
  created_at    timestamptz not null default now(),
  last_login_at timestamptz
);

-- Only a SHA-256 hash of each session token is stored, never the token itself.
create table if not exists admin_sessions (
  token_hash   text primary key,
  user_id      uuid not null references admin_users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  expires_at   timestamptz not null,
  user_agent   text not null default '',
  ip_hash      text not null default ''
);
create index if not exists admin_sessions_user_idx on admin_sessions(user_id);

create table if not exists login_attempts (
  id         bigserial primary key,
  ip_hash    text not null,
  email      text not null,
  success    boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists login_attempts_recent_idx on login_attempts(created_at desc);

-- Site settings: one row per editable area (hero, about, appearance, ...).
-- `draft` is what the admin edits; `published` is what visitors see.
create table if not exists site_settings (
  key          text primary key,
  draft        jsonb not null,
  published    jsonb,
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

-- Collections ------------------------------------------------------------------

create table if not exists projects (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  title      text not null,
  published  boolean not null default false,
  sort_order integer not null default 0,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  published  boolean not null default true,
  sort_order integer not null default 0,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists skill_groups (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  published  boolean not null default true,
  sort_order integer not null default 0,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists testimonials (
  id         uuid primary key default gen_random_uuid(),
  title      text not null, -- the person's name
  published  boolean not null default false,
  sort_order integer not null default 0,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Media library: images are stored already resized and converted to WebP.
create table if not exists media (
  id         uuid primary key default gen_random_uuid(),
  filename   text not null,
  alt        text not null default '',
  folder     text not null default 'General',
  mime       text not null,
  width      integer not null,
  height     integer not null,
  size       integer not null,
  version    integer not null default 1,
  data       bytea not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists media_folder_idx on media(folder);

-- Contact form -------------------------------------------------------------------

create table if not exists contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null default '',
  message    text not null,
  is_read    boolean not null default false,
  ip_hash    text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists contact_submissions_created_idx on contact_submissions(created_at desc);

-- Audit trail of every change made in the admin panel.
create table if not exists activity_log (
  id          bigserial primary key,
  user_id     uuid references admin_users(id) on delete set null,
  action      text not null,
  entity      text not null,
  entity_id   text,
  summary     text not null,
  created_at  timestamptz not null default now()
);
create index if not exists activity_log_created_idx on activity_log(created_at desc);

-- Lock everything down for Supabase's public API. The site talks to the
-- database only from the server with a direct connection, so the anon and
-- authenticated API roles get no access at all.
alter table admin_users         enable row level security;
alter table admin_sessions      enable row level security;
alter table login_attempts      enable row level security;
alter table site_settings       enable row level security;
alter table projects            enable row level security;
alter table services            enable row level security;
alter table skill_groups        enable row level security;
alter table testimonials        enable row level security;
alter table media               enable row level security;
alter table contact_submissions enable row level security;
alter table activity_log        enable row level security;
