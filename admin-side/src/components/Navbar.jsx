import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bell, User } from "lucide-react";
import axios from "axios";
import AdminDropdown from "./ui/AdminDropdown";

export default function Navbar() {
  
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false); 
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("admintoken");
  const isAdmin = !!token;

  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    if (isAdmin) fetchNotifications();
  }, [isAdmin]);

  async function fetchNotifications() {
    try {
      const res = await axios.get("/api/v1/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-black via-gray-500 to-orange-600 text-white shadow-xl"
    >
      {/* Logo */}
      <div className="text-2xl font-extrabold tracking-wide">
        Admin<span className="text-yellow-300">Panel</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {isAdmin ? (
          <>
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              {/* Bell Icon */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="relative cursor-pointer"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell size={22} />
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-1 rounded-full">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </motion.div>

              {/* Notifications Dropdown */}
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-72 bg-white text-gray-800 rounded-xl shadow-xl z-50 p-4"
                >
                  <h3 className="font-bold mb-2">Notifications</h3>
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`p-2 mb-1 rounded-lg text-sm ${
                          n.isRead ? "bg-gray-100" : "bg-yellow-100"
                        }`}
                      >
                        {n.message}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No notifications</p>
                  )}
                </motion.div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={userRef}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer bg-white text-indigo-700 p-2 rounded-full shadow-lg"
                onClick={() => setOpen(!open)}
              >
                <User size={22} />
              </motion.div>

              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-xl shadow-xl z-50"
                >
                  <AdminDropdown />
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <div className="space-x-4">
            <a
              href="/admin/login"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold"
            >
              Login
            </a>
            <a
              href="/signup"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
            >
              Signup
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}