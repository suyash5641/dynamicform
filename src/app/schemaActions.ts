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

export async function getGeoLocation(formId: string) {
  const response = await fetch(
    `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_GEOLOCATION_API_KEY}`
  );
  const result = await response.json();

  const { error } = await supabase.from("UserGeoLocation").insert([
    {
      form_id: formId,
      city: result?.city,
      country: result?.country_name,
    },
  ]);

  if (error) {
    return { error: error?.message, formId: "" };
  }

  return { error: "", formId: formId };
}

export async function getDashboardData(formId: string) {
  // const { data, error } = await supabase
  //   .from("form_views")
  //   .select("city, country, count(*) as count")
  //   .eq("form_id", formId as string)
  //   .groupBy("city, country");
  const { data, error } = await supabase.rpc("get_form_view_data_uuid", {
    form_id_input: formId,
  });

  if (error) {
    return { error: error?.message, data: null };
  }

  return { error: "", data };
}
