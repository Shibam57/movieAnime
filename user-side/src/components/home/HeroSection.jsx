import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Film, Tv, Play } from 'lucide-react';
import { array } from '../../utils/contracts';
import Poster from '../Poster';
export default function HeroSection({ movies }) {
    const reduced = useReducedMotion();
    const posters = array(movies).filter(m => m.thumbnail).slice(0, 6);
    return <section className="relative min-h-[65vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-950 via-indigo-950 to-black">
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden opacity-30">
    <div className="absolute -right-12 top-0 grid grid-cols-2 md:grid-cols-3 gap-3 rotate-6 w-full md:w-2/3">{posters.map(m => <Poster key={m._id} src={m.thumbnail} className="w-full aspect-video rounded-xl object-cover"/>)}</div>
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"/>
    </div>
    <motion.div initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
    <p className="uppercase tracking-[.25em] text-indigo-300 text-sm font-semibold">Your next great watch</p>
    <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight max-w-3xl mt-5">Movies, Series <span className="text-red-400">& Anime.</span></h1>
    <p className="text-gray-300 text-lg max-w-xl mt-5">Explore the catalog, discover new favorites and watch free or unlock paid content.</p>
    <div className="flex flex-wrap gap-3 mt-8">
    <Link to="/movies" className="btn flex items-center gap-2"><Film size={20}/> Browse movies</Link>
    <Link to="/series" className="btn-secondary flex items-center gap-2"><Tv size={20}/> Explore series</Link>
    </div>
    <p className="mt-8 flex items-center gap-2 text-sm text-gray-400"><Play size={15}/> Stream on your favorite device</p>
    </motion.div>
    </section>;
}
