import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, DollarSign, Loader } from "lucide-react";
import axios from "axios";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("admintoken");
  const isAdmin = !!token;

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        const res = await axios.get("/api/v1/payments/alladmin-payments");
        console.log(res)
        setPayments(res.data?.data || []); 
      } catch (err) {
        console.error("Failed to load payments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <CreditCard size={28} className="text-indigo-600" />
        <h1 className="text-2xl font-bold">Payments</h1>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center items-center h-40">
            <Loader className="animate-spin text-indigo-500" size={32} />
          </div>
          <div className="flex w-52 flex-col gap-4">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && payments.length > 0 && isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto bg-white rounded-xl shadow"
        >
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-8 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-8 py-2 text-left">Status</th>
                <th className="px-8 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{payment.user?.username || "N/A"}</td>
                  <td className="px-4 py-2 flex items-center">
                    <DollarSign size={16} className="text-green-600 mr-1" />
                    {payment.amount}
                  </td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      payment.status === "completed"
                        ? "text-green-600"
                        : payment.status === "failed"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {payment.statusCode}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && payments.length === 0 && (
        <div className="text-center text-gray-600 mt-10">
          No payments found.
        </div>
      )}
    </div>
  );
}