import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import Poster from './Poster';
import { contentPath, genreNames, money } from '../utils/contracts';
export default function ContentCard({ item, type }) {
    const path = contentPath(type, item?._id);
    if (!path)
        return null;
    return <Link to={path} className="group block overflow-hidden rounded-2xl bg-gray-900 border border-white/10 hover:border-indigo-400 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400">
    
    <div className="relative aspect-video overflow-hidden">
    <Poster src={item.thumbnail} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105"/>
      
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
      
    <span className="absolute top-2 right-2 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold">{item.isPaid == null ? type : item.isPaid ? money(item.price) : 'Free'}</span>
      
    <Play aria-hidden="true" className="absolute bottom-3 left-3 text-white bg-red-600 rounded-full p-2 w-10 h-10"/>
    
    </div>
    <div className="p-4">
    <p className="text-xs text-indigo-300">
    {type}
    {item.episodeNumber ? ` · Episode ${item.episodeNumber}` : ''}
    </p>
    <h3 className="font-semibold text-lg line-clamp-2">{item.title || 'Untitled'}</h3>
    <p className="text-sm text-gray-400 line-clamp-2 mt-1">{item.description}</p>
    <div className="flex flex-wrap gap-2 mt-2">{genreNames(item).slice(0, 3).map((genre, i) => <span key={`${genre}-${i}`} className="text-xs rounded bg-indigo-950 px-2 py-1">{genre}</span>)}</div>
    </div>
  
    </Link>;
}
