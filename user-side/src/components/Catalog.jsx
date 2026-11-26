import { useState } from 'react';
import useApiResource from '../hooks/useApiResource';
import State from './State';
import ContentCard from './ContentCard';
import { array } from '../utils/contracts';
const LIMIT = 20;
export default function Catalog({ type, title, endpoint, paginated = true }) {
    const [page, setPage] = useState(1);
    const [input, setInput] = useState('');
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('createdAt:desc');
    const [sortBy, sortType] = sort.split(':');
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT), sortBy, sortType });
    if (query)
        params.set('query', query);
    const resource = useApiResource(paginated ? `${endpoint}?${params}` : endpoint);
    const list = type === 'Movie' ? array(resource.data?.movies) : array(resource.data);
    const hasNext = type === 'Movie' ? page < (resource.data?.totalPages || 0) : list.length === LIMIT;
    return <section className="page-shell">
    <h1 className="text-3xl font-bold mb-6">{title}</h1>
        {paginated && <form className="flex flex-wrap items-end gap-3 mb-6" onSubmit={e => {
                e.preventDefault();
                setPage(1);
                setQuery(input.trim());
            }}>
        <label className="flex-1 min-w-40">Filter by title<input className="field" value={input} maxLength={100} onChange={e => setInput(e.target.value)} placeholder="Search this catalog"/></label>
        <button className="btn" type="submit">Search</button>
        <label>Sort<select className="field" value={sort} onChange={e => {
                setSort(e.target.value);
                setPage(1);
            }}>
        <option value="createdAt:desc">Newest first</option>
        <option value="title:asc">Title A–Z</option>
        <option value="price:asc">Lowest price</option>
        <option value="price:desc">Highest price</option>
        </select></label>
        </form>}
 
    <State loading={resource.loading} error={resource.error} retry={resource.reload}>{list.length ? <div className="catalog-grid">{list.map(item => <ContentCard key={item._id} item={item} type={type}/>)}</div> : <p className="text-gray-400">No {type === 'Movie' ? 'movies' : 'series'} found.</p>}</State>
        {paginated && !resource.loading && !resource.error && (page > 1 || hasNext) && <div className="flex items-center justify-center gap-4 mt-8">
        <button className="btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span>Page {page}</span>
        <button className="btn-secondary" disabled={!hasNext} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>}
    </section>;
}
