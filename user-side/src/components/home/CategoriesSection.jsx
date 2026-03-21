import { motion } from "framer-motion";
import { Film, Tv, Sword, Laugh, Heart, Ghost } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Action", icon: <Sword className="w-6 h-6" />, color: "from-red-600 to-orange-500" },
  { name: "Drama", icon: <Film className="w-6 h-6" />, color: "from-purple-600 to-pink-500" },
  { name: "Comedy", icon: <Laugh className="w-6 h-6" />, color: "from-yellow-400 to-orange-400" },
  { name: "Romance", icon: <Heart className="w-6 h-6" />, color: "from-pink-500 to-red-500" },
  { name: "Horror", icon: <Ghost className="w-6 h-6" />, color: "from-gray-800 to-black" },
  { name: "Sci-Fi", icon: <Tv className="w-6 h-6" />, color: "from-blue-500 to-indigo-600" },
];

export default function CategoriesSection() {
    const navigate = useNavigate();

  return (
    <section className="relative w-full py-20 bg-gray-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-extrabold mb-12 text-center"
        >
          🎬 Browse by <span className="text-red-500">Categories</span>
        </motion.h2>

        {/* Category Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              onClick={() => navigate(`/genre/${cat.name.toLowerCase()}`)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${cat.color} flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-105 hover:shadow-xl transition-transform brightness-100`}
            >
              <div className="bg-white/20 p-3 rounded-full">{cat.icon}</div>
              <h3 className="font-semibold text-lg">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}