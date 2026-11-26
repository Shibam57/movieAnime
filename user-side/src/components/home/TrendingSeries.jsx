import TrendingContent from './TrendingContent';
import useApiResource from '../../hooks/useApiResource';
export default function TrendingSeries(){const resource=useApiResource('/api/v1/series/trending');return <TrendingContent type="Series" resource={resource}/>;}
