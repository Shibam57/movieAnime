import {useParams} from 'react-router-dom';
import Catalog from '../components/Catalog';
export default function GenreSeriesPage(){const {genreId}=useParams();return <Catalog key={genreId} type="Series" title={`${genreId} series`} endpoint={`/api/v1/series/genre/${encodeURIComponent(genreId)}`} paginated={false}/>;}
