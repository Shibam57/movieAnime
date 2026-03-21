import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function EpisodeList() {
  const { seriesId, seasonId } = useParams();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchEpisodes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/v1/episode/season/${seasonId}`);
      setEpisodes(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch episodes");
      setEpisodes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (episodeId) => {
    if (!window.confirm("Delete this episode?")) return;
    try {
      await axios.delete(`/api/v1/episode/delete-episode/${episodeId}`);
      fetchEpisodes();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchEpisodes();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Episodes</h1>
        <button
          onClick={() =>
            navigate(`/series/${seriesId}/seasons/${seasonId}/episodes/add`)
          }
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          + Add Episode
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Episode Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {episodes.map((episode) => (
            <motion.div
              key={episode._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="group border rounded-2xl shadow-md bg-white overflow-hidden hover:shadow-xl flex flex-col"
            >
              {/* Thumbnail */}
              {episode.thumbnail ? (
                <motion.img
                  src={episode.thumbnail}
                  alt={episode.title}
                  className="w-full h-40 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* Details */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="font-semibold text-lg mb-1">
                    Ep {episode.episodeNumber}: {episode.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {episode.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Release:{" "}
                    {episode.releaseDate
                      ? new Date(episode.releaseDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {episode.isPaid && (
                    <p className="text-sm text-red-500 font-medium mt-1">
                      Paid • ₹{episode.price}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-4 text-sm">
                  <button
                    onClick={() =>
                      navigate(
                        `/series/${seriesId}/seasons/${seasonId}/episodes/${episode._id}/edit`
                      )
                    }
                    className="text-green-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(episode._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}