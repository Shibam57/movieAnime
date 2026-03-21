import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Film,
  Layers,
  BarChart,
  Settings,
  DollarSign,
  PlusCircle,
  List,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const linkClasses =
    "flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200";
  const [movieOpen, setMovieOpen] = useState(false);
  const [seriesOpen, setSeriesOpen] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  

    const token = localStorage.getItem("admintoken");
    const isAdmin = !!token;

  return (
    <motion.aside
      initial={{ x: -260, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-64 bg-gradient-to-b from-black via-gray-500 to-orange-600 text-white h-auto p-5 shadow-xl"
    >
      <nav className="space-y-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-white text-indigo-700 font-semibold"
                : "hover:bg-white/20"
            }`
          }
        >
          <Home size={20} /> <span>Dashboard</span>
        </NavLink>

        {isAdmin ? (
          <>
          <NavLink
          to="/users"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-white text-indigo-700 font-semibold"
                : "hover:bg-white/20"
            }`
          }
        >
          <Users size={20} /> <span>Users</span>
        </NavLink>

        {/* Content Section */}
        <div>
          <span className="block font-semibold mt-6 mb-2 text-sm text-white/80">
            CONTENT
          </span>

          {/* Movies with dropdown */}
          <button
            onClick={() => setMovieOpen(!movieOpen)}
            className={`${linkClasses} w-full text-left ${
              movieOpen ? "bg-white/20" : "hover:bg-white/20"
            }`}
          >
            <Film size={20} />
            <span className="flex-1 text-left">Movies</span>
            {movieOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {movieOpen && (
            <div className="ml-8 mt-1 space-y-2">
              <NavLink
                to="/movies/add"
                className={({ isActive }) =>
                  `${linkClasses} text-sm ${
                    isActive
                      ? "bg-white text-indigo-700 font-semibold"
                      : "hover:bg-white/20"
                  }`
                }
              >
                <PlusCircle size={16} /> <span>Add Movie</span>
              </NavLink>
              <NavLink
                to="/movies/all"
                className={({ isActive }) =>
                  `${linkClasses} text-sm ${
                    isActive
                      ? "bg-white text-indigo-700 font-semibold"
                      : "hover:bg-white/20"
                  }`
                }
              >
                <List size={16} /> <span>All Movies</span>
              </NavLink>
            </div>
          )}

          {/* Series with dropdown */}
          <button
            onClick={() => setSeriesOpen(!seriesOpen)}
            className={`${linkClasses} w-full text-left ${
              seriesOpen ? "bg-white/20" : "hover:bg-white/20"
            }`}
          >
            <Layers size={20} />
            <span className="flex-1 text-left">Series</span>
            {seriesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {seriesOpen && (
            <div className="ml-8 mt-1 space-y-2">
              <NavLink
                to="/series/add"
                className={({ isActive }) =>
                  `${linkClasses} text-sm ${
                    isActive
                      ? "bg-white text-indigo-700 font-semibold"
                      : "hover:bg-white/20"
                  }`
                }
              >
                <PlusCircle size={16} /> <span>Add Series</span>
              </NavLink>
              <NavLink
                to="/series/all"
                className={({ isActive }) =>
                  `${linkClasses} text-sm ${
                    isActive
                      ? "bg-white text-indigo-700 font-semibold"
                      : "hover:bg-white/20"
                  }`
                }
              >
                <List size={16} /> <span>All Series</span>
              </NavLink>
            </div>
          )}
        </div>

        <NavLink
          to="/payments"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-white text-indigo-700 font-semibold"
                : "hover:bg-white/20"
            }`
          }
        >
          <DollarSign size={20} /> <span>Payments</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-white text-indigo-700 font-semibold"
                : "hover:bg-white/20"
            }`
          }
        >
          <BarChart size={20} /> <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-white text-indigo-700 font-semibold"
                : "hover:bg-white/20"
            }`
          }
        >
          <Settings size={20} /> <span>Settings</span>
        </NavLink>
          </>
        ):(
          <div className="space-x-4">
            <Link
              to="/admin/login"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
            >
              Signup
            </Link>
          </div>
        )}
      </nav>
    </motion.aside>
  );
}