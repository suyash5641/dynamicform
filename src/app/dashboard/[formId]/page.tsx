"use client";
// import { Bar } from "react-chartjs-2";
import DynamicForm from "@/components/DynamicForm";
import { useDashboard } from "@/hooks/useDashboard";
import { fetchFormFields } from "@/slice/formSlice";
import { fetchUser } from "@/slice/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Loader2 } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chart.js/auto";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export default function Page({ params }: { params: { formId: string } }) {
  const { fetchChartData, chartData, loading } = useDashboard();
  const user = useSelector((state: RootState) => state?.userInfo?.user);
  useEffect(() => {
    fetchChartData(params?.formId);
  }, [fetchChartData, params?.formId]);

  console.log(chartData, "ok");

  //   useEffect(() => {
  //     dispatch(fetchUser());
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  //   useEffect(() => {
  //     dispatch(fetchUser());
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  return (
    <div>
      {!loading ? (
        // <Bar data={chartData} />
        <Line
          data={chartData}
          options={{
            responsive: true,
            scales: {
              x: {
                ticks: {
                  // Ensures the x-axis displays only integer values
                  precision: 0,
                },
                // Configure x-axis grid lines if needed
                grid: {
                  display: false,
                },
              },
              y: {
                // Optional: configure y-axis if needed
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: "Form Views Over Time",
              },
            },
          }}
        />
      ) : (
        <div className="flex justify-center items-center w-full h-screen">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
}
