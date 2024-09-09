import { getDashboardData } from "@/app/schemaActions";
import { useCallback, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { IField, IFieldSchema, IForm } from "@/interface/interface";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { UUID } from "crypto";
const supabase = createClient();

interface FormView {
  city: string;
  country: string;
  count: number;
}

export const useDashboard = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchChartData = useCallback(async (formId: string) => {
    try {
      if (formId) {
        setLoading(true);
        const { data, error } = await getDashboardData(formId);
        // const { data, error } = await supabase.rpc("get_form_view_data_uuid", {
        //   form_id_input: formId as UUID,
        // });
        if (error) throw new Error("some error ocuured");
        console.log({ data }, "oiii");
        const labels = data.map(
          (item: FormView) => `${item.city}, ${item.country}`
        );
        const counts = data.map((item: FormView) => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: "Users by City, Country",
              data: counts,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",

              borderWidth: 2,
            },
          ],
        });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchChartData, loading, chartData };
};
