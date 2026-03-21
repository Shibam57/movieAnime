import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">MovieAnime</h2>
            <p className="text-sm">
              Stream unlimited movies, series, and anime. Anytime, anywhere.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/series" className="hover:text-white transition">
                  Series
                </Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-white transition">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/anime" className="hover:text-white transition">
                  Anime
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1CVFDD79mG/" className="hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/shiba_m57?igsh=NGNjcmN4ZjhwYTRp" className="hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MovieAnime. All rights reserved.
        </div>
      </div>
    </footer>
  );
}