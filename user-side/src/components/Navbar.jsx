import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Film, User, Bell, LogOut, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const { user, logout } = useAuth(); // ✅ access user and logout from context
  const navigate = useNavigate();

  const loggedIn = !!user; // ✅ derive login state from user object

  const handleLogout = () => {
    logout(); // ✅ clear user and token from context and localStorage
    navigate("/login");
  };

  const protectedLinks = [
    { name: "Movies", path: "/movies" },
    { name: "Series", path: "/series" },
    { name: "Payments", path: "/payments" },
  ];

  const handleNavClick = (path) => {
    if (!loggedIn && path !== "/") {
      navigate("/login");
    } else {
      navigate(path);
    }
    setMobileOpen(false);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      try {
        const { data } = await axios.get(`/api/v1/content/search?q=${value}`);
        setResults([...data.data.movies, ...data.data.series, ...data.data.episodes]);
        setShowResults(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowResults(false);
      setResults([]);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900/80 backdrop-blur-lg z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-indigo-400 font-bold text-lg sm:text-xl">
          <img src={logo} alt="Logo" className="h-10 sm:h-10 lg:h-12 w-auto object-contain" />
        </Link>

        {/* Search bar (only for logged in users) */}
        {loggedIn && (
          <div className="relative w-1/3 hidden md:block">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/search?q=${query}`);
                  setShowResults(false);
                }
              }}
              placeholder="Search movies, series, episodes..."
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />

            {showResults && results.length > 0 && (
              <div className="absolute mt-2 w-full bg-gray-800 shadow-lg rounded-lg max-h-60 overflow-y-auto z-50">
                {results.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200 flex items-center gap-2"
                    onClick={() => {
                      navigate(`/details/${item._id}`);
                      setShowResults(false);
                      setQuery("");
                    }}
                  >
                    <img
                      src={item.thumbnail || "/placeholder.jpg"}
                      alt={item.title}
                      className="w-12 h-8 object-cover rounded-md shadow-md"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                      <span className="text-xs text-gray-400">
                        {item.type || (item.price ? "Paid" : "Free")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6">
          <motion.div whileHover={{ scale: 1.1, y: -2 }}>
            <button
              onClick={() => handleNavClick("/")}
              className="text-gray-300 hover:text-indigo-400 transition font-medium"
            >
              Home
            </button>
          </motion.div>

          {loggedIn &&
            protectedLinks.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <button
                  onClick={() => handleNavClick(link.path)}
                  className={`hover:text-indigo-400 ${
                    location.pathname.startsWith(link.path) ? "text-indigo-400" : ""
                  }`}
                >
                  {link.name}
                </button>
              </motion.div>
            ))}
        </div>

        {/* Right Side Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {loggedIn ? (
            <>
              <motion.button whileHover={{ scale: 1.2 }} className="text-gray-300 hover:text-indigo-400">
                <Bell size={22} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.2 }} className="text-gray-300 hover:text-indigo-400" onClick={() => navigate("/profile")}>
                <User size={22} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2 }}
                className="text-gray-300 hover:text-red-500"
                onClick={handleLogout}
              >
                <LogOut size={22} />
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-indigo-400 transition font-medium">
                Login
              </Link>
              <Link to="/signup" className="text-indigo-400 hover:text-indigo-500 transition font-medium">
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 hover:text-indigo-400 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-800/95 backdrop-blur-lg px-6 py-4 space-y-4"
          >
            <button
              onClick={() => handleNavClick("/")}
              className="block text-gray-300 hover:text-indigo-400 transition font-medium"
            >
              Home
            </button>

            {loggedIn &&
              protectedLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className="block text-gray-300 hover:text-indigo-400 transition font-medium"
                >
                  {link.name}
                </button>
              ))}

            <div className="flex flex-col gap-4 pt-4">
              {loggedIn ? (
                <>
                  <button className="text-gray-300 hover:text-indigo-400 flex items-center gap-2" onClick={() => navigate("/profile")}>
                    <User size={20} /> Profile
                  </button>
                  <button
                    className="text-gray-300 hover:text-red-500 flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-indigo-400">
                    Login
                  </Link>
                  <Link to="/signup" className="text-indigo-400 hover:text-indigo-500">
                    Signup
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}