import type { TransactionType } from "@/lib/types";

// Paleta categórica (ordem fixa, validada para contraste e daltonismo)
// Slot 1 blue, 2 orange, 3 aqua, 4 yellow, 5 magenta, 6 green, 7 violet, 8 red
export const CATEGORICAL_COLORS = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#4a3aa7",
  "#e34948",
] as const;

export const EXPENSE_CATEGORIES = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Compras",
  "Contas",
  "Outros",
] as const;

export const INCOME_CATEGORIES = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Presente",
  "Outros",
] as const;

export function categoriesForType(type: TransactionType): readonly string[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export const ALL_CATEGORIES: string[] = Array.from(
  new Set<string>([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])
);

/**
 * Cor determinística por categoria: mesma categoria = mesma cor sempre,
 * independentemente de quais outras categorias estão presentes no gráfico.
 */
export function colorForCategory(category: string): string {
  const index = ALL_CATEGORIES.indexOf(category);
  const safeIndex = index === -1 ? 0 : index;
  return CATEGORICAL_COLORS[safeIndex % CATEGORICAL_COLORS.length];
}
