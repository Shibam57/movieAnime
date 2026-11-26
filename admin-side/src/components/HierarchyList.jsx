import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import useResource from '../hooks/useResource';
import State from './ui/State';
import { message, money, dateLabel } from '../utils/contracts';
export default function HierarchyList({ episode = false }) { const { seriesId, seasonId } = useParams(); const parent = `/series/${seriesId}/seasons`; const path = episode ? `${parent}/${seasonId}/episodes` : parent; const resource = useResource(episode ? `/api/v1/episode/season/${seasonId}` : `/api/v1/season/series/${seriesId}`); const [busy, setBusy] = useState(false); const items = Array.isArray(resource.data) ? resource.data : []; async function remove(item) { if (busy || !window.confirm(`Permanently delete ${item.title}?`))
    return; setBusy(true); try {
    await api.delete(episode ? `/api/v1/episode/delete-episode/${item._id}` : `/api/v1/season/seasons/${item._id}`);
    toast.success('Deleted');
    resource.reload();
}
catch (err) {
    toast.error(message(err));
}
finally {
    setBusy(false);
} } return <div className="space-y-5"><Link className="text-indigo-700 underline" to={episode ? parent : '/series/all'}>← Back to {episode ? 'seasons' : 'series'}</Link><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="page-title">{episode ? 'Episodes' : 'Seasons'}</h1><Link className="btn" to={`${path}/add`}>Add {episode ? 'episode' : 'season'}</Link></div><State resource={resource}>{!Array.isArray(resource.data) ? <p role="alert" className="panel">Unexpected list response.</p> : items.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(item => <article key={item._id} className="panel space-y-3">{item.thumbnail && <img className="w-full h-40 object-cover rounded" src={item.thumbnail} alt={item.title} loading="lazy"/>}<h2 className="font-bold break-words">{episode ? 'Episode' : 'Season'} {episode ? item.episodeNumber : item.seasonNumber}: {item.title}</h2>{episode && <><p className="text-sm line-clamp-3">{item.description}</p><p>{item.isPaid ? money(item.price) : 'Free'} · Release: {dateLabel(item.releaseDate)}</p></>}<div className="flex flex-wrap gap-2">{episode ? <Link className="btn-secondary" to={`${path}/${item._id}/edit`}>Edit details</Link> : <Link className="btn-secondary" to={`${path}/${item._id}/episodes`}>Manage episodes</Link>}<button className="btn-danger" disabled={busy} onClick={() => remove(item)}>Delete</button></div></article>)}</div> : <p className="panel">No {episode ? 'episodes' : 'seasons'} yet.</p>}</State></div>; }
