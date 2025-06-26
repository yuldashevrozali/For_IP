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
  Label,
} from "recharts";
import gpsRoutes from "../../public/data/routeData.json";

const colors = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];

export default function RouteTracker() {
  const [userRoutes, setUserRoutes] = useState([]);

  useEffect(() => {
  const times = new Set();
  const transformed = [];

  // 1. Barcha vaqtlarni to‘plab olish
  gpsRoutes.users.forEach((user) => {
    user.routes.forEach((route) => times.add(route.time));
  });

  // 2. Har bir vaqt uchun ma'lumot tayyorlash
  Array.from(times).sort().forEach((time) => {
    const entry = { time };

    gpsRoutes.users.forEach((user) => {
      const found = user.routes.find((r) => r.time === time);
      if (found) {
        entry[`${user.name}_lat`] = found.lat;
        entry[`${user.name}_info`] = found; // Tooltip uchun
      }
    });

    transformed.push(entry);
  });

  setUserRoutes(transformed);
}, []);


  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-center text-xl sm:text-2xl font-bold mb-6 text-gray-800">
        🗺 Har bir odamning yo‘li – vaqt va kenglik bo‘yicha
      </h1>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow border">
        <ResponsiveContainer width="100%" height={500}>
  <LineChart
    layout="vertical"
    data={userRoutes}
    margin={{ top: 10, right: 40, left: 80, bottom: 40 }}
  >
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis type="number" tick={{ fontSize: 12 }}>
      <Label value="Kenglik (Latitude)" position="bottom" offset={20} />
    </XAxis>

    <YAxis type="category" dataKey="time" tick={{ fontSize: 12 }}>
      <Label
        value="Vaqt"
        angle={-90}
        position="insideLeft"
        style={{ textAnchor: "middle" }}
      />
    </YAxis>

    <Tooltip
      content={({ active, payload }) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-white p-3 rounded shadow border text-sm text-gray-700">
              {payload.map((p, i) => {
                const info = p.payload[`${p.name}_info`];
                if (!info) return null;
                return (
                  <div key={i} className="mb-2 border-b pb-1">
                    <p>👤 <strong>{info.name}</strong></p>
                    <p>🕒 {info.time}</p>
                    <p>📍 {info.location}</p>
                    <p>🌐 {info.ip}</p>
                    <p>📌 {info.status}</p>
                    <p>🧭 Lat: {info.lat}</p>
                    <p>🧭 Lon: {info.lon}</p>
                  </div>
                );
              })}
            </div>
          );
        }
        return null;
      }}
    />

    <Legend />

    {gpsRoutes.users.map((user, i) => (
      <Line
        key={user.name}
        type="monotone"
        dataKey={`${user.name}_lat`}
        stroke={colors[i % colors.length]}
        name={user.name}
        dot={{ r: 5 }}
        activeDot={{ r: 7 }}
        isAnimationActive={false}
        connectNulls
      />
    ))}
  </LineChart>
</ResponsiveContainer>

      </div>
    </div>
  );
}
