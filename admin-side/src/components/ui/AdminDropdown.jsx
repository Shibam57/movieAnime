import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import axios from "axios";

export default function AdminDropdown() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      
      await axios.post("/api/v1/admins/admin-logout", {}, { 
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
        withCredentials: true 
      });

      
      localStorage.removeItem("admintoken");
      localStorage.removeItem("admin");
      
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <ul className="py-2">
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
        onClick={() => navigate("/admin/profile")}
      >
        <User size={16} /> <span>Profile</span>
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
        onClick={() => navigate("/settings")}
      >
        <Settings size={16} /> <span>Settings</span>
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-red-500"
        onClick={handleLogout}
      >
        <LogOut size={16} /> <span>Logout</span>
      </li>
    </ul>
  );
}