import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import axios from "axios";

export default function TrendingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await axios.get("/api/v1/movies/trending");
        setMovies(data?.data || []);
      } catch (err) {
        console.error("Error fetching trending movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-20 text-center text-gray-400">Loading...</div>
    );
  }

  return (
    <section className="relative w-full py-20 overflow-hidden text-white">
      {/* 🌌 Background Gradient + Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-black" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/40 rounded-full blur-[160px] opacity-30 animate-pulse" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-purple-600/40 rounded-full blur-[160px] opacity-30 animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-extrabold mb-12 text-center"
        >
          🔥 Trending <span className="text-red-500">Movies</span>
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {movies.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="relative bg-gray-900/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-red-500/20 group"
            >
              <div className="relative">
                <img
                  src={item.thumbnail || "/placeholder.jpg"}
                  alt={item.title}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Hover Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                  <Play className="w-14 h-14 text-white bg-red-600 p-3 rounded-full shadow-lg" />
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}