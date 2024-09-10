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
        const labels = data.map((item: FormView) => `${item.city}`);
        const counts = data.map((item: FormView) => item.count);

        // setChartData({
        //   labels,
        //   datasets: [
        //     {
        //       label: "Users by City, Country",
        //       data: counts,
        //       backgroundColor: "rgba(75, 192, 192, 0.6)",
        //       borderColor: "rgba(75, 192, 192, 1)",

        //       borderWidth: 2,
        //     },
        //   ],
        // });
        setChartData({
          labels: [
            "Mumbai, India",
            "Delhi, India",
            "Bangalore, India",
            "Chennai, India",
            "Kolkata, India",
            "Pune, India",
            "Hyderabad, India",
            "Ahmedabad, India",
            "Jaipur, India",
            "Surat, India",
            "Lucknow, India",
            "Nagpur, India",
            "Patna, India",
            "Indore, India",
            "Bhopal, India",
            "Thane, India",
            "Vadodara, India",
            "Agra, India",
            "Nashik, India",
            "Faridabad, India",
            "Meerut, India",
            "Rajkot, India",
            "Varanasi, India",
            "Srinagar, India",
            "Amritsar, India",
            "Gwalior, India",
            "Jodhpur, India",
            "Coimbatore, India",
            "Vijayawada, India",
            "Madurai, India",
            "Raipur, India",
            "Kota, India",
            "Guwahati, India",
            "Chandigarh, India",
            "Bhubaneswar, India",
            "Dehradun, India",
            "Mysore, India",
            "Jalandhar, India",
            "Ranchi, India",
            "Tiruchirappalli, India",
            "Bareilly, India",
            "Aligarh, India",
            "Moradabad, India",
            "Jammu, India",
            "Salem, India",
            "Gorakhpur, India",
            "Noida, India",
            "Ghaziabad, India",
            "Kanpur, India",
          ],
          datasets: [
            {
              label: "Users",
              data: [
                6, 1, 800, 2, 5, 7, 4, 9, 3, 6, 7, 8, 5, 3, 6, 4, 2, 7, 9, 1, 5,
                8, 3, 7, 4, 9, 2, 6, 5, 8, 7, 9, 3, 1, 4, 7, 2, 6, 8, 9, 5, 3,
                4, 6, 7, 8, 2, 9, 500, 3,
              ],
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
