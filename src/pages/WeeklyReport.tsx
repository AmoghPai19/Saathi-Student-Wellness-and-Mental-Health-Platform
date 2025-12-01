import React, { useEffect, useState } from "react";
import axios from "axios";
import { joinUrl } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface MoodData {
  mood: string;
  count: number;
}

const moodColors: Record<string, string> = {
  Happy: "#FFD700",   // Yellow
  Sad: "#1E90FF",     // Blue
  Angry: "#FF4500",   // Red
  Calm: "#32CD32",    // Green
  Tired: "#8A2BE2",   // Purple
};

const WeeklyReport: React.FC = () => {
  const [data, setData] = useState<MoodData[]>([]);
  const userId = localStorage.getItem("userId");

  const fetchReport = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(joinUrl(`/api/mood/weekly/${userId}`));
      const report = res.data.weeklyReport || {};

      const chartData = Object.entries(report).map(([mood, count]) => ({
        mood,
        count: Number(count),
      }));

      setData(chartData);
    } catch (err) {
      console.error("Failed to fetch weekly report:", err);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-purple-50 to-blue-50 p-8">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
        Weekly Mood Report
      </h1>

      {data.length === 0 ? (
        <p className="text-gray-600 text-lg">No moods recorded this week.</p>
      ) : (
        <div className="w-full max-w-3xl h-80 p-4 bg-white rounded-2xl shadow-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="mood"
                tick={{ fontSize: 14, fill: "#555" }}
                axisLine={{ stroke: "#ccc" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 14, fill: "#555" }}
                axisLine={{ stroke: "#ccc" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
              <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={moodColors[entry.mood] || "#8884d8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default WeeklyReport;
