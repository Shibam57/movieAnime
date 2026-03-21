import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function SeasonList() {
  const { seriesId } = useParams();
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.8, y: -20 },
  };

  const fetchSeasons = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/v1/season/series/${seriesId}`);
      setSeasons(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch seasons");
      setSeasons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (seasonId) => {
    if (!window.confirm("Delete this season?")) return;
    try {
      await axios.delete(`/api/v1/season/seasons/${seasonId}`);
      
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Seasons</h1>
        <Link 
        to={`/series/${seriesId}/seasons/add`}
        className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 transition"
        >+ Add Season</Link>
      </motion.div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <motion.div
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {seasons.map((season) => (
            <motion.div
              key={season._id}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={()=>navigate(`/series/${seriesId}/seasons/${season._id}/episodes`)}
              exit="exit"
              className="group border rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 bg-white cursor-pointer"
            >
              {season.thumbnail ? (
                <motion.img
                  src={season.thumbnail}
                  alt={season.title}
                  initial={{ scale: 1.05 }}
                  whileHover={{ scale: 1.1 }}
                  className="w-full h-48 object-cover transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg">{season.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {season.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Episodes: {season.episodesCount}
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      navigate(`/series/${seriesId}/seasons/${season._id}/edit`)
                    }
                    className="text-green-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(season._id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}