import { useParams } from 'react-router-dom';
import ContentForm from '../../components/ContentForm';
import State from '../../components/ui/State';
import useResource from '../../hooks/useResource';
export default function EditEpisode() { const { seriesId, seasonId, episodeId } = useParams(); const resource = useResource(`/api/v1/episode/user-episode/${episodeId}`); return <State resource={resource}>{resource.data?.season?._id === seasonId ? <ContentForm key={episodeId} kind="episode" edit initial={resource.data} endpoint={`/api/v1/episode/${episodeId}`} back={`/series/${seriesId}/seasons/${seasonId}/episodes`}/> : <p>Episode not found in this season.</p>}</State>; }
