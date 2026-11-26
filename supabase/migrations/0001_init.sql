-- HumanSays initial schema. Source: HUMANSAYS_BUILD_SPEC.md section 5.
-- Owner: Robiu (database layer), reviewed by Opeyemi.
-- Apply with the Supabase SQL editor or the Supabase CLI. Run on BOTH staging and production projects.
-- Money is integer STROOPS (bigint). 1 Pi = 10,000,000 stroops.

create table users (
  uid text primary key,                    -- VERIFIED Pi uid from /me
  username text not null,
  is_admin boolean not null default false,
  is_blocked boolean not null default false,
  country text,                            -- optional, self-declared (ISO code)
  age_range text check (age_range in ('18-24','25-34','35-44','45-54','55+')),
  demographics_consent_at timestamptz,
  reputation int not null default 0,
  streak_days int not null default 0,
  last_active_date date,
  created_at timestamptz not null default now()
);

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_uid text not null references users(uid),
  title text not null,
  description text,
  status text not null check (status in ('draft','pending_review','live','paused','full','closed','rejected')),
  target_responses int not null check (target_responses > 0),
  reward_stroops bigint not null check (reward_stroops > 0),   -- per approved response
  fee_bps int not null,                                        -- platform fee when created
  est_minutes int not null default 3,
  min_tier int not null default 0,
  filter_countries text[],                                     -- null = everyone
  filter_age_ranges text[],
  closes_at timestamptz,
  moderation_note text,
  escrow_locked_stroops bigint not null default 0,
  created_at timestamptz not null default now(),
  launched_at timestamptz,
  closed_at timestamptz
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  position int not null,
  type text not null check (type in ('single','multi','rating','yes_no','short_text','number','crowd_predict')),
  prompt text not null,
  required boolean not null default true,
  config jsonb not null default '{}',          -- options[], min/max, etc.
  is_attention_check boolean not null default false,
  expected_answer jsonb                        -- for attention checks only
);

create table responses (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id),
  user_uid text not null references users(uid),
  status text not null check (status in ('in_progress','submitted','approved','flagged','rejected')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  duration_s int,
  flags text[] not null default '{}',
  quality jsonb not null default '{}',
  unique (campaign_id, user_uid)               -- one response per person per poll
);

create table answers (
  response_id uuid references responses(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  value jsonb not null,
  primary key (response_id, question_id)
);

create table payment_intents (                 -- server-created BEFORE Pi.createPayment
  id uuid primary key default gen_random_uuid(),
  uid text not null references users(uid),
  kind text not null check (kind in ('topup')),
  amount_stroops bigint not null check (amount_stroops > 0),
  status text not null check (status in ('created','approved','completed','cancelled','failed')),
  pi_payment_id text unique,
  txid text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Double-entry ledger. Every tx_id must sum to zero across its entries (enforced in code + tests).
create table ledger_entries (
  id bigserial primary key,
  tx_id uuid not null,
  account text not null,                       -- see spec 8.1
  delta_stroops bigint not null,
  kind text not null,
  ref_type text,
  ref_id text,
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  unique (idempotency_key, account)
);

create table payout_requests (
  id uuid primary key default gen_random_uuid(),
  uid text not null references users(uid),
  amount_stroops bigint not null check (amount_stroops > 0),
  status text not null check (status in ('requested','processing','completed','failed','cancelled')),
  pi_payment_id text unique,
  txid text,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table prediction_events (               -- platform-created Events
  id uuid primary key default gen_random_uuid(),
  title text not null,
  options jsonb not null,
  closes_at timestamptz not null,
  resolves_at timestamptz,
  status text not null check (status in ('open','closed','resolved','void')),
  winning_option text,
  resolution_note text
);

create table predictions (
  id uuid primary key default gen_random_uuid(),
  user_uid text not null references users(uid),
  event_id uuid references prediction_events(id),          -- Event prediction, OR
  question_id uuid references questions(id),               -- Crowd prediction
  choice text not null,
  status text not null default 'open' check (status in ('open','won','lost','void')),
  rep_delta int not null default 0,
  created_at timestamptz not null default now(),
  check ((event_id is null) <> (question_id is null)),
  unique (user_uid, event_id),
  unique (user_uid, question_id)
);

create table ai_cache (
  key text primary key,
  value jsonb not null,
  created_at timestamptz not null default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_uid text,
  target_type text,
  target_id text,
  reason text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table audit_log (
  id bigserial primary key,
  actor_uid text,
  action text not null,
  target text,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- Indexes (spec section 5)
create index idx_responses_campaign_status on responses (campaign_id, status);
create index idx_responses_user on responses (user_uid);
create index idx_ledger_account on ledger_entries (account);
create index idx_predictions_user on predictions (user_uid);
create index idx_campaigns_status on campaigns (status);

-- SECURITY: Row Level Security ON for every table with NO policies = deny all.
-- Only the server (service role key) can touch data. The browser never talks to Supabase.
alter table users              enable row level security;
alter table campaigns          enable row level security;
alter table questions          enable row level security;
alter table responses          enable row level security;
alter table answers            enable row level security;
alter table payment_intents    enable row level security;
alter table ledger_entries     enable row level security;
alter table payout_requests    enable row level security;
alter table prediction_events  enable row level security;
alter table predictions        enable row level security;
alter table ai_cache           enable row level security;
alter table reports            enable row level security;
alter table audit_log          enable row level security;
