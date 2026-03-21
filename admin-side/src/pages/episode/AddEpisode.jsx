import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function AddEpisodeForm() {
  const {seasonId, seriesId} = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    episodeNumber: "",
    isPaid: false,
    price: "",
    releaseDate: "",
  });
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.name === "video") setVideo(e.target.files[0]);
    if (e.target.name === "thumbnail") setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("episodeNumber", formData.episodeNumber);
      payload.append("isPaid", formData.isPaid);
      payload.append("price", formData.price);
      payload.append("releaseDate", formData.releaseDate);
      payload.append("videoUrl", video);
      payload.append("thumbnail", thumbnail);

      const res = await axios.post(
        `/api/v1/episode/create-episode/${seasonId}`,
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSuccess(res.data.message);
      setFormData({
        title: "",
        description: "",
        episodeNumber: "",
        isPaid: false,
        price: "",
        releaseDate: "",
      });
      setVideo(null);
      setThumbnail(null);
      navigate(`/series/${seriesId}/seasons/${seasonId}/episodes`)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded max-w-lg mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold">Add Episode</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <input
        type="text"
        name="title"
        placeholder="Episode Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        type="number"
        name="episodeNumber"
        placeholder="Episode Number"
        value={formData.episodeNumber}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        type="date"
        name="releaseDate"
        value={formData.releaseDate}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isPaid"
          checked={formData.isPaid}
          onChange={handleChange}
        />
        <span>Paid Episode?</span>
      </label>

      {formData.isPaid && (
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      )}

      <input
        type="file"
        name="video"
        accept="video/*"
        placeholder="Upload Video"
        onChange={handleFileChange}
        className="border p-2 w-full"
        required
      />

      <input
        type="file"
        name="thumbnail"
        accept="image/*"
        placeholder="Upload Thumbnail"
        onChange={handleFileChange}
        className="border p-2 w-full"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Create Episode"}
      </button>
    </form>
  );
}