"use server";
import { createClient } from "@/utils/supabase/server";
import { IField, IFieldSchema, IForm } from "@/interface/interface";
import { User as SupabaseUser } from "@supabase/supabase-js";
const supabase = createClient();

export async function generateSchemaServer(
  formData: IForm,
  user: SupabaseUser | null
) {
  const { error } = await supabase.from("userform").insert([
    {
      form_title: formData.name,
      form_description: formData.description,
      form_data: formData?.fieldInfo,
      form_submitted: false,
      user_id: user?.id,
      form_id: formData?.formId,
    },
  ]);

  if (error) {
    return { error: error?.message, formId: "" };
  }

  return { error: "", formId: formData?.formId };
}
