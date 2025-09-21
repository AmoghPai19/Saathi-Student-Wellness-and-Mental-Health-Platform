import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from "recharts";

interface DashboardStats {
  totalUsers: number;
  totalMessages: number;
  totalAppointments: number;
  totalCommunities: number;
  timestamp: string;
}

const COLORS = ["#4F46E5", "#F97316", "#16A34A", "#DB2777"];

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/analytics");
        console.log("Stats response:", res.data); // debug
        setDashboardStats(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-6 text-center">Loading dashboard...</div>;
  if (!dashboardStats) return <div className="p-6 text-center text-red-500">No data available</div>;

  // Data for charts
  const barChartData = [
    { name: "Users", count: dashboardStats.totalUsers },
    { name: "Messages", count: dashboardStats.totalMessages },
    { name: "Appointments", count: dashboardStats.totalAppointments },
    { name: "Communities", count: dashboardStats.totalCommunities },
  ];

  const pieChartData = [
    { name: "Users", value: dashboardStats.totalUsers },
    { name: "Messages", value: dashboardStats.totalMessages },
    { name: "Appointments", value: dashboardStats.totalAppointments },
    { name: "Communities", value: dashboardStats.totalCommunities },
  ];

  return (
    <div className="min-h-screen gradient-hero px-4 py-8">
      {/* Top cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{dashboardStats.totalUsers}</div></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Total Messages</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{dashboardStats.totalMessages}</div></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Total Appointments</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{dashboardStats.totalAppointments}</div></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Total Communities</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{dashboardStats.totalCommunities}</div></CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader><CardTitle>Overview Bar Chart</CardTitle></CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader><CardTitle>Distribution Pie Chart</CardTitle></CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Last updated */}
      <div className="mt-6 text-gray-500 text-sm text-center">
        Last updated: {new Date(dashboardStats.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default AdminDashboard;
