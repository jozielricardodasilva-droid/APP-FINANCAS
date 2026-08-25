"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus } from "lucide-react";
import {
  createTransaction,
  updateTransaction,
  type TransactionFormState,
} from "@/app/(app)/transactions/actions";
import { categoriesForType } from "@/lib/categories";
import { todayISO } from "@/lib/format";
import type { Transaction, TransactionType } from "@/lib/types";
import { toast } from "sonner";

const initialState: TransactionFormState = {};

interface TransactionDialogProps {
  /** Transação existente: abre o formulário em modo de edição. */
  transaction?: Transaction;
  /**
   * Uso controlado (ex: acionado por um item de menu). Quando omitido,
   * o componente renderiza seu próprio botão de disparo ("Nova transação").
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TransactionDialog({
  transaction,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: TransactionDialogProps) {
  const isEdit = Boolean(transaction);
  const isControlled = openProp !== undefined;
  const [openState, setOpenState] = useState(false);
  const open = isControlled ? openProp : openState;
  const onOpenChange = isControlled ? onOpenChangeProp! : setOpenState;

  const [type, setType] = useState<TransactionType>(transaction?.type ?? "expense");

  const action = isEdit
    ? updateTransaction.bind(null, transaction!.id)
    : createTransaction;
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (open && !pending && !state.error && !state.fieldErrors && state !== initialState) {
      onOpenChange(false);
      toast.success(isEdit ? "Transação atualizada." : "Transação adicionada.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next) setType(transaction?.type ?? "expense");
      }}
    >
      {!isControlled && (
        <DialogTrigger render={<Button />}>
          <Plus />
          Nova transação
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar transação" : "Nova transação"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize os dados da transação."
              : "Registre uma nova receita ou despesa."}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Tabs value={type} onValueChange={(v) => setType(v as TransactionType)}>
              <TabsList className="w-full">
                <TabsTrigger className="flex-1" value="expense">
                  Despesa
                </TabsTrigger>
                <TabsTrigger className="flex-1" value="income">
                  Receita
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <input type="hidden" name="type" value={type} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                defaultValue={transaction?.amount}
                required
              />
              {state.fieldErrors?.amount && (
                <p className="text-xs text-destructive">{state.fieldErrors.amount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={transaction?.date ?? todayISO()}
                required
              />
              {state.fieldErrors?.date && (
                <p className="text-xs text-destructive">{state.fieldErrors.date}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select name="category" defaultValue={transaction?.category} key={type}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoriesForType(type).map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.fieldErrors?.category && (
              <p className="text-xs text-destructive">{state.fieldErrors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="Ex: Supermercado do mês"
              defaultValue={transaction?.description ?? ""}
              maxLength={280}
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              {isEdit ? "Salvar alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
