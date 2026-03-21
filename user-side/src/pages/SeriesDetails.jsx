import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { usePayment } from "../context/PaymentContext";

export default function SeriesDetails() {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { checkAccess, startPayment } = usePayment();
  const [userHasAccess, setUserHasAccess] = useState(false);
  const { hasAccess, buyContent } = usePayment();

  useEffect(() => {
    if (series?._id) {
      (async () => {
        const access = await checkAccess(series._id);
        setUserHasAccess(access);
      })();
    }
  }, [series, checkAccess]);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/v1/series/seriesId/${seriesId}`,
          { withCredentials: true }
        );
        console.log("Series API response:", data?.data);
        setSeries(data?.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load series details");
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [seriesId]);

  const handleBuy = async (method) => {
    const res = await buyContent({
      contentId: series._id,
      contentModel: "Series",
      amount: series.price,
      currency: "INR",
      method, 
    });
    if (res.success) {
      setSeries((prev) => ({ ...prev })); 
      
      alert(`✅ Purchase successful using ${method}!`);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!series) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-6">
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="rounded-2xl shadow-2xl backdrop-blur-md bg-white/10 border border-white/20 overflow-hidden max-w-5xl mx-auto"
  >
    {/* Thumbnail / Banner */}
    <div className="relative">
      <img
        src={series.thumbnail || "/placeholder.jpg"}
        alt={series.title}
        className="w-full h-72 object-cover rounded-t-2xl shadow-lg"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-2xl"></div>
      <h1 className="absolute bottom-6 left-6 text-4xl font-extrabold text-white drop-shadow-lg">
        {series.title}
      </h1>
    </div>

    <div className="p-8 text-white">
      <p className="text-gray-300 mb-6">{series.description}</p>

      {/* Genres */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {series.genres?.map((g) => (
          <span
            key={g._id}
            className="bg-indigo-600/80 text-white text-sm px-3 py-1 rounded-full shadow-md hover:bg-indigo-500 transition"
          >
            {g.name}
          </span>
        ))}
      </div>

      {/* 🔹 Payment check */}
      {series.isPaid && !userHasAccess ? (
        <div className="mt-4 bg-black/30 p-5 rounded-xl shadow-md border border-white/10">
        <p className="mb-3 text-lg font-semibold text-indigo-300">
          Price: ₹{series.price}
        </p>
        <button
        onClick={() =>
          startPayment({
            contentId: series._id,
            contentModel: "Series",
            amount: series.price,
            title: series.title,
          })
        }
        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
        >
          Buy with Razorpay
        </button>
      </div>
      ) : (
        <>
          {/* ✅ Seasons List */}
          <h2 className="text-2xl font-semibold mb-4">📺 Seasons</h2>
          {series.seasons?.length > 0 ? (
            <ul className="space-y-4">
              {series.seasons.map((season) => (
                <li
                  key={season._id}
                  className="flex items-center justify-between bg-white/10 border border-white/20 p-4 rounded-xl hover:bg-white/20 transition"
                >
                  <span className="font-medium">
                    Season {season.seasonNumber}: {season.title}
                  </span>
                  <Link
                    to={`/series/${series._id}/season/${season._id}/episodes`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
                  >
                    View Episodes →
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No seasons available yet.</p>
          )}
        </>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition"
        >
          ⬅ Back
        </button>
      </div>
    </div>
  </motion.div>
</div>
  );
}