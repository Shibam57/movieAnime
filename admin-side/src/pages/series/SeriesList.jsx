import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SeriesList() {
  const [series, setSeries] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchSeries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/v1/series/all-series", {
        params: { page, limit, query, sortBy, sortType },
      });
      setSeries(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch series");
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, [page, query, sortBy, sortType]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.h1
        className="text-3xl font-extrabold text-gray-800 mb-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        📺 All Series
      </motion.h1>

      {/* Search & Sort */}
      <motion.div
        className="flex flex-wrap gap-4 mb-6 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.input
          type="text"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          whileFocus={{ scale: 1.05 }}
          className="border p-3 rounded-lg flex-1 max-w-sm shadow-sm focus:ring focus:ring-indigo-300 outline-none transition"
        />
        <motion.select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          whileHover={{ scale: 1.05 }}
          className="border p-3 rounded-lg shadow-sm transition"
        >
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
        </motion.select>
        <motion.select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          whileHover={{ scale: 1.05 }}
          className="border p-3 rounded-lg shadow-sm transition"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </motion.select>
      </motion.div>

      {/* Content */}
      {loading && <p className="text-center animate-pulse">Loading...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      <motion.div
        layout
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {series.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => navigate(`/series/${item._id}/seasons`)}
              className="group border rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer bg-white"
            >
              {item.thumbnail ? (
                <motion.img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h2 className="font-bold text-xl text-gray-800 truncate">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{item.genre}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center mt-3 text-sm text-gray-700">
                  <span>Seasons: {item.seasonsCount}</span>
                  <span>Episodes: {item.episodesCount}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      <motion.div
        className="flex justify-center gap-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50 shadow hover:bg-indigo-600 transition"
        >
          Prev
        </motion.button>
        <span className="self-center font-semibold">Page {page}</span>
        <motion.button
          onClick={() => setPage((p) => p + 1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
        >
          Next
        </motion.button>
      </motion.div>
    </div>
  );
}