import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useResource from '../hooks/useResource';
import State from './ui/State';
import api from '../services/api';
import { paths, catalogData, money, message, dateLabel } from '../utils/contracts';
export default function Catalog({ kind }) {
    const movie = kind === 'movie';
    const [query, setQuery] = useState('');
    const [debounced, setDebounced] = useState('');
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('createdAt');
    const [direction, setDirection] = useState('desc');
    const [busy, setBusy] = useState('');
    const limit = 10;
    useEffect(() => { const timer = setTimeout(() => { setDebounced(query.trim()); setPage(1); }, 300); return () => clearTimeout(timer); }, [query]);
    const params = new URLSearchParams({ page: String(page), limit: String(limit), query: debounced, sortBy: sort, sortType: direction }).toString();
    const resource = useResource(movie ? paths.movies : paths.series, params);
    let data = { items: [], totalPages: null, hasNext: false };
    let invalid = '';
    if (resource.data != null)
        try {
            data = catalogData(resource.data, kind, limit);
        }
        catch (err) {
            invalid = message(err);
        }
    async function action(item, remove) { if (busy)
        return; if (remove && !window.confirm(`Permanently delete ${item.title}? This can remove media and affect purchasers.`))
        return; setBusy(item._id); try {
        if (remove)
            await api.delete(movie ? `${paths.movies}/${item._id}` : `/api/v1/series/remove-series/${item._id}`);
        else
            await api.patch(`/api/v1/${movie ? 'movies' : 'series'}/${item._id}/toggle-publish`, {});
        toast.success(remove ? 'Deleted' : 'Publication updated');
        if (remove && data.items.length === 1 && page > 1)
            setPage(p => p - 1);
        else
            resource.reload();
    }
    catch (err) {
        toast.error(message(err));
    }
    finally {
        setBusy('');
    } }
    return <div className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="page-title">{movie ? 'Movies' : 'Series'}</h1><Link className="btn" to={movie ? '/movies/add' : '/series/add'}>Add {kind}</Link></div><div className="panel grid gap-3 sm:grid-cols-3"><label>Search<input value={query} maxLength={100} onChange={e => setQuery(e.target.value)} placeholder="Search title…"/></label><label>Sort by<select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}><option value="createdAt">Created date</option><option value="title">Title</option><option value="price">Price</option></select></label><label>Order<select value={direction} onChange={e => { setDirection(e.target.value); setPage(1); }}><option value="desc">Descending</option><option value="asc">Ascending</option></select></label></div><State resource={resource}>{invalid ? <p role="alert" className="panel text-red-700">{invalid}</p> : <><div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">{data.items.map(item => <article className="panel !p-0 overflow-hidden" key={item._id}>{item.thumbnail ? <img src={item.thumbnail} alt={item.title} loading="lazy" className="w-full h-44 object-cover bg-slate-200"/> : <div className="h-44 bg-slate-200 grid place-items-center">No thumbnail</div>}<div className="p-4 space-y-3"><h2 className="font-bold text-lg break-words">{item.title}</h2><div className="flex flex-wrap gap-2 text-xs"><span className={`rounded px-2 py-1 ${item.isPublished ? 'bg-green-100 text-green-800' : 'bg-slate-200'}`}>{item.isPublished ? 'Published' : 'Draft'}</span><span className="bg-indigo-50 rounded px-2 py-1">{item.isPaid ? money(item.price) : 'Free'}</span></div><p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>{!movie && <p className="text-sm">{item.seasonsCount ?? 0} seasons · {item.episodesCount ?? 0} episodes</p>}<p className="text-xs text-slate-500 break-all">ID: {item._id}<br />{dateLabel(item.createdAt)}</p><div className="flex flex-wrap gap-2">{!movie && <><Link className="btn-secondary" to={`/series/${item._id}/seasons`}>Seasons</Link><Link className="btn-secondary" to={`/series/${item._id}/edit`}>Edit</Link></>}<button className="btn-secondary" disabled={Boolean(busy)} onClick={() => action(item, false)}>{item.isPublished ? 'Unpublish' : 'Publish'}</button><button className="btn-danger" disabled={Boolean(busy)} onClick={() => action(item, true)}>Delete</button></div></div></article>)}</div>{!data.items.length && <p className="panel">No {kind} records on this page.</p>}<div className="flex items-center justify-center gap-3"><button className="btn-secondary" disabled={page === 1 || Boolean(busy)} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button><span>Page {page}{data.totalPages !== null ? ` of ${Math.max(1, data.totalPages)}` : ''}</span><button className="btn-secondary" disabled={Boolean(busy) || (movie ? page >= data.totalPages : !data.hasNext)} onClick={() => setPage(p => p + 1)}>Next</button></div>{!movie && <p className="text-center text-xs text-slate-500">Series API does not return total pages; a full page may have another page.</p>}</>}</State></div>;
}
