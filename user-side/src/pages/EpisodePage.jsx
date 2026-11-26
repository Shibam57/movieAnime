import { Link, useParams } from 'react-router-dom';
import useApiResource from '../hooks/useApiResource';
import State from '../components/State';
import ContentCard from '../components/ContentCard';
import { array } from '../utils/contracts';
export default function EpisodePage() {
    const { seriesId, seasonId } = useParams();
    const season = useApiResource(`/api/v1/season/seasons/${seasonId}`);
    const episodes = useApiResource(`/api/v1/episode/season/${seasonId}`);
    const items = array(episodes.data).slice().sort((a, b) => a.episodeNumber - b.episodeNumber);
    return <section className="page-shell">
    <Link to={`/series/${seriesId}`} className="text-indigo-300">← Back to series</Link>
    <h1 className="text-3xl font-bold my-6">{season.data?.title || 'Season episodes'}</h1>
    <State loading={episodes.loading} error={episodes.error} retry={episodes.reload}>{items.length ? <div className="catalog-grid">{items.map(item => <ContentCard key={item._id} item={item} type="Episode"/>)}</div> : <p>No episodes available.</p>}</State>
    </section>;
}
