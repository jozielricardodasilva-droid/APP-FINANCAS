import { createClient } from "@/lib/supabase/server";
import type { Transaction, TransactionFilters, TransactionType } from "@/lib/types";

export interface MonthSummary {
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

interface FilterableQuery<T> {
  gte(column: string, value: string): T;
  lte(column: string, value: string): T;
  eq(column: string, value: string): T;
}

function applyFilters<T extends FilterableQuery<T>>(
  query: T,
  filters: TransactionFilters
): T {
  if (filters.from) query = query.gte("date", filters.from);
  if (filters.to) query = query.lte("date", filters.to);
  if (filters.category && filters.category !== "all")
    query = query.eq("category", filters.category);
  if (filters.type && filters.type !== "all") query = query.eq("type", filters.type);
  return query;
}

export async function getTransactions(
  filters: TransactionFilters = {}
): Promise<Transaction[]> {
  const supabase = await createClient();
  let query = supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  query = applyFilters(query, filters);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getSummary(
  filters: TransactionFilters = {}
): Promise<MonthSummary> {
  const supabase = await createClient();
  let query = supabase.from("transactions").select("type, amount");
  query = applyFilters(query, filters);

  const { data, error } = await query;
  if (error) throw error;

  const summary = (data ?? []).reduce(
    (acc, t) => {
      if (t.type === "income") acc.income += Number(t.amount);
      else acc.expense += Number(t.amount);
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );
  summary.balance = summary.income - summary.expense;
  return summary;
}

export async function getTotalsByCategory(
  type: TransactionType,
  filters: TransactionFilters = {}
): Promise<CategoryTotal[]> {
  const supabase = await createClient();
  let query = supabase
    .from("transactions")
    .select("category, amount")
    .eq("type", type);
  query = applyFilters(query, { ...filters, type: "all" });

  const { data, error } = await query;
  if (error) throw error;

  const totals = new Map<string, number>();
  for (const t of data ?? []) {
    totals.set(t.category, (totals.get(t.category) ?? 0) + Number(t.amount));
  }

  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}
