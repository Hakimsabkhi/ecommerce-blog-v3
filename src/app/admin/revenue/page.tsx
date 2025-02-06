"use client";
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";

interface Order {
  _id: string;
  updatedAt: string;
  total: number;
  orderStatus: string;
}

const RevenueDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"year" | "month" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetch("/api/order/getorderrevenue", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`[Orders_GET] ${err.message}`);
          console.error(`[Orders_GET] ${err.message}`);
        } else {
          setError("[Orders_GET] An unknown error occurred.");
          console.error("[Orders_GET] An unknown error occurred.");
        }
      }
    };

    getOrders();
  }, []);

  const aggregateRevenue = () => {
    const revenueByDate: Record<string, number> = {};
    const selectedDateObj = new Date(selectedDate);
    const currentYear = selectedDateObj.getFullYear();
    const currentMonth = selectedDateObj.getMonth();
    const currentDay = selectedDateObj.getDate();

    if (timeframe === "day") {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(selectedDateObj);
        date.setDate(currentDay - i);
        const dayString = date.toISOString().split("T")[0];
        revenueByDate[dayString] = 0;
      }
    }

    if (timeframe === "month") {
      for (let i = 3; i >= 0; i--) {
        const date = new Date(selectedDateObj);
        date.setMonth(currentMonth - i);
        const monthYear = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
        revenueByDate[monthYear] = 0;
      }
    }

    if (timeframe === "year") {
      for (let i = 3; i >= 0; i--) {
        const year = currentYear - i;
        revenueByDate[year] = 0;
      }
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.updatedAt);
      const orderYear = orderDate.getFullYear();

      if (timeframe === "day") {
        const orderDateString = orderDate.toISOString().split("T")[0];
        if (revenueByDate[orderDateString] !== undefined) {
          revenueByDate[orderDateString] += order.total;
        }
      }

      if (timeframe === "month") {
        const orderMonthYear = orderDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
        if (revenueByDate[orderMonthYear] !== undefined) {
          revenueByDate[orderMonthYear] += order.total;
        }
      }

      if (timeframe === "year") {
        if (revenueByDate[orderYear] !== undefined) {
          revenueByDate[orderYear] += order.total;
        }
      }
    });

    return Object.entries(revenueByDate).map(([date, total]) => ({ date, total }));
  };

  const revenueData = aggregateRevenue();
  const totalRevenue = revenueData.reduce((sum, entry) => sum + entry.total, 0).toFixed(2);

  return (
    <div className="p-6 mx-auto w-[90%]">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-3xl max-sm:text-xl font-bold">Revenue</h1>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="text-red-500 font-medium mb-4">
          {error}
        </div>
      )}

      {/* Revenue Section */}
      <div className="flex xl:flex-col-2 justify-center xl:items-center max-xl:flex-col gap-4">
        <div className="bg-white rounded-lg xl:w-[50%] h-full border-2 p-6">
          
            <h2 className="text-xl font-semibold">Revenue:</h2>
            <div className="flex items-center gap-4 flex-col">
            <div className="flex gap-4">
              <button
              onClick={() => setTimeframe("year")}
              className={`p-2 ${timeframe === "year" ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
            >
              Par Année
            </button>
            <button
              onClick={() => setTimeframe("month")}
              className={`p-2 ${timeframe === "month" ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
            >
              Par Mois
            </button>
            <button
              onClick={() => setTimeframe("day")}
              className={`p-2 ${timeframe === "day" ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
            >
              Par Jour
            </button>
            </div>
            <input
              type={timeframe === "year" ? "number" : "date"}
              className="border rounded p-2 ml-4"
              value={timeframe === "year" ? selectedDate.split("-")[0] : selectedDate}
              onChange={(e) => {
                if (timeframe === "year") {
                  setSelectedDate(`${e.target.value}-01-01`);
                } else {
                  setSelectedDate(e.target.value);
                }
              }}
            />
          </div>
          <div className="mt-11 flex flex-col items-center justify-center">
            <h3 className="text-3xl text-purple-600 mb-7 flex gap-2 justify-center items-center">
              <FaMoneyBillWave />
              Revenue: {totalRevenue}€
            </h3>
            <p className="font-medium flex gap-2">
              <span className="font-bold text-green-600 flex gap-2 items-center">
                <FaArrowTrendUp />
                100.00%
              </span>{" "}
              Increase par rapport à la période précédente
            </p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg xl:w-[40%] h-full border-2 p-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
