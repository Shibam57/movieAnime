import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import SeriesCard from "../components/SeriesCard"; // ← import your SeriesCard

export default function GenreSeriesPage() {
  const { genreId } = useParams();
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/series/genre/${genreId}`);
        setSeries(data?.data || []);
      } catch (err) {
        console.error("Error fetching series by genre:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [genreId]);

  if (loading) {
    return (
      <div className="w-full py-20 text-center text-gray-400 animate-pulse">
        Loading {genreId} series...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-white">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold mb-8 capitalize"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {genreId} Series
      </motion.h1>

      {series.length === 0 ? (
        <motion.p
          className="text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No series found for this genre.
        </motion.p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {series.map((item, index) => (
            <SeriesCard key={item._id} series={item} /> 
          ))}
        </div>
      )}
    </div>
  );
}