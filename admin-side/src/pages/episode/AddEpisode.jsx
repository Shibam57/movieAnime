import { useParams } from 'react-router-dom';
import ContentForm from '../../components/ContentForm';
export default function AddEpisode() { const { seriesId, seasonId } = useParams(); return <ContentForm key={seasonId} kind="episode" endpoint={`/api/v1/episode/create-episode/${seasonId}`} back={`/series/${seriesId}/seasons/${seasonId}/episodes`}/>; }
