import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
    // Prepare FormData for text + optional avatar
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key].trim());
        }

        const res = await axios.post("/api/v1/admins/admin-register", data, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
        });

        const result = res.data;

        if (result.success) {
            toast.success("Account created! Please verify email.", {
                autoClose: 2000,
                onClose: () => navigate("/admin/login"),
            });
        } 
        else {
            toast.error(result.message || "Signup failed. Try again.", {
                autoClose: 2000,
            });
        }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Something went wrong. Please try again.",
        {
          autoClose: 2000,
        }
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
      <motion.form
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6"
      >
        <motion.h2
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold flex items-center gap-2 text-indigo-700"
        >
          <UserPlus /> Sign Up
        </motion.h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Create Account
        </motion.button>
        <p className="text-center text-xs sm:text-sm text-gray-800 -mt-1">
            Already have an account?{" "}
            <Link to="/admin/login" className="text-blue-800 underline hover:text-white">
              Login
            </Link>
        </p>
      </motion.form>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}