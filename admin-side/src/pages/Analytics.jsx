import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Users, DollarSign, PlayCircle, Loader } from "lucide-react";
import axios from "axios";

export default function Analytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalVideos: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await axios.get("/api/v1/dashboard/stats");
        console.log("API response:", res.data);

        // Adjust mapping based on your backend response
        const data = res.data?.data || {}; // using ApiResponse wrapper if you use it
        setStats({
          totalUsers: data.totalUsers || 0,
          totalRevenue: data.totalRevenue || 0,
          totalVideos: data.totalVideos || 0,
        });
        setRevenueData(data.revenueGraph || []);
        setUserGrowth(data.userGraph || []);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const token = localStorage.getItem("admintoken");
  const isAdmin = !!token;


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          <Loader className="animate-spin" size={32} />
        </div>
      ) : isAdmin ? ( 
          <>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow p-6 flex items-center space-x-4"
            >
              <Users className="text-indigo-600" size={32} />
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-xl font-bold">{stats.totalUsers}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow p-6 flex items-center space-x-4"
            >
              <DollarSign className="text-green-600" size={32} />
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-xl font-bold">₹{stats.totalRevenue}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow p-6 flex items-center space-x-4"
            >
              <PlayCircle className="text-orange-500" size={32} />
              <div>
                <p className="text-gray-500 text-sm">Total Videos</p>
                <p className="text-xl font-bold">{stats.totalVideos}</p>
              </div>
            </motion.div>
          </div>
          

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold mb-4">User Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
       ): (
        <p className="text-center text-gray-600">
          You must be logged in as admin to view analytics.
        </p>
       
      )}
    </div>
  );
}