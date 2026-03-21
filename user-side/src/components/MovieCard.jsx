import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${movie._id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className="relative bg-gray-900/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-red-500/20 group cursor-pointer"
    >
      <div className="relative">
        <img
          src={movie.thumbnail || "/placeholder.jpg"}
          alt={movie.title}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${
            movie.isPaid ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {movie.isPaid ? `Paid • ₹${movie.price}` : "Free"}
        </span>
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
          <Play className="w-14 h-14 text-white bg-red-600 p-3 rounded-full shadow-lg" />
        </div>
      </div>

      {/* Info section */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-2">{movie.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.genres?.slice(0, 3).map((g) => (
            <span
              key={g._id}
              className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full"
            >
              {g.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}