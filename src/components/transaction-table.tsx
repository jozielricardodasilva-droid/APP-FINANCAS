import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TransactionRowActions } from "@/components/transaction-row-actions";
import { colorForCategory } from "@/lib/categories";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
        Nenhuma transação encontrada para os filtros selecionados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(t.date)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="gap-1.5 font-normal"
                  style={{ borderColor: colorForCategory(t.category) }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: colorForCategory(t.category) }}
                  />
                  {t.category}
                </Badge>
              </TableCell>
              <TableCell className="max-w-56 truncate text-muted-foreground">
                {t.description || "—"}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-medium tabular-nums",
                  t.type === "income"
                    ? "text-[#006300] dark:text-[#0ca30c]"
                    : "text-[#d03b3b] dark:text-[#e66767]"
                )}
              >
                {t.type === "income" ? "+" : "−"} {formatCurrency(t.amount)}
              </TableCell>
              <TableCell>
                <TransactionRowActions transaction={t} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
