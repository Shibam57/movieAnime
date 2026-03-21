import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function SeasonHighlight({ season }) {
  if (!season) return null;

  return (
    <section className="relative w-full py-20 overflow-hidden text-white">
      {/* 🎥 Background with Blur + Gradient */}
      <div className="absolute inset-0">
        <img
          src={season.banner || season.thumbnail || "/placeholder.jpg"}
          alt={season.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
        {/* Poster */}
        <motion.img
          src={season.thumbnail || "/placeholder.jpg"}
          alt={season.title}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-72 rounded-2xl shadow-lg"
        />

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            {season.title}
          </h2>
          <p className="text-gray-300 mb-6 text-lg max-w-2xl">
            {season.description || "No description available."}
          </p>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-semibold shadow-lg">
              <Play className="w-5 h-5" /> Watch Now
            </button>
            <button className="px-6 py-3 rounded-xl border border-gray-400 hover:bg-gray-800 transition">
              More Info
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}