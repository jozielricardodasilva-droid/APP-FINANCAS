# App Finanças

Web app de gestão financeira pessoal: registre receitas e despesas, categorize,
filtre por período/categoria e acompanhe um dashboard com resumo mensal e
gráfico de despesas por categoria.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS · shadcn/ui ·
Supabase (Auth + PostgreSQL + RLS) · Recharts · Vercel

## 1. Pré-requisitos

- Node.js 20+
- Uma conta gratuita em [supabase.com](https://supabase.com)

## 2. Criar o projeto no Supabase

1. Em [app.supabase.com](https://app.supabase.com), crie um novo projeto.
2. Vá em **SQL Editor → New query**, cole o conteúdo de
   [`supabase/schema.sql`](supabase/schema.sql) e execute (**Run**). Isso cria
   a tabela `transactions`, os índices e as políticas de Row Level Security
   (cada usuário só enxerga e altera suas próprias transações).
3. Em **Project Settings → API**, copie a **Project URL** e a chave
   **anon public**.
4. Em **Authentication → Providers**, confirme que **Email** está habilitado
   (é o padrão). Se quiser pular a confirmação por e-mail durante testes,
   desative "Confirm email" em **Authentication → Sign In / Providers**.

## 3. Configurar variáveis de ambiente

Copie o exemplo e preencha com os dados do passo anterior:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-publica
```

## 4. Rodar localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). A rota raiz redireciona
para `/login` (ou `/dashboard` se já houver sessão). Crie uma conta em
`/signup` para começar.

## 5. Deploy na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os mesmos valores do `.env.local`.
4. Deploy. A cada push na branch principal a Vercel republica automaticamente.

## Estrutura do projeto

```
src/
  app/
    (auth)/          # login, signup e server actions de autenticação
    (app)/            # área logada (layout protegido)
      dashboard/       # resumo mensal + gráfico + últimas transações
      transactions/     # listagem com filtros + CRUD completo
  components/         # componentes de UI e de domínio (shadcn/ui + custom)
  lib/
    supabase/         # clients Supabase (browser, server, middleware/proxy)
    queries.ts        # leitura de transações/resumo/agrupamento por categoria
    categories.ts      # categorias fixas e paleta de cores
    types.ts, format.ts, periods.ts
  proxy.ts            # protege rotas privadas e redireciona usuários logados
supabase/
  schema.sql          # schema + RLS, execute no SQL Editor do Supabase
```

## Funcionalidades

- Autenticação por e-mail/senha (Supabase Auth), rotas protegidas via `proxy.ts`
- Cadastro de transações: tipo, valor, data, categoria, descrição
- Edição e exclusão de transações
- Filtros por período (mês atual, mês passado, últimos 30 dias, ano, período
  personalizado), categoria e tipo (receita/despesa)
- Dashboard com total de receitas, despesas e saldo do mês
- Gráfico de despesas por categoria (Recharts, donut chart)
- Layout responsivo (sidebar no desktop, navegação inferior no mobile)
- Row Level Security no banco: cada usuário só acessa seus próprios dados

## Próximos passos sugeridos

- Exportação de relatórios (CSV/PDF), citada como diferencial na persona
- Metas de gastos por categoria e alertas
- Transações recorrentes
