import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-r from-red-600 via-pink-600 to-purple-700 py-20 px-6 text-center overflow-hidden brightness-95">
      {/* Background effects */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black/20 to-purple-900/20 bg-cover bg-center opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-red-500/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Content */}
      <motion.h2
        className="relative text-4xl md:text-5xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Discover Movies, Series & Anime
      </motion.h2>
      <motion.p
        className="relative text-lg text-gray-200 max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        Explore free content and unlock individual paid movies, series or episodes.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex justify-center gap-4 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-3 rounded-xl bg-white text-red-600 font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate("/movies")}
          className="px-6 py-3 rounded-xl bg-red-500/40 border border-white text-white font-semibold text-lg hover:bg-red-500/60 transition shadow-lg"
        >
          Browse Movies
        </button>
      </motion.div>
    </section>
  );
}