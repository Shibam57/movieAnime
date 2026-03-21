import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    avatar: null, 
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, avatar: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key]);
        }

        await axios.post("/api/v1/users/register", formData, { 
            withCredentials: true 
        });

        alert("Signup successful! Please log in.");
        navigate("/login");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
        />

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
        />

        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-6 p-3 rounded bg-gray-700 text-white"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded font-semibold transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}