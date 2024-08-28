"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Sign-up error:", error.message);
    redirect(`/error?message=${error?.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/home");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    email_confirm: true,
  };

  const { error } = await supabase.auth.signUp(data);

  console.log(error, "ok", data);

  if (error) {
    console.error("Sign-up error:", error.message);
    console.error("Sign-up error:", error.message);
    redirect(`/error?message=${error?.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/home");
}
