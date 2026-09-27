create extension if not exists "pgcrypto";

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  sha256_hash text not null unique,
  doc_hash_bytes32 text not null,
  file_size_bytes integer,
  page_count integer,
  word_count integer,
  title text,
  parties text[] default '{}',
  governing_law text,
  overall_risk_score integer,
  overall_risk_level text,
  summary text,
  suggested_action text,
  analysis jsonb,
  wallet_address text,
  tx_hash text,
  contract_address text,
  chain_id integer,
  anchored boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.anchors (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references public.contracts(id) on delete cascade,
  sha256_hash text not null,
  tx_hash text not null,
  wallet_address text,
  contract_address text,
  chain_id integer,
  network text,
  created_at timestamptz default now()
);

alter table public.contracts enable row level security;
alter table public.anchors enable row level security;

drop policy if exists "service can manage contracts" on public.contracts;
drop policy if exists "service can manage anchors" on public.anchors;

create policy "service can manage contracts" on public.contracts for all using (true) with check (true);
create policy "service can manage anchors" on public.anchors for all using (true) with check (true);
