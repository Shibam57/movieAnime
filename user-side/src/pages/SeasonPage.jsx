import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function SeasonPage() {
  const { seriesId, seasonId } = useParams();
  const [season, setSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/v1/season/seasons/${seasonId}`
        );
        console.log("Season API response:", res.data);
        setSeason(res.data.data); 
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load season");
      } finally {
        setLoading(false);
      }
    };

    fetchSeason();
  }, [seasonId]);

  if (loading) return <p>Loading season...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {season?.title || `Season ${season?.seasonNumber}`}
      </h1>
      <p className="mb-6">{season?.description}</p>

      <h2 className="text-xl font-semibold mb-2">Episodes</h2>
      <ul className="space-y-3">
        {season?.episodes?.length > 0 ? (
          season.episodes.map((episode) => (
            <li
              key={episode._id}
              className="p-4 border rounded-lg hover:bg-gray-100"
            >
              <Link
                to={`/series/${seriesId}/season/${seasonId}/episode/${episode._id}`}
                className="text-blue-600 font-medium"
              >
                {episode.title}
              </Link>
              <p className="text-sm text-gray-600">{episode.description}</p>
            </li>
          ))
        ) : (
          <p>No episodes found.</p>
        )}
      </ul>
    </div>
  );
}