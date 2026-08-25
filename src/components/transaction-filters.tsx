"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ALL_CATEGORIES } from "@/lib/categories";
import { PERIOD_LABELS, rangeForPreset, type PeriodPreset } from "@/lib/periods";
import type { TransactionType } from "@/lib/types";

export function TransactionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const preset = (searchParams.get("preset") as PeriodPreset) || "this-month";
  const category = searchParams.get("category") || "all";
  const type = (searchParams.get("type") as TransactionType | "all") || "all";
  const [customFrom, setCustomFrom] = useState(searchParams.get("from") ?? "");
  const [customTo, setCustomTo] = useState(searchParams.get("to") ?? "");

  function update(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handlePreset(value: string | null) {
    const p = (value ?? "this-month") as PeriodPreset;
    if (p === "custom") {
      update({ preset: p, from: customFrom || undefined, to: customTo || undefined });
      return;
    }
    const { from, to } = rangeForPreset(p);
    setCustomFrom(from);
    setCustomTo(to);
    update({ preset: p, from, to });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Select value={preset} onValueChange={handlePreset}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(PERIOD_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {preset === "custom" && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            onBlur={() => update({ from: customFrom || undefined })}
            className="w-full sm:w-40"
          />
          <span className="text-sm text-muted-foreground">até</span>
          <Input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            onBlur={() => update({ to: customTo || undefined })}
            className="w-full sm:w-40"
          />
        </div>
      )}

      <Select
        value={category}
        onValueChange={(value) => update({ category: !value || value === "all" ? undefined : value })}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {ALL_CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Tabs
        value={type}
        onValueChange={(value) => update({ type: value === "all" ? undefined : value })}
      >
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
          <TabsTrigger value="expense">Despesas</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
