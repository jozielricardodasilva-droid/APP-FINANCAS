import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { MonthSummary } from "@/lib/queries";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export function SummaryCards({ summary }: { summary: MonthSummary }) {
  const cards = [
    {
      label: "Receitas",
      value: summary.income,
      icon: ArrowUpRight,
      tone: "text-[#006300] dark:text-[#0ca30c]",
      iconBg: "bg-[#0ca30c]/10",
    },
    {
      label: "Despesas",
      value: summary.expense,
      icon: ArrowDownRight,
      tone: "text-[#d03b3b] dark:text-[#e66767]",
      iconBg: "bg-[#d03b3b]/10",
    },
    {
      label: "Saldo",
      value: summary.balance,
      icon: Wallet,
      tone: summary.balance >= 0 ? "text-primary" : "text-[#d03b3b] dark:text-[#e66767]",
      iconBg: "bg-primary/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
            <span className={cn("flex size-8 items-center justify-center rounded-full", card.iconBg)}>
              <card.icon className={cn("size-4", card.tone)} />
            </span>
          </CardHeader>
          <CardContent>
            <p className={cn("text-2xl font-semibold tabular-nums", card.tone)}>
              {formatCurrency(card.value)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
