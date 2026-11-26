import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { paidPrice, validateFile, validId, message } from '../utils/contracts';
const maxMB = Number(import.meta.env.VITE_MAX_UPLOAD_MB) || 100;
const imageAccept = 'image/jpeg,image/png,image/webp,image/gif,image/avif';
const videoAccept = 'video/mp4,video/webm,video/quicktime,video/x-matroska,video/x-msvideo';
export default function ContentForm({ kind, endpoint, back, initial, edit = false }) {
    const isSeason = kind === 'season', isEpisode = kind === 'episode', isSeries = kind === 'series', isMovie = kind === 'movie';
    const [paid, setPaid] = useState(Boolean(initial?.isPaid));
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const releaseDate = initial?.releaseDate ? new Date(initial.releaseDate) : null;
    const dateValue = releaseDate && !Number.isNaN(releaseDate.valueOf()) ? new Date(releaseDate.getTime() - releaseDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
    async function submit(e) {
        e.preventDefault();
        if (busy)
            return;
        setError('');
        const fields = new FormData(e.currentTarget);
        try {
            const data = { title: String(fields.get('title') || '').trim() };
            if (!data.title)
                throw new Error('Title is required');
            if (!isSeason) {
                data.description = String(fields.get('description') || '').trim();
                if ((isMovie || isEpisode) && !data.description)
                    throw new Error('Description is required');
                data.isPaid = paid;
                data.price = paidPrice(paid, fields.get('price'));
            }
            if (isMovie || isSeries)
                data.isPublished = fields.has('isPublished');
            if (isSeries) {
                data.genre = String(fields.get('genre') || '').trim().split(',').map(s => s.trim()).filter(Boolean);
                if (edit && fields.get('thumbnail')?.size && !data.genre.length)
                    throw new Error('To clear all genres, save without replacing the thumbnail first.');
            }
            if (isMovie) {
                const series = String(fields.get('series') || '').trim();
                if (series && !validId(series))
                    throw new Error('Enter a valid 24-character series ID');
                if (series)
                    data.series = series;
            }
            if (isSeason || isEpisode) {
                const field = isSeason ? 'seasonNumber' : 'episodeNumber';
                data[field] = Number(fields.get(field));
                if (!Number.isSafeInteger(data[field]) || data[field] < 1)
                    throw new Error('Enter a positive whole number');
            }
            if (isEpisode && fields.get('releaseDate')) {
                const date = new Date(String(fields.get('releaseDate')));
                if (Number.isNaN(date.valueOf()))
                    throw new Error('Invalid release date');
                data.releaseDate = date.toISOString();
            }
            let payload = data;
            const multipart = !edit || (isSeries && Boolean(fields.get('thumbnail')?.size));
            if (multipart) {
                payload = new FormData();
                for (const [key, value] of Object.entries(data)) {
                    if (Array.isArray(value)) {
                        if (value.length)
                            value.forEach(v => payload.append(key, v));
                        else if (edit)
                            payload.append(key, '');
                    }
                    else
                        payload.append(key, String(value));
                }
                const thumb = fields.get('thumbnail');
                if (!edit || thumb?.size) {
                    validateFile(thumb, 'image', maxMB);
                    payload.append('thumbnail', thumb);
                }
                if (isMovie || isEpisode) {
                    const name = isMovie ? 'videoFile' : 'videoUrl';
                    const video = fields.get(name);
                    validateFile(video, 'video', maxMB);
                    payload.append(name, video);
                }
            }
            setBusy(true);
            setProgress(null);
            const config = { timeout: multipart ? 600000 : 30000, onUploadProgress: multipart ? event => { if (event.total)
                    setProgress(Math.round(event.loaded / event.total * 100)); } : undefined };
            if (edit)
                await api.put(endpoint, payload, config);
            else
                await api.post(endpoint, payload, config);
            toast.success(`${kind[0].toUpperCase() + kind.slice(1)} ${edit ? 'updated' : 'created'}`);
            navigate(back, { replace: true });
        }
        catch (err) {
            setError(message(err));
        }
        finally {
            setBusy(false);
        }
    }
    return <div className="max-w-3xl mx-auto space-y-4"><Link to={back} className="text-indigo-700 underline">← Back to list</Link><form onSubmit={submit} className="panel space-y-5"><h1 className="page-title capitalize">{edit ? 'Edit' : 'Add'} {kind}</h1><fieldset disabled={busy} className="space-y-4"><label>Title<input name="title" defaultValue={initial?.title || ''} required/></label>{!isSeason && <label>Description<textarea name="description" rows={4} defaultValue={initial?.description || ''} required={isMovie || isEpisode}/></label>}{isSeries && <label>Genres (comma separated)<input name="genre" defaultValue={Array.isArray(initial?.genre) ? initial.genre.join(', ') : initial?.genre || ''}/></label>}{isMovie && <label>Series ID (optional)<input name="series" placeholder="24-character MongoDB ID"/><span className="text-xs text-slate-500">Duration is detected by the backend from the uploaded video.</span></label>}{(isSeason || isEpisode) && <label>{isSeason ? 'Season' : 'Episode'} number<input name={isSeason ? 'seasonNumber' : 'episodeNumber'} type="number" min="1" step="1" defaultValue={initial?.[isSeason ? 'seasonNumber' : 'episodeNumber'] || 1} required/></label>}{isEpisode && <label>Release date (local time)<input name="releaseDate" type="datetime-local" defaultValue={dateValue}/><span className="text-xs text-slate-500">Leave empty to use the server default on creation, or retain the current date on edit.</span></label>}{(!edit || isSeries) && <label>Thumbnail {edit ? '(optional replacement)' : ''}<input name="thumbnail" type="file" accept={imageAccept} required={!edit}/></label>}{!edit && (isMovie || isEpisode) && <label>Video file<input name={isMovie ? 'videoFile' : 'videoUrl'} type="file" accept={videoAccept} required/></label>}{!isSeason && <><div className="flex flex-wrap gap-5">{(isMovie || isSeries) && <label><input type="checkbox" name="isPublished" defaultChecked={Boolean(initial?.isPublished)}/> Published</label>}<label><input type="checkbox" checked={paid} onChange={e => setPaid(e.target.checked)}/> Paid content</label></div>{paid && <label>Price (INR)<input name="price" type="number" min="1" step="0.01" defaultValue={initial?.price || ''} required/></label>}</>}{(!edit || isSeries) && <p className="text-sm text-slate-600">Maximum {maxMB} MB per file (must match backend configuration). Large uploads can also be restricted by the hosting provider.</p>}</fieldset>{error && <p role="alert" className="text-red-700">{error}</p>}{busy && <div role="status" className="text-sm">{progress === null ? 'Submitting…' : progress === 100 ? 'Upload sent. Waiting for server processing…' : `Uploading ${progress}%`}{progress !== null && <progress className="block w-full" max="100" value={progress}/>}</div>}<button className="btn" disabled={busy}>{busy ? 'Saving…' : edit ? 'Save changes' : 'Create ' + kind}</button></form></div>;
}
