import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function MovieDetails() {
  const { movieId } = useParams(); // <-- route param /movies/:movieId
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/movies/${movieId}`);
        setMovie(data?.movie || null); // match backend response
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  if (loading) {
    return (
      <div className="w-full py-20 text-center text-gray-400 animate-pulse">
        Loading movie details...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="w-full py-20 text-center text-gray-400">
        Movie not found.{" "}
        <button
          onClick={() => navigate(-1)}
          className="ml-2 text-indigo-400 underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-white">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {movie.title}
      </motion.h1>

      {/* Video player */}
      <motion.div
        className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <video
          controls
          className="w-full h-full object-cover"
          src={movie.videoUrl} // 🔑 make sure backend returns this
          poster={movie.thumbnail}
        />
      </motion.div>

      {/* Movie info */}
      <div className="space-y-4">
        <p className="text-gray-300">{movie.description}</p>
        <p className="text-gray-400 text-sm">
          Genre: <span className="text-white">{movie.genre}</span>
        </p>
        <p className="text-gray-400 text-sm">
          Release Date:{" "}
          <span className="text-white">
            {new Date(movie.releaseDate).toDateString()}
          </span>
        </p>
        <p className="text-gray-400 text-sm">
          Price:{" "}
          <span className="text-green-400">
            {movie.isPaid ? `₹${movie.price}` : "Free"}
          </span>
        </p>
      </div>
    </div>
  );
}