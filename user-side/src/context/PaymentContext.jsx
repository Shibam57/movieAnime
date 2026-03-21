import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState({});
  const navigate = useNavigate();

  // ✅ Fetch all purchases for logged-in user
  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await axios.get("/api/v1/payments/user-payments", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setPurchases(data?.data || []);
    } catch (err) {
      console.error("Failed to fetch purchases:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check if user has access to content
  const checkAccess = async (contentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const { data } = await axios.get(`/api/v1/payments/access/${contentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setHasAccess((prev) => ({ ...prev, [contentId]: data.hasAccess }));
      return data.hasAccess;
    } catch (err) {
      console.error("Access check failed:", err.response?.data || err.message);
      return false;
    }
  };

  // ✅ Start a payment flow and redirect after success
  const startPayment = async ({ contentId, contentModel, amount, title }) => {
    try {
      const token = localStorage.getItem("token");

      // Create order in backend
      const orderRes = await axios.post(
        "/api/v1/payments/create-payments",
        { contentId, contentModel, amount, currency: "INR" },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      const { order, paymentId } = orderRes.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "MovieAnime",
        description: `Payment for ${title}`,
        order_id: order.id,
        handler: async function (response) {
          await axios.post(
            "/api/v1/payments/verify",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              paymentId,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Refresh purchases after success
          fetchPurchases();

          // Redirect to the content page
          if (contentModel === "Series") navigate(`/series/${contentId}`);
          else if (contentModel === "Movie") navigate(`/movies/${contentId}`);
          else if (contentModel === "Episode") navigate(`/episode/${contentId}`);
        },
        theme: { color: "#ef4444" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment initiation failed:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <PaymentContext.Provider
      value={{ purchases, loading, hasAccess, checkAccess, startPayment, fetchPurchases }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => useContext(PaymentContext);