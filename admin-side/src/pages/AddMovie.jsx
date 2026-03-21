import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function AddMovie() {
  const [movieData, setMovieData] = useState({
    title: "",
    description: "",
    duration: "",
    series: "",
    isPublished: false,
    isPaid: false,
    price: "",
  });
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e)=>{
    const {name, value, type, checked, files} = e.target

    if(type === "file"){
        if(name === "videoFile") setVideo(files[0]);
        if(name === "thumbnail") setThumbnail(files[0]);
    }
    else if(type === "checkbox"){
        setMovieData((prev)=>({
            ...prev,
            [name]: checked,
        }))
    }
    else{
        setMovieData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try {
        const formData = new FormData();
        for(const key in movieData){
          if (movieData[key] === "" || movieData[key] === null) continue;
          formData.append(key, movieData[key]);
        }
        if(video){
          formData.append("videoFile", video);
        }
        if(thumbnail){
          formData.append("thumbnail", thumbnail);
        }

        const res = await axios.post("/api/v1/movies", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })

        toast.success("Movie added successfully!");
        navigate("/movies/all");
    } catch (error) {
        console.error("Add Movie Error:", error.response?.data || error.message);
        toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto bg-gradient-to-b  p-8 rounded-2xl  mt-6"
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl space-y-5"
      >
        <motion.h2
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700"
        >
          <Film size={24} />Add Movie
        </motion.h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            value={movieData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            rows={3}
            name="description"
            value={movieData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium mb-1">Duration (in mins)</label>
          <input
            type="number"
            name="duration"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            value={movieData.duration}
            onChange={handleChange}
          />
        </div>

        {/* Video File */}
        <div>
          <label className="block text-sm font-medium mb-1">Video File</label>
          <input
            type="file"
            name="videoFile"
            accept="video/*"
            className="w-full border rounded-lg p-2 cursor-pointer"
            onChange={handleChange}
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            className="w-full border rounded-lg p-2 cursor-pointer"
            onChange={handleChange}
            required
          />
        </div>

        {/* Series */}
        <div>
          <label className="block text-sm font-medium mb-1">Series (optional)</label>
          <input
            type="text"
            name="series"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            placeholder="Series ID"
            value={movieData.series}
            onChange={handleChange}
          />
        </div>

        {/* Checkboxes */}
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={movieData.isPublished}
              onChange={handleChange}
            />
            <span>Published</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPaid"
              checked={movieData.isPaid}
              onChange={handleChange}
            />
            <span>Paid</span>
          </label>
        </div>

        {/* Price if Paid */}
        {movieData.isPaid && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              value={movieData.price}
              onChange={handleChange}
              min="0"
            />
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
        >
          Save Movie
        </motion.button>
      </motion.form>
      <ToastContainer position="top-right" autoClose={2000} />
    </motion.div>
  );
}