import { firstDayOfMonthISO, lastDayOfMonthISO, todayISO } from "@/lib/format";

export type PeriodPreset =
  | "this-month"
  | "last-month"
  | "last-30-days"
  | "this-year"
  | "custom";

export const PERIOD_LABELS: Record<PeriodPreset, string> = {
  "this-month": "Este mês",
  "last-month": "Mês passado",
  "last-30-days": "Últimos 30 dias",
  "this-year": "Este ano",
  custom: "Personalizado",
};

export function rangeForPreset(preset: PeriodPreset): { from: string; to: string } {
  const now = new Date();

  switch (preset) {
    case "last-month": {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return {
        from: firstDayOfMonthISO(lastMonth),
        to: lastDayOfMonthISO(lastMonth),
      };
    }
    case "last-30-days": {
      const from = new Date(now);
      from.setDate(from.getDate() - 30);
      return { from: from.toISOString().slice(0, 10), to: todayISO() };
    }
    case "this-year": {
      return {
        from: `${now.getFullYear()}-01-01`,
        to: `${now.getFullYear()}-12-31`,
      };
    }
    case "this-month":
    default:
      return { from: firstDayOfMonthISO(now), to: lastDayOfMonthISO(now) };
  }
}
