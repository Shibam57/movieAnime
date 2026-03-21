import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function WatchMovie() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // 🎬 Fetch current movie
        const res = await axios.get(`/api/v1/movies/${movieId}`);
        setMovie(res.data.data);

        // 🎥 Fetch related movies by genre (or all if none)
        if (res.data.data?.genres?.length > 0) {
          const genreId = res.data.data.genres[0]._id;
          const relatedRes = await axios.get(`/api/v1/movie/genre/${genreId}`);
          setRelatedMovies(
            relatedRes.data.data.filter((m) => m._id !== movieId)
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  if (loading) return <p className="text-center text-gray-400 p-6">Loading...</p>;
  if (!movie) return <p className="text-center text-red-500 p-6">Movie not found</p>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row p-4 gap-6">
      {/* Main Video + Details */}
      <div className="flex-1">
        {/* Video Player */}
        <div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
            <video controls autoPlay className="w-full h-full object-cover">
                <source src={movie.videoUrl_1080p} type="video/mp4" label="1080p" />
                <source src={movie.videoUrl_720p} type="video/mp4" label="720p" />
                <source src={movie.videoUrl_480p} type="video/mp4" label="480p" />
                    Your browser does not support the video tag.
            </video>
            </div>

        {/* Movie Info */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold">{movie.title}</h1>
          <p className="text-gray-400 mt-2">{movie.description}</p>

          {/* Meta Info */}
          <div className="flex items-center gap-6 mt-4 text-gray-400 text-sm">
            <span>Duration: {movie.duration || "N/A"}</span>
            <span>
              {movie.releaseDate
                ? new Date(movie.releaseDate).toDateString()
                : "Unknown Date"}
            </span>
            <span>{movie.isPaid ? `₹${movie.price}` : "Free"}</span>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            ⬅ Back
          </button>
        </div>
      </div>

      {/* Sidebar - Related Movies */}
      <div className="w-full lg:w-96 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Related Movies</h2>
        {relatedMovies.length > 0 ? (
          relatedMovies.map((m) => (
            <div
              key={m._id}
              onClick={() => navigate(`/movie/${m._id}/watch`)}
              className="flex gap-3 cursor-pointer group hover:bg-white/10 p-2 rounded-lg transition"
            >
              <img
                src={m.thumbnail || "/placeholder.jpg"}
                alt={m.title}
                className="w-32 h-20 object-cover rounded-lg shadow-md group-hover:scale-105 transition"
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold line-clamp-2">{m.title}</h3>
                <p className="text-xs text-gray-400">
                  {m.isPaid ? `₹${m.price}` : "Free"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No related movies found.</p>
        )}
      </div>
    </div>
  );
}