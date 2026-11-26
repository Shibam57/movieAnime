import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import useApiResource from '../hooks/useApiResource';
import useAccess from '../hooks/useAccess';
import State from '../components/State';
import Poster from '../components/Poster';
import PurchaseButton from '../components/PurchaseButton';
import { array, genreNames } from '../utils/contracts';
export default function SeriesDetails() {
    const { seriesId } = useParams();
    const { user } = useAuth();
    const { revision } = usePayment();
    const details = useApiResource(`/api/v1/series/seriesId/${seriesId}`);
    const series = details.data;
    return <section className="page-shell">
    <Link to="/series" className="text-indigo-300">← All series</Link>
    <State loading={details.loading} error={details.error} retry={details.reload}>{series && <article className="mt-5 rounded-2xl overflow-hidden bg-gray-900 border border-white/10">
        <Poster src={series.thumbnail} alt={series.title} className="w-full max-h-96 object-cover"/>
        <div className="p-5 md:p-8 space-y-5">
        <h1 className="text-3xl md:text-4xl font-bold">{series.title}</h1>
        <p className="text-gray-300">{series.description}</p>
        <div className="flex gap-2 flex-wrap">{genreNames(series).map((g, i) => <Link key={`${g}-${i}`} className="btn-secondary" to={`/genre/${encodeURIComponent(g.toLowerCase())}`}>{g}</Link>)}</div>
        {series.isPaid && <SeriesAccess key={`${seriesId}-${user?._id || 'guest'}-${revision}`} series={series}/>}
        <h2 className="text-2xl font-semibold">Seasons</h2>
            {array(series.seasons).length ? <div className="space-y-3">{array(series.seasons).slice().sort((a, b) => a.seasonNumber - b.seasonNumber).map(s => <Link key={s._id} to={`/series/${seriesId}/season/${s._id}/episodes`} className="flex flex-wrap justify-between gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/10">
                <span>Season {s.seasonNumber}: {s.title}</span>
                <span className="text-indigo-300">{s.episodesCount ?? array(s.episodes).length} episodes →</span>
                </Link>)}</div> : <p>No seasons available yet.</p>}
        </div>
        </article>}</State>
    </section>;
}
function SeriesAccess({ series }) {
    const access = useAccess(series._id, 'Series');
    return <State loading={access.loading} error={access.error} retry={access.reload}>{access.allowed ? <p className="text-green-300">Series purchased — you have access to its episodes.</p> : <div className="rounded-xl bg-indigo-950/40 p-5 border border-indigo-400/30"><PurchaseButton item={series} type="Series" onSuccess={access.reload}/></div>}</State>;
}
