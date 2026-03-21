import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CreditCard, Loader2 } from "lucide-react";

export default function Payments() {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); 

  
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in");

        const { data } = await axios.get(`/api/v1/series/seriesId/${seriesId}`, {
          withCredentials: true,
        });
        console.log("Fetched series data:", data);
        setSeries(data?.data);
      } catch (err) {
        console.error("Failed to fetch series:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [seriesId]);

  const handlePayment = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`/api/v1/payments/access/${seriesId}`, {
        // withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(`/series/${seriesId}`);
      
    } catch (err) {
      console.error("Payment failed:", err.response?.data || err.message);
    } finally {
      setProcessing(false);
    }
  };

  // const handlePayment = () => {
  //   navigate(`/series/${seriesId}`); // go to dedicated payments page
  // };

  if (loading) {
    return (
      <div className="w-full py-20 text-center text-gray-400 animate-pulse">
        Loading payment details...
      </div>
    );
  }

  if (!series) {
    return (
      <div className="w-full py-20 text-center text-red-500">
        Series not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-white">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Complete Payment
      </motion.h1>

      <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        <img
          src={series.thumbnail || "/placeholder.jpg"}
          alt={series.title}
          className="w-full h-56 object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-2">{series.title}</h2>
          <p className="text-gray-400 mb-4">{series.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-red-400">
              ₹{series.price}
            </span>
            <motion.button
              onClick={handlePayment}
              className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold"
              whileTap={{ scale: 0.95 }}
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay Now
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}