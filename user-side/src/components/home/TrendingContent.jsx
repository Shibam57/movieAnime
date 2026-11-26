import { Link } from 'react-router-dom';
import State from '../State';
import ContentCard from '../ContentCard';
import { array } from '../../utils/contracts';
export default function TrendingContent({ type, resource }) {
    const label = type === 'Movie' ? 'Movies' : 'Series';
    const items = array(resource.data);
    return <section className="bg-gradient-to-b from-gray-950 to-black py-14"><div className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="flex items-center justify-between gap-4 mb-7">
    <h2 className="text-2xl md:text-4xl font-bold">Trending <span className="text-red-400">{label}</span></h2>
    <Link className="text-indigo-300 text-sm" to={type === 'Movie' ? '/movies' : '/series'}>View all →</Link>
    </div>
    <State loading={resource.loading} error={resource.error} retry={resource.reload}>{items.length ? <div className="catalog-grid">{items.map(item => <ContentCard key={item._id} item={item} type={type}/>)}</div> : <p className="text-gray-400">No trending {label.toLowerCase()} yet.</p>}</State>
    </div></section>;
}
