import { SummaryCards } from "@/components/summary-cards";
import { CategoryChart } from "@/components/category-chart";
import { TransactionTable } from "@/components/transaction-table";
import { TransactionDialog } from "@/components/transaction-dialog";
import { getSummary, getTotalsByCategory, getTransactions } from "@/lib/queries";
import { firstDayOfMonthISO, lastDayOfMonthISO } from "@/lib/format";

export default async function DashboardPage() {
  const from = firstDayOfMonthISO();
  const to = lastDayOfMonthISO();
  const filters = { from, to };

  const [summary, expenseTotals, incomeTotals, recentTransactions] = await Promise.all([
    getSummary(filters),
    getTotalsByCategory("expense", filters),
    getTotalsByCategory("income", filters),
    getTransactions(filters),
  ]);

  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm capitalize text-muted-foreground">{monthLabel}</p>
        </div>
        <TransactionDialog />
      </div>

      <SummaryCards summary={summary} />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <CategoryChart
            title="Receitas por categoria"
            emptyMessage="Nenhuma receita no período selecionado."
            data={incomeTotals}
          />
          <CategoryChart
            title="Despesas por categoria"
            emptyMessage="Nenhuma despesa no período selecionado."
            data={expenseTotals}
          />
        </div>
        <div className="space-y-3 lg:col-span-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Transações do mês
          </h2>
          <TransactionTable transactions={recentTransactions.slice(0, 8)} />
        </div>
      </div>
    </div>
  );
}
