"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface AuthState {
  error?: string;
  success?: string;
  email?: string;
}

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-mail ou senha inválidos." };
  }

  redirect("/dashboard");
}

export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Preencha todos os campos." };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    return { error: error.message.includes("already registered")
      ? "Este e-mail já está cadastrado."
      : "Não foi possível criar a conta. Tente novamente." };
  }

  // Se a confirmação de e-mail estiver habilitada no projeto Supabase,
  // ainda não há sessão ativa — orienta o usuário a confirmar o e-mail.
  if (!data.session) {
    return {
      success: `Obrigado por se cadastrar, ${name.split(" ")[0]}! Enviamos um link de confirmação para o seu e-mail — confira sua caixa de entrada (e também a caixa de spam/lixo eletrônico, caso não encontre) para ativar sua conta.`,
      email,
    };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
