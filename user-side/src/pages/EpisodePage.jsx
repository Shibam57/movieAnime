import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function EpisodePage() {
  const { seriesId, seasonId } = useParams();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/episode/season/${seasonId}`);
        setEpisodes(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load episodes");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [seasonId]);

  if (loading) return <p className="text-white p-6">Loading episodes...</p>;
  if (error) return <p className="text-red-400 p-6">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl shadow-2xl backdrop-blur-md bg-white/10 border border-white/20 overflow-hidden max-w-6xl mx-auto p-8"
      >
        <h1 className="text-3xl font-bold mb-8 text-white">📺 Episodes</h1>

        {episodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map((episode) => (
              <motion.div
                key={episode._id}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gray-900/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-red-500/20 group"
              >
                {/* Thumbnail */}
                <Link
                  to={`/series/${seriesId}/season/${seasonId}/episode/${episode._id}`}
                  className="relative block"
                >
                  <img
                    src={episode.thumbnail || "/placeholder.jpg"}
                    alt={episode.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${
                      episode.isPaid
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {episode.isPaid ? `Paid • ₹${episode.price}` : "Free"}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    <Play className="w-14 h-14 text-white bg-red-600 p-3 rounded-full shadow-lg" />
                  </div>
                </Link>

                {/* Info Section */}
                <div className="p-4 text-white">
                  <h3 className="text-lg font-semibold mb-1">
                    {episode.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {episode.description}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-400">
                      Ep {episode.episodeNumber}
                    </span>
                    <Link
                      to={`/series/${seriesId}/season/${seasonId}/episode/${episode._id}`}
                      className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg shadow hover:bg-indigo-700 transition"
                    >
                      Watch →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No episodes found.</p>
        )}
      </motion.div>
    </div>
  );
}