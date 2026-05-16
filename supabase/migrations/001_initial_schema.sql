-- Personal OS — initial schema
-- Run this in your Supabase SQL editor to set up the database.

-- ─── Tasks ───────────────────────────────────────────────────────────────────
create table if not exists tasks (
  id           text primary key default gen_random_uuid()::text,
  title        text not null,
  description  text,
  category     text not null check (category in (
    'content','products','business_ops','finance','personal','legal','opportunities'
  )),
  priority     text not null check (priority in ('p1','p2','p3','p4')) default 'p3',
  status       text not null check (status in (
    'today','this_week','this_month','backlog','archived'
  )) default 'today',
  starred      boolean not null default false,
  notes        text,
  created_at   timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists tasks_status_idx   on tasks(status);
create index if not exists tasks_category_idx on tasks(category);
create index if not exists tasks_starred_idx  on tasks(starred) where starred = true;

-- Row Level Security (enable after adding auth)
alter table tasks enable row level security;

-- Allow all access while unauthenticated (development only — tighten after adding auth)
create policy "allow_all_dev" on tasks for all using (true) with check (true);


-- ─── Habits ──────────────────────────────────────────────────────────────────
create table if not exists habits (
  id         text primary key default gen_random_uuid()::text,
  name       text not null,
  subtasks   jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists habit_completions (
  id                 text primary key default gen_random_uuid()::text,
  habit_id           text references habits(id) on delete cascade,
  date               date not null,
  subtasks_completed jsonb not null default '[]',
  created_at         timestamptz not null default now(),
  unique(habit_id, date)
);


-- ─── Journal ─────────────────────────────────────────────────────────────────
create table if not exists journal_entries (
  id         text primary key default gen_random_uuid()::text,
  content    text not null,
  summary    text,
  date       date not null default current_date,
  created_at timestamptz not null default now()
);


-- ─── Goals ───────────────────────────────────────────────────────────────────
create table if not exists goals (
  id         text primary key default gen_random_uuid()::text,
  title      text not null,
  type       text not null check (type in ('weekly','monthly','yearly')),
  completed  boolean not null default false,
  due_date   date,
  created_at timestamptz not null default now()
);


-- ─── Nutrition ───────────────────────────────────────────────────────────────
create table if not exists nutrition_logs (
  id         text primary key default gen_random_uuid()::text,
  meal_name  text not null,
  calories   int,
  protein_g  int,
  logged_at  timestamptz not null default now(),
  date       date not null default current_date
);


-- ─── Health metrics ──────────────────────────────────────────────────────────
create table if not exists health_metrics (
  id             text primary key default gen_random_uuid()::text,
  date           date not null unique,
  sleep_hours    numeric(4,2),
  hrv            int,
  resting_hr     int,
  steps          int,
  weight_kg      numeric(5,2),
  notes          text,
  created_at     timestamptz not null default now()
);


-- ─── Finance snapshots ───────────────────────────────────────────────────────
create table if not exists finance_snapshots (
  id              text primary key default gen_random_uuid()::text,
  date            date not null unique,
  net_worth       bigint,        -- stored in cents
  daily_revenue   bigint,
  monthly_revenue bigint,
  notes           text,
  created_at      timestamptz not null default now()
);
