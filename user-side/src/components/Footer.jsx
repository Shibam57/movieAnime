import { Link } from 'react-router-dom';
export default function Footer() {
    return <footer className="bg-gray-950 text-gray-400 py-10 border-t border-white/10"><div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">
    <div>
    <Link to="/" className="text-xl font-bold text-white">MovieAnime</Link>
    <p className="mt-2 text-sm">Discover movies, series and anime.</p>
    </div>
    <nav aria-label="Footer navigation" className="flex flex-wrap gap-5 text-sm">
    <Link to="/movies">Movies</Link>
    <Link to="/series">Series</Link>
    <Link to="/payments">Purchases</Link>
    <Link to="/profile">Profile</Link>
    </nav>
    <p className="text-sm">© {new Date().getFullYear()} MovieAnime</p>
    </div></footer>;
}
