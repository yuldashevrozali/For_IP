"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Scatter,
  Label,
} from "recharts";

const colors = ["#3b82f6", "#10b981", "#ef4444"];

export default function RouteChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data/routeData.json")
      .then((res) => res.json())
      .then((routes) => {
        const prepared = routes.map((user) => ({
          name: user.user,
          data: user.points.map((p) => ({
            ...p,
            x: p.lat,
            y: p.lon,
          })),
        }));
        setData(prepared);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl text-center font-bold mb-4">
        🗺 Foydalanuvchilarning yo‘nalishlari (lat/lon)
      </h2>

      <div className="bg-white rounded shadow p-4">
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, bottom: 30, left: 40, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" type="number">
              <Label value="Latitude" position="bottom" offset={10} />
            </XAxis>
            <YAxis dataKey="y" type="number">
              <Label
                value="Longitude"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded text-sm">
                    <p><strong>👤 {payload[0].name}</strong></p>
                    <p>🕒 {d.time}</p>
                    <p>📍 {d.location}</p>
                    <p>🌐 {d.ip}</p>
                    <p>📌 {d.status}</p>
                    <p>🧭 Lat: {d.lat}</p>
                    <p>🧭 Lon: {d.lon}</p>
                  </div>
                );
              }}
            />

            <Legend />

            {data.map((user, i) => (
              <Scatter
                key={i}
                name={user.name}
                data={user.data}
                fill={colors[i % colors.length]}
                line
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
