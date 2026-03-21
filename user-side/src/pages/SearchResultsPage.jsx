import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SeriesCard from "../components/SeriesCard"; // reuse your card

export default function SearchResultsPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/content/search?q=${query}`);
        setResults([
          ...data.data.movies,
          ...data.data.series,
          ...data.data.episodes,
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  if (loading) return <p className="text-center mt-10 text-gray-300">Loading results...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-6">
      <h1 className="text-2xl font-bold text-white mb-6">
        Search Results for:{" "}
        <span className="text-indigo-400">{query}</span>
      </h1>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((item) => (
            <SeriesCard key={item._id} series={item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No results found.</p>
      )}
    </div>
  );
}