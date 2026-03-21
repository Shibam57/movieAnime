import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddSeries() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("price", price);
    formData.append("isPublished", isPublished);
    formData.append("isPaid", isPaid);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    await axios.post("/api/v1/series", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/series/all");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 max-w-lg mx-auto bg-white rounded shadow"
    >
      <h2 className="text-xl font-semibold">Create New Series</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full rounded"
        rows={4}
      />

      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 w-full rounded"
        min="0"
      />

      <div className="flex items-center gap-4">
        <label>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />{" "}
          Published
        </label>
        <label>
          <input
            type="checkbox"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
          />{" "}
          Paid
        </label>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnail(e.target.files[0])}
        className="border p-2 w-full rounded"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Create Series
      </button>
    </form>
  );
}


