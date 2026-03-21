import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import axios from "axios";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("api/v1/movies"); // 🔑 backend API
        setMovies(data.data.movies || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">All Movies</h1>

      {loading ? (
        <p className="text-gray-400">Loading movies...</p>
      ) : movies.length === 0 ? (
        <p className="text-gray-400">No movies available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
