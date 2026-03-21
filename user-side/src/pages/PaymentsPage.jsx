import { useEffect } from "react";
import { usePayment } from "../context/PaymentContext";

export default function PaymentsPage() {
  const { purchases, loading, hasAccess } = usePayment();

  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;

  if (purchases.length === 0)
    return <p className="text-center mt-10 text-white">No purchases yet.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">My Purchases</h1>
      <ul className="space-y-4">
        {purchases.map((purchase) => (
          <li
            key={purchase._id}
            className="bg-white/10 p-4 rounded-xl flex justify-between items-center border border-white/20"
          >
            <div>
              <p className="font-semibold text-lg">
                {purchase.contentId?.title || "Untitled"}
              </p>
              <p className="text-gray-300">
                {purchase.contentModel} | ₹{purchase.amount} | Method:{" "}
                {purchase.method}
              </p>
              <p className="text-green-400">
                Status: {purchase.paymentStatus}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}