import { useSearchParams } from 'react-router-dom';
import useApiResource from '../hooks/useApiResource';
import State from '../components/State';
import ContentCard from '../components/ContentCard';
import { searchItems } from '../utils/contracts';
export default function SearchResultsPage() {
    const [params] = useSearchParams();
    const query = (params.get('q') || '').trim();
    const resource = useApiResource(query && query.length <= 100 ? `/api/v1/content/search?q=${encodeURIComponent(query)}` : null);
    const items = searchItems(resource.data);
    return <section className="page-shell">
    <h1 className="text-3xl font-bold mb-6">Search {query && <span className="text-indigo-300">· {query}</span>}</h1>
    {!query ? <p>Enter a title in the search bar.</p> : query.length > 100 ? <p role="alert">Search must be at most 100 characters.</p> : <State loading={resource.loading} error={resource.error} retry={resource.reload}>{items.length ? <div className="catalog-grid">{items.map(item => <ContentCard key={`${item.type}-${item._id}`} item={item} type={item.type}/>)}</div> : <p>No results found.</p>}</State>}
    </section>;
}
