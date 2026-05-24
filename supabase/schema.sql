create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  amount numeric(10, 2) not null,
  kind text not null check (kind in ('income', 'expense')),
  category text not null default 'Altro',
  icon text not null default '✨',
  created_at timestamptz default now() not null
);

alter table transactions enable row level security;

create policy "Users can manage their own transactions"
  on transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index transactions_user_id_created_at on transactions (user_id, created_at desc);
