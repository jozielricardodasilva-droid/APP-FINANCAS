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

O código já está em
[github.com/jozielricardodasilva-droid/APP-FINANCAS](https://github.com/jozielricardodasilva-droid/APP-FINANCAS).

1. Em [vercel.com/new](https://vercel.com/new), clique em **Import Git
   Repository** e selecione `jozielricardodasilva-droid/APP-FINANCAS`
   (autorize o acesso da Vercel à sua conta do GitHub se for pedido).
2. A Vercel detecta o Next.js automaticamente — não precisa mudar build
   command nem output directory.
3. Antes de clicar em Deploy, abra **Environment Variables** e adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` → a Project URL do seu Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → a chave publishable/anon do seu Supabase

   (os mesmos valores do seu `.env.local` — veja a seção **Segurança das
   chaves** abaixo sobre por que essas duas são seguras para expor.)
4. Clique em **Deploy**. A cada push na branch `main` a Vercel republica
   automaticamente.
5. Depois do primeiro deploy, se você habilitar confirmação de e-mail no
   Supabase, ajuste em **Authentication → URL Configuration** a *Site URL*
   e as *Redirect URLs* para o domínio que a Vercel gerou (ex:
   `https://app-financas.vercel.app`) — senão o link de confirmação do
   e-mail volta para `localhost`.

## Segurança das chaves

- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` **são
  destinadas a ir para o navegador** — qualquer variável com prefixo
  `NEXT_PUBLIC_` é embutida no JavaScript público pelo Next.js. Isso é
  intencional e seguro no modelo do Supabase: essa chave só identifica o
  projeto, ela **não dá acesso a nada por si só** — quem decide o que cada
  requisição pode ler/escrever é o Row Level Security do banco
  ([`supabase/schema.sql`](supabase/schema.sql)), não o segredo da chave.
- O app **nunca** usa a `service_role key` (a chave "mestra" que ignora RLS).
  Ela não existe em nenhum lugar do código, do `.env.local.example` nem deve
  ser configurada na Vercel — se algum dia for necessária para alguma
  automação de backend, ela vai numa rota server-only, nunca numa variável
  `NEXT_PUBLIC_*`.
- `.env.local` (com as chaves reais) nunca é commitado — está no
  `.gitignore`; só o `.env.local.example`, com placeholders, vai para o
  repositório.

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
