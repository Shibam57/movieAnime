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
import { array } from '../utils/contracts';
export default function WatchEpisode() {
    const { episodeId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const { revision } = usePayment();
    const scope = `${user?._id || 'guest'}:${revision}`;
    const details = useApiResource(`/api/v1/episode/user-episode/${episodeId}`, scope);
    const episode = details.data;
    const seasonId = episode?.season?._id;
    const seriesId = episode?.season?.series;
    const parent = useApiResource(seriesId ? `/api/v1/series/seriesId/${seriesId}` : null);
    const related = useApiResource(seasonId ? `/api/v1/episode/season/${seasonId}` : null);
    const access = useAccess(user ? episodeId : null, 'Episode');
    const eligible = Boolean(episode && !authLoading && !access.loading && ((!episode.isPaid && parent.data && !parent.data.isPaid) || access.allowed));
    const playback = useApiResource(eligible ? `/api/v1/episode/play-episode/${episodeId}` : null, scope);
    const reload = () => {
        access.reload();
        details.reload();
        parent.reload();
        playback.reload();
    };
    return <section className="page-shell">
    <Link to={seriesId && seasonId ? `/series/${seriesId}/season/${seasonId}/episodes` : '/series'} className="text-indigo-300">← Back to episodes</Link>
    <State loading={details.loading} error={details.error} retry={details.reload}>{episode && <div className="mt-6 grid lg:grid-cols-[minmax(0,1fr)_300px] gap-8">
        <article className="space-y-5">
        <h1 className="text-3xl font-bold">{episode.title}</h1>
        <p className="text-gray-400">Season {episode.season?.seasonNumber ?? '—'} · Episode {episode.episodeNumber}</p>
        <State loading={authLoading || access.loading || parent.loading || playback.loading} error={access.error || parent.error || playback.error} retry={reload}>{playback.data?.videoUrl ? <VideoPlayer key={playback.data.videoUrl} src={playback.data.videoUrl} poster={episode.thumbnail} title={episode.title} onRetry={playback.reload}/> : <div className="bg-gray-900 rounded-xl overflow-hidden">
            <Poster src={episode.thumbnail} alt={episode.title} className="w-full aspect-video object-cover"/>
            <div className="p-5 space-y-4">{eligible ? <p>Playback unavailable. <button className="btn-secondary" onClick={reload}>Retry</button></p> : <>
                {episode.isPaid && <PurchaseButton item={episode} type="Episode" onSuccess={reload}/>}
                    {parent.data?.isPaid && <div>
                    <p className="mb-2">Unlock this episode with the full series purchase.</p>
                    <Link className="btn-secondary" to={`/series/${seriesId}`}>View series purchase</Link>
                    </div>}
                {!episode.isPaid && !parent.data?.isPaid && <p>Playback is unavailable.</p>}
                </>}</div>
            </div>}</State>
        <p className="text-gray-300">{episode.description}</p>
        </article>
        <aside>
        <h2 className="text-xl font-semibold mb-4">Up next</h2>
        <State loading={related.loading} error={related.error} retry={related.reload}><div className="space-y-4">{array(related.data).filter(e => e._id !== episodeId).sort((a, b) => a.episodeNumber - b.episodeNumber).map(e => <ContentCard key={e._id} item={e} type="Episode"/>)}</div></State>
        </aside>
        </div>}</State>
    </section>;
}
