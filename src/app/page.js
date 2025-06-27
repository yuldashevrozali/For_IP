"use client";

import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
  ScatterChart,
  Scatter,
} from "recharts";

const colors = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];

export default function RouteTracker() {
  const [userRoutes, setUserRoutes] = useState([]);

  useEffect(() => {
    fetch("/data/routeData.json")
      .then((res) => res.json())
      .then((data) => {
        const prepared = data.users.map((user) => ({
          id: user.id,
          name: user.name,
          data: user.routes.map((r) => ({
            ...r,
            x: r.lat,
            y: r.lon,
            userId: user.id,
            userName: user.name, // 🟢 user ismi har bir nuqtaga biriktirildi
          })),
        }));

        setUserRoutes(prepared);
      });
  }, []);

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-center text-xl sm:text-2xl font-bold mb-6 text-gray-800">
        🗺 Har bir odamning yo‘li – kenglik (latitude) va uzunlik (longitude)
        bo‘yicha
      </h1>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow border">
        {userRoutes.length > 0 && (
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 10, right: 40, left: 40, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" dataKey="x" domain={["auto", "auto"]}>
                <Label
                  value="Kenglik (Latitude)"
                  position="bottom"
                  offset={20}
                />
              </XAxis>

              <YAxis type="number" dataKey="y" domain={["auto", "auto"]}>
                <Label
                  value="Uzunlik (Longitude)"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded shadow border text-sm text-gray-700">
                        <p>
                          👤 <strong>{d.userName}</strong>
                        </p>{" "}
                        {/* 🔥 Bu joyda to‘g‘ri ism chiqadi */}
                        <p>🕒 {d.time}</p>
                        <p>📍 {d.location}</p>
                        <p>🌐 {d.ip}</p>
                        <p>📌 {d.status}</p>
                        <p>🧭 Lat: {d.lat}</p>
                        <p>🧭 Lon: {d.lon}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend />

               {userRoutes.map((user, i) => (
                <Scatter
                  key={user.id}
                  name={user.name}
                  data={user.data}
                  fill={colors[i % colors.length]}
                  line
                  shape="circle"
                  dataKey={Math.random()}
                />
              ))}

            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
