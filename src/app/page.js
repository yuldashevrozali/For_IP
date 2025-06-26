"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import gpsRoutes from "../../public/data/routeData.json";

// Ranglar ro'yxati
const colors = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];

// Tooltipdagi maxsus komponent
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border p-3 rounded shadow-md text-sm text-gray-700 max-w-xs">
        <p className="font-bold mb-2">🕒 Vaqt: {label}</p>
        {payload.map((entry, index) => {
          const user = entry.dataKey.split("_")[0];
          const data = entry.payload;

          return (
            <div key={index} className="mb-2 border-t pt-2">
              <p>👤 <strong>{user}</strong></p>
              <p>📍 Joy: {data[`${user}_location`] || "Noma’lum"}</p>
              <p>🌐 IP: {data[`${user}_ip`] || "–"}</p>
              <p>📌 Status: {data[`${user}_status`] || "–"}</p>
              <p>🧭 Kenglik (lat): {data[`${user}_lat`] || "–"}</p>
              <p>🧭 Uzunlik (lon): {data[`${user}_lon`] || "–"}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

export default function RouteTracker() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const combinedData = [];

    gpsRoutes.users.forEach((user) => {
      user.routes.forEach((route) => {
        const existing = combinedData.find((d) => d.time === route.time);
        if (existing) {
          existing[`${user.name}_lat`] = route.lat;
          existing[`${user.name}_lon`] = route.lon;
          existing[`${user.name}_status`] = route.status;
          existing[`${user.name}_location`] = route.location;
          existing[`${user.name}_ip`] = route.ip;
        } else {
          combinedData.push({
            time: route.time,
            [`${user.name}_lat`]: route.lat,
            [`${user.name}_lon`]: route.lon,
            [`${user.name}_status`]: route.status,
            [`${user.name}_location`]: route.location,
            [`${user.name}_ip`]: route.ip,
          });
        }
      });
    });

    setChartData(combinedData);
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        📍 Odamlar Harakati (Vaqt, Joy, IP, Holat)
      </h1>

      <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {gpsRoutes.users.map((user, index) => (
              <Line
                key={`${user.id}-lat`}
                type="monotone"
                dataKey={`${user.name}_lat`}
                stroke={colors[index % colors.length]}
                name={`${user.name} (Latitude)`}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
