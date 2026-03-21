import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardFooter } from "../components/ui/Card";
import { BarChart3, Film, Users, Tv } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ movies: 0, series: 0, users: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/v1/dashboard/stats");
        const result = await res.json();
        setStats(result.data); // Access the 'data' property
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Movies", value: stats.movies, icon: <Film className="w-6 h-6 text-indigo-500" /> },
    { title: "Series", value: stats.series, icon: <Tv className="w-6 h-6 text-green-500" /> },
    { title: "Users", value: stats.totalUsers, icon: <Users className="w-6 h-6 text-pink-500" /> },
    { title: "Revenue", value: `₹${stats.totalRevenue}`, icon: <BarChart3 className="w-6 h-6 text-yellow-500" /> },
  ];

  return (
    <div className="space-y-8 p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold"
      >
        Dashboard Overview
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex items-center gap-2 text-lg font-bold">
                {card.icon}
                {card.title}
              </CardHeader>
              <CardContent className="text-3xl font-semibold">{card.value}</CardContent>
              <CardFooter>Total {card.title}</CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}