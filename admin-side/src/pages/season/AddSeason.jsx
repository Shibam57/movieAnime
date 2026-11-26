import { useParams } from 'react-router-dom';
import ContentForm from '../../components/ContentForm';
export default function AddSeason() { const { seriesId } = useParams(); return <ContentForm key={seriesId} kind="season" endpoint={`/api/v1/season/series/${seriesId}/seasons`} back={`/series/${seriesId}/seasons`}/>; }
