export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string | null;
  date: string; // formato ISO (yyyy-mm-dd)
  created_at: string;
  updated_at: string;
}

export interface TransactionFilters {
  from?: string;
  to?: string;
  category?: string;
  type?: TransactionType | "all";
}
