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

export const fetchUserFormData = async (formId: string) => {
  const { data, error } = await supabase
    .from("userform")
    .select("form_data") // Select only the form_data column
    .eq("form_id", formId)
    .single(); //

  if (error) {
    console.error("Error fetching data:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

export async function updateUserForm(
  formData: IForm,
  user: SupabaseUser | null
) {
  // const { error } = await supabase.from("userform").insert([
  //   {
  //     form_title: formData.name,
  //     form_description: formData.description,
  //     form_data: formData?.fieldInfo,
  //     form_submitted: false,
  //     user_id: user?.id,
  //     form_id: formData?.formId,
  //   },
  // ]);
  const { error } = await supabase
    .from("userform")
    .update({
      form_title: formData.name,
      form_description: formData.description,
      form_data: formData?.fieldInfo,
      form_submitted: false,
    })
    .eq("user_id", user?.id)
    .eq("form_id", formData?.formId);

  if (error) {
    return { error: error?.message, formId: "" };
  }

  return { error: "", formId: formData?.formId };
}
