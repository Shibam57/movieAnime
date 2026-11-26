import { useParams } from 'react-router-dom';
import ContentForm from '../../components/ContentForm';
import State from '../../components/ui/State';
import useResource from '../../hooks/useResource';
export default function EditSeries() { const { seriesId } = useParams(); const resource = useResource(`/api/v1/series/seriesId/${seriesId}`); return <State resource={resource}>{resource.data ? <ContentForm key={seriesId} kind="series" edit initial={resource.data} endpoint={`/api/v1/series/update-series/${seriesId}`} back="/series/all"/> : <p>Series not found.</p>}</State>; }
