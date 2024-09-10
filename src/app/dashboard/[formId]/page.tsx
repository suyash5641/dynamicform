"use client";
// import { Bar } from "react-chartjs-2";
import DynamicForm from "@/components/DynamicForm";
import { useDashboard } from "@/hooks/useDashboard";
import { fetchFormFields } from "@/slice/formSlice";
import { fetchUser } from "@/slice/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleEntries, setVisibleEntries] = useState(15);

  // Calculate the data for the current page

  const updateVisibleEntries = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setVisibleEntries(25); // Large screens (desktops)
    } else if (width >= 768) {
      setVisibleEntries(15); // Medium screens (tablets)
    } else if (width >= 500) {
      setVisibleEntries(12);
    } else if (width >= 320) {
      setVisibleEntries(8); // Small screens (mobiles)
    } else {
      setVisibleEntries(3);
    }
  };

  useEffect(() => {
    // Initial setting of visible entries based on current screen size
    updateVisibleEntries();

    // Add event listener for window resize
    window.addEventListener("resize", updateVisibleEntries);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", updateVisibleEntries);
  }, []);

  const cityLabels = chartData?.labels?.map(
    (label: any) => label?.split(",")[0]
  );
  // console.log(cityLabels, "ok", chartData);
  const paginatedData = {
    ...chartData,
    labels: cityLabels?.slice(currentIndex, currentIndex + visibleEntries),
    datasets: chartData?.datasets?.map((dataset: any) => ({
      ...dataset,
      data: dataset?.data?.slice(currentIndex, currentIndex + visibleEntries),
    })),
  };

  const totalDataPoints = chartData?.labels?.length;

  const handleNext = () => {
    if (currentIndex + visibleEntries < totalDataPoints) {
      setCurrentIndex(currentIndex + 1); // Shift forward by 1 entry
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); // Shift backward by 1 entry
    }
  };
  const user = useSelector((state: RootState) => state?.userInfo?.user);
  useEffect(() => {
    fetchChartData(params?.formId);
  }, [fetchChartData, params?.formId]);

  // console.log(chartData, "ok");

  //   useEffect(() => {
  //     dispatch(fetchUser());
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  //   useEffect(() => {
  //     dispatch(fetchUser());
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);
  // const maxYValue = Math.max(...chartData?.datasets[0]?.data) + 100;

  function countDigits(num: number): number {
    if (num === 0) return 10; // Special case for 0, where the next power of ten is 10

    // Calculate the number of digits in the number
    const digitCount = Math.floor(Math.log10(Math.abs(num))) + 1;

    // Calculate the next power of ten greater than or equal to the number of digits
    const nextPowerOfTen = Math.pow(10, Math.ceil(digitCount));

    return nextPowerOfTen;
  }

  return (
    <div>
      {!loading ? (
        // <Bar data={chartData} />
        <>
          <div className="w-full flex flex-col items-center">
            <div className="w-[98%] sm:w-[90%] lg:w-[80%] mx-auto whitespace-nowrap">
              <Line
                data={paginatedData}
                options={{
                  // maintainAspectRatio: false,
                  responsive: true,
                  // maintainAspectRatio: false,
                  scales: {
                    x: {
                      type: "category",
                      // ticks: {
                      //   // Ensures the x-axis displays only integer values
                      //   // precision: 0,
                      // },
                      grid: {
                        display: false,
                      },
                      ticks: {
                        // Rotate the labels by 90 degrees
                        callback: function (value, index) {
                          return paginatedData.labels[index]; // Show the city name on x-axis
                        },

                        // maxRotation: 90, // Force the rotation to 90 degrees
                        // minRotation: 90, // Minimum rotation set to 90 degrees
                        align: "end", // Align the text for better positioning
                      },
                      // Configure x-axis grid lines if needed
                    },
                    y: {
                      // Optional: configure y-axis if needed
                      // beginAtZero: true,
                      // ticks: {
                      //   callback: function (value) {
                      //     // Only display rounded numbers
                      //     if (
                      //       value === 1 ||
                      //       value === 10 ||
                      //       value === 100 ||
                      //       value === 1000
                      //     ) {
                      //       return value;
                      //     }
                      //     return null;
                      //   },
                      // },
                      // min: 0,
                      // max: maxYValue,
                      // min: 0,
                      // max: Math.max(...paginatedData?.datasets[0]?.data) + 2,
                      // ticks: {
                      //   stepSize:
                      //     Math.max(...paginatedData?.datasets[0]?.data) / 10,
                      // },
                      grid: {
                        display: false,
                      },
                      min: 1,
                      suggestedMax: countDigits(
                        Math.max(...paginatedData?.datasets[0]?.data)
                      ),
                      type: "logarithmic",
                      ticks: {
                        // callback: function (value) {
                        //   return value;
                        // },
                        autoSkip: true,
                        // min: 0,
                        // callback: function (value) {
                        //   // Return a formatted value (e.g., using exponential notation)
                        //   if (value === 0) return "0";
                        //   return value;
                        // },

                        callback: function (value, index, values) {
                          // if (value == 1) {
                          //   return value;
                          // } else if (
                          //   value == 1e1 ||
                          //   value == 1e2 ||
                          //   value == 1e3 ||
                          //   value == 1e4 ||
                          //   value == 1e5 ||
                          //   value == 1e6 ||
                          //   value == 1e7 ||
                          //   value == 1e8 ||
                          //   value == 1e9 ||
                          //   value == 1e10 ||
                          //   value == 1e11 ||
                          //   value == 1e12
                          // ) {
                          //   return value;
                          // }
                          const numValue = Number(value);
                          const customTicks = [
                            1, 10, 100, 1000, 10000, 100000, 1000000,
                          ];

                          // Return the value if it matches a custom tick
                          if (customTicks.includes(numValue)) {
                            return value;
                          }

                          // Return an empty string for other values
                          return "";
                        },
                      },
                    },
                  },
                  animations: {
                    radius: {
                      duration: 400,
                      easing: "linear",
                      loop: (context) => context.active,
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
                    tooltip: {
                      callbacks: {
                        // Display full label in tooltip (City, Country)
                        title: function (context) {
                          const index = context[0].dataIndex + currentIndex;
                          return chartData.labels[index];
                        },
                        label: function (context) {
                          return `User Clicks: ${context.raw}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="flex justify-center items-center mt-4 gap-2 w-[100%] md:w-full">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              <ChevronLeft size={12} />
            </button>
            <span>
              {currentIndex + 1} -{" "}
              {Math.min(currentIndex + visibleEntries, totalDataPoints)} of{" "}
              {totalDataPoints}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex + visibleEntries >= totalDataPoints}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center w-full h-screen">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
}
