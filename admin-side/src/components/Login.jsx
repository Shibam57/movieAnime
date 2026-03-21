import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const resp = await axios.post("/api/v1/admins/admin-login", credentials,{
            headers: {
            "Content-Type": "application/json"
            }
        });

        const result = resp.data;
        const token = result.data.accessToken;

        if (result.success) {
            localStorage.setItem('admintoken', token);
            localStorage.setItem('admin', JSON.stringify(result.data.admin));

            toast.success("Welcome back!", {
            autoClose: 1500,
            onClose: () => navigate("/"), // or your protected route
        });
        } else {
            toast.error(result.message || "Login failed. Try again.", {
                autoClose: 2000,
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        toast.error(
        error.response?.data?.message || "Something went wrong. Please try again.", {
            autoClose: 2000,
        });
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
          className="text-blue-500 text-2xl font-bold text-center mb-6 drop-shadow-lg"
        >
          Login
        </motion.h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
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
          Sign In
        </motion.button>

        <p className='text-center text-sm text-gray-800 mt-2'>
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-800 underline hover:text-white">
              Sign Up
            </Link>
        </p>
      </motion.form>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}