import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Movies({ isAdmin }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMovies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/v1/movies", {
        params: { page, limit, query, sortBy, sortType },
        withCredentials: true,
      });
      setMovies(res.data.data.movies || []);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError(err.response?.data?.message || "Failed to fetch movies");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, query, sortBy, sortType]);

  const handleDelete = async (movieId) => {
    try {
      await axios.delete(`/api/v1/movies/${movieId}`, { withCredentials: true });
      setMovies((prev) => prev.filter((movie) => movie._id !== movieId));
      toast.success("Movie deleted successfully");
    } catch (err) {
      console.error("Delete movie error:", err);
      toast.error("Failed to delete movie");
    }
  };

  const handleTogglePublish = async (movieId) => {
    try {
      const res = await axios.patch(
        `/api/v1/movies/${movieId}/toggle-publish`,
        {},
        { withCredentials: true }
      );
      const updatedMovie = res.data.data;
      setMovies((prev) =>
        prev.map((movie) => (movie._id === updatedMovie._id ? updatedMovie : movie))
      );
      toast.success(
        `Movie ${updatedMovie.isPublished ? "published" : "unpublished"} successfully`
      );
    } catch (err) {
      console.error("Toggle publish error:", err);
      toast.error("Failed to update movie status");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        🎬 Explore Movies
      </h1>

      {/* Search & Sort */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 p-3 rounded-xl flex-1 max-w-sm shadow-sm focus:ring focus:ring-indigo-300 outline-none transition"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 p-3 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
        </select>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border border-gray-300 p-3 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {loading && <p className="text-center animate-pulse">Loading movies...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* Movies Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {movies.map((movie) => (
            <motion.div
              key={movie._id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="group border rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 bg-white"
            >
              {movie.thumbnail ? (
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="p-5">
                <h2 className="font-bold text-xl text-gray-800 truncate mb-1">
                  {movie.title}
                </h2>
                {movie.series?.title && (
                  <p className="text-sm text-indigo-600 mb-1">
                    Series: {movie.series.title}
                  </p>
                )}
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {movie.description}
                </p>
                <p className="text-sm text-indigo-500 font-semibold">
                  {movie.isPaid ? `₹${movie.price}` : "Free"}
                </p>

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => handleTogglePublish(movie._id)}
                      className={`text-xs px-3 py-1 rounded-lg shadow hover:shadow-md transition ${
                        movie.isPublished
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                    >
                      {movie.isPublished ? "Published" : "Unpublished"}
                    </button>
                    <button
                      onClick={() => handleDelete(movie._id)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-6 mt-10">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-5 py-2 bg-indigo-500 text-white rounded-xl shadow hover:shadow-lg disabled:opacity-50 transition"
        >
          Prev
        </button>
        <span className="self-center font-semibold text-lg">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-5 py-2 bg-indigo-500 text-white rounded-xl shadow hover:shadow-lg transition"
        >
          Next
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}