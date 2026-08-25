"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { colorForCategory } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import type { CategoryTotal } from "@/lib/queries";

export function CategoryChart({ data }: { data: CategoryTotal[] }) {
  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas por categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nenhuma despesa no período selecionado.
          </p>
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="mx-auto h-56 w-56 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="total"
                    nameKey="category"
                    innerRadius={56}
                    outerRadius={90}
                    paddingAngle={data.length > 1 ? 2 : 0}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.category} fill={colorForCategory(entry.category)} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, _name, item) => [
                      formatCurrency(Number(value)),
                      item.payload.category,
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--popover)",
                      color: "var(--popover-foreground)",
                      fontSize: 13,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legenda / tabela de dados — também serve como alternativa acessível ao gráfico */}
            <ul className="flex-1 space-y-2">
              {data.map((entry) => {
                const pct = total > 0 ? (entry.total / total) * 100 : 0;
                return (
                  <li key={entry.category} className="flex items-center gap-3 text-sm">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: colorForCategory(entry.category) }}
                      aria-hidden
                    />
                    <span className="flex-1 truncate text-foreground">{entry.category}</span>
                    <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
                    <span className="w-24 text-right font-medium tabular-nums">
                      {formatCurrency(entry.total)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
