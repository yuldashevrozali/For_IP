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
  Legend
} from "recharts";
import ipData from "../data/ipData.json";

export default function Home() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const results = [];

      for (const item of ipData.Jsons) {
        try {
          const res = await fetch(`https://ipapi.co/${item.ip}/json/`);
          const data = await res.json();
          results.push({
            ip: item.ip,
            city: data.city || "Noma'lum",
            country: data.country_name || "Noma'lum",
            time: new Date(item.timestamp).toLocaleTimeString("uz-UZ", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            lat: parseFloat(data.latitude) || 0,
          });
        } catch (err) {
          results.push({
            ip: item.ip,
            city: "Noma'lum",
            country: "Noma'lum",
            time: new Date(item.timestamp).toLocaleTimeString("uz-UZ", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            lat: 0,
          });
        }
      }

      setChartData(results);
    };

    fetchAll();
  }, []);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const loc = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 text-sm text-gray-700">
          <p><strong>🕒 Vaqt:</strong> {label}</p>
          <p><strong>🌐 IP:</strong> {loc.ip}</p>
          <p><strong>🏙 Shahar:</strong> {loc.city}</p>
          <p><strong>🇺🇿 Mamlakat:</strong> {loc.country}</p>
          <p><strong>🧭 Kenglik:</strong> {loc.lat}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        🌍 IP manzillar bo‘yicha joylashuv grafigi
      </h2>

      <div className="shadow-lg p-6 rounded-xl bg-white border border-gray-200">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="lat"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5, stroke: "#1d4ed8", strokeWidth: 2, fill: "#60a5fa" }}
              name="Joylashuv (kenglik)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
