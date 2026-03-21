import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function WatchEpisode() {
  const { seriesId, seasonId, episodeId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [relatedEpisodes, setRelatedEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [skipMessage, setSkipMessage] = useState("");

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const res = await axios.get(`/api/v1/episode/user-episode/${episodeId}`);
        console.log(res.data.data);
        setEpisode(res.data.data);

        // Fetch related episodes
        const relatedRes = await axios.get(`/api/v1/episode/season/${seasonId}`);
        setRelatedEpisodes(relatedRes.data.data.filter(ep => ep._id !== episodeId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisode();
  }, [seriesId, seasonId, episodeId]);

  // Handle double tap skip
  let lastTap = 0;
  const handleDoubleTap = (e) => {
    const currentTime = new Date().getTime();
    const tapGap = currentTime - lastTap;

    if (tapGap < 300 && videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const tapX = e.clientX - rect.left;
      const halfWidth = rect.width / 2;

      if (tapX < halfWidth) {
        // Left side → rewind 10s
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        showSkipMessage("⏪ -10s");
      } else {
        // Right side → forward 10s
        videoRef.current.currentTime = Math.min(
          videoRef.current.duration,
          videoRef.current.currentTime + 10
        );
        showSkipMessage("⏩ +10s");
      }
    }
    lastTap = currentTime;
  };

  const showSkipMessage = (msg) => {
    setSkipMessage(msg);
    setTimeout(() => setSkipMessage(""), 800);
  };

  if (loading) return <p className="text-center text-gray-400 p-6">Loading...</p>;
  if (!episode) return <p className="text-center text-red-500 p-6">Episode not found</p>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row p-4 gap-6">
      {/* Main video + details */}
      <div className="flex-1 relative">
        {/* Video Player */}
        <div
          className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg relative"
          onClick={handleDoubleTap}
        >
          <video
            ref={videoRef}
            src={episode.videoUrl}
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
          {/* Skip Message Overlay */}
          {skipMessage && (
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white bg-black/40">
              {skipMessage}
            </div>
          )}
        </div>

        {/* Episode Info */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold">{episode.title}</h1>
          <p className="text-gray-400 mt-2">{episode.description}</p>

          <div className="flex items-center gap-6 mt-4 text-gray-400 text-sm">
            <span>Season {episode.seasonNumber}</span>
            <span>Episode {episode.episodeNumber}</span>
            <span>
              {episode.releaseDate
                ? new Date(episode.releaseDate).toDateString()
                : "Unknown Date"}
            </span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            ⬅ Back
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-96 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Up Next</h2>
        {relatedEpisodes.length > 0 ? (
          relatedEpisodes.map((ep) => (
            <div
              key={ep._id}
              onClick={() =>
                navigate(`/series/${seriesId}/season/${seasonId}/episode/${ep._id}`)
              }
              className="flex gap-3 cursor-pointer group hover:bg-white/10 p-2 rounded-lg transition"
            >
              <img
                src={ep.thumbnail || "/placeholder.jpg"}
                alt={ep.title}
                className="w-32 h-20 object-cover rounded-lg shadow-md group-hover:scale-105 transition"
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold line-clamp-2">{ep.title}</h3>
                <p className="text-xs text-gray-400">Episode {ep.episodeNumber}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No more episodes available.</p>
        )}
      </div>
    </div>
  );
}