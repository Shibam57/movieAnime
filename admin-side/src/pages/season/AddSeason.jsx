import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function AddSeason() {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("seasonNumber", data.seasonNumber);
      formData.append("title", data.title);
      if (data.thumbnail?.[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      const res = await axios.post(
        `/api/v1/season/series/${seriesId}/seasons`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        alert("Season created successfully");
        reset();
        setThumbnailPreview(null);
        navigate(`/series/${seriesId}/seasons`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create season");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Season</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Season Number
          </label>
          <input
            type="number"
            {...register("seasonNumber", { required: true })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("thumbnail", { required: true })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setThumbnailPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        {thumbnailPreview && (
          <motion.img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-48 object-cover rounded-lg mt-3 shadow"
          />
        )}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          disabled={loading}
          className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          {loading ? "Saving..." : "Add Season"}
        </motion.button>
      </form>
    </div>
  );
}