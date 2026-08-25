import { TransactionFilters } from "@/components/transaction-filters";
import { TransactionTable } from "@/components/transaction-table";
import { TransactionDialog } from "@/components/transaction-dialog";
import { SummaryCards } from "@/components/summary-cards";
import { getSummary, getTransactions } from "@/lib/queries";
import { rangeForPreset, type PeriodPreset } from "@/lib/periods";
import type { TransactionType } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{
    preset?: string;
    from?: string;
    to?: string;
    category?: string;
    type?: string;
  }>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const preset = (params.preset as PeriodPreset) || "this-month";
  const defaultRange = rangeForPreset(preset);

  const filters = {
    from: params.from ?? defaultRange.from,
    to: params.to ?? defaultRange.to,
    category: params.category,
    type: (params.type as TransactionType | "all") || "all",
  };

  const [transactions, summary] = await Promise.all([
    getTransactions(filters),
    getSummary(filters),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Transações</h1>
        <TransactionDialog />
      </div>

      <TransactionFilters />

      <SummaryCards summary={summary} />

      <TransactionTable transactions={transactions} />
    </div>
  );
}
