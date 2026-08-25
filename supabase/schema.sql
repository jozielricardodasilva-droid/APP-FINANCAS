-- ============================================================================
-- App Finanças — schema inicial
-- Execute este arquivo no SQL Editor do seu projeto Supabase
-- (Project > SQL Editor > New query > cole o conteúdo > Run)
-- ============================================================================

-- Extensão usada para gerar UUIDs
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Tabela: transactions
-- ----------------------------------------------------------------------------
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null check (type in ('income', 'expense')),
  amount      numeric(12, 2) not null check (amount > 0),
  category    text not null,
  description text,
  date        date not null default current_date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Índices para acelerar filtros por usuário, período e categoria
create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_user_date_idx on public.transactions (user_id, date desc);
create index if not exists transactions_user_category_idx on public.transactions (user_id, category);

-- Mantém updated_at sempre atualizado
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_transactions_updated_at on public.transactions;
create trigger set_transactions_updated_at
  before update on public.transactions
  for each row
  execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security: cada usuário só acessa suas próprias transações
-- ----------------------------------------------------------------------------
alter table public.transactions enable row level security;

drop policy if exists "Usuários podem ver suas transações" on public.transactions;
create policy "Usuários podem ver suas transações"
  on public.transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Usuários podem inserir suas transações" on public.transactions;
create policy "Usuários podem inserir suas transações"
  on public.transactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuários podem atualizar suas transações" on public.transactions;
create policy "Usuários podem atualizar suas transações"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Usuários podem excluir suas transações" on public.transactions;
create policy "Usuários podem excluir suas transações"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Privilégios de tabela: sem estes GRANTs, o PostgREST recusa qualquer
-- acesso (erro 42501) mesmo com RLS configurado corretamente. RLS decide
-- QUAIS linhas o usuário autenticado vê; os GRANTs decidem SE ele pode
-- tentar. Apenas "authenticated" tem acesso — o app exige login para tudo.
-- ----------------------------------------------------------------------------
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;
