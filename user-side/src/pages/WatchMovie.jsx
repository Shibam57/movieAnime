import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import useApiResource from '../hooks/useApiResource';
import useAccess from '../hooks/useAccess';
import State from '../components/State';
import Poster from '../components/Poster';
import ContentCard from '../components/ContentCard';
import PurchaseButton from '../components/PurchaseButton';
import VideoPlayer from '../components/VideoPlayer';
import { array, money } from '../utils/contracts';
export default function WatchMovie() {
    const { movieId } = useParams();
    const { user } = useAuth();
    const { revision } = usePayment();
    const access = useAccess(user ? movieId : null, 'Movie');
    const resource = useApiResource(access.loading ? null : `/api/v1/movies/${movieId}`, `${user?._id || 'guest'}:${revision}:${access.allowed}`);
    const movie = resource.data;
    const related = useApiResource(`/api/v1/movies?limit=8`);
    const reload = () => {
        access.reload();
        resource.reload();
    };
    return <section className="page-shell">
    <Link to="/movies" className="text-indigo-300">← All movies</Link>
    <State loading={access.loading || resource.loading} error={resource.error} retry={reload}>{movie && <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-8 mt-6">
        <article className="space-y-5">
        <h1 className="text-3xl font-bold">{movie.title}</h1>
            {movie.videoFile && (!movie.isPaid || access.allowed) ? <VideoPlayer key={movie.videoFile} src={movie.videoFile} poster={movie.thumbnail} title={movie.title} onRetry={resource.reload}/> : <div className="rounded-xl bg-gray-900 overflow-hidden">
            <Poster src={movie.thumbnail} alt={movie.title} className="w-full aspect-video object-cover"/>
            <div className="p-5"><State error={access.error} retry={reload}>{movie.isPaid && !access.allowed ? <PurchaseButton item={movie} type="Movie" onSuccess={reload}/> : <p>Playback is currently unavailable. <button className="btn-secondary" onClick={reload}>Retry</button></p>}</State></div>
            </div>}
        <p className="text-gray-300">{movie.description}</p>
        <p className="text-gray-400">
        {movie.isPaid ? money(movie.price) : 'Free'}
        {movie.duration ? ` · Duration: ${Math.round(movie.duration)} sec` : ''}
        </p>
        </article>
        <aside>
        <h2 className="text-xl font-semibold mb-4">More movies</h2>
        <State loading={related.loading} error={related.error} retry={related.reload}><div className="space-y-4">{array(related.data?.movies).filter(m => m._id !== movieId).slice(0, 5).map(m => <ContentCard key={m._id} item={m} type="Movie"/>)}</div></State>
        </aside>
        </div>}</State>
    </section>;
}
