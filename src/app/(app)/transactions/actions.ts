"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("O valor deve ser maior que zero."),
  category: z.string().min(1, "Selecione uma categoria."),
  description: z.string().max(280).optional().default(""),
  date: z.string().min(1, "Informe a data."),
});

export interface TransactionFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createTransaction(
  _prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const parsed = transactionSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    description: formData.get("description"),
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return { fieldErrors: flatten(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase.from("transactions").insert({
    ...parsed.data,
    user_id: user.id,
  });

  if (error) return { error: "Não foi possível salvar a transação." };

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return {};
}

export async function updateTransaction(
  id: string,
  _prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const parsed = transactionSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    description: formData.get("description"),
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return { fieldErrors: flatten(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("transactions")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: "Não foi possível atualizar a transação." };

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return {};
}

export async function deleteTransaction(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) return { error: "Não foi possível excluir a transação." };

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return {};
}

function flatten(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}
