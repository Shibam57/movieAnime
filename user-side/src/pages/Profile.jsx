import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await axios.get("/api/v1/users/profile", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched user data:", data);
        setUser(data.data); // adjust if ApiResponse wraps data
      } catch (err) {
        console.error("Failed to fetch user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <p className="text-center mt-10 text-gray-300">Loading profile...</p>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-gray-900 text-gray-200 rounded-xl shadow-lg">
      <div className="flex items-center gap-6">
        <img
          src={user.avatar || "/placeholder.jpg"}
          alt="User Avatar"
          className="w-24 h-24 rounded-full object-cover border border-gray-700"
        />
        <div>
          <h1 className="text-2xl font-bold text-white">{user.fullname}</h1>
          <p className="text-gray-400">@{user.username || "no-username"}</p>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p><span className="font-semibold">User ID:</span> {user._id}</p>
        <p><span className="font-semibold">Role:</span> {user.role || "User"}</p>
        <p><span className="font-semibold">Joined:</span> {user.createdAt ? new Date(user.createdAt).toDateString() : "N/A"}</p>
      </div>
    </div>
  );
}