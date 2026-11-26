import { useState } from 'react';
import { Bell, Menu, UserCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api, { getSession } from '../services/api';
import useResource from '../hooks/useResource';
import { paths, message, dateLabel } from '../utils/contracts';
import State from './ui/State';
import AdminDropdown from './ui/AdminDropdown';
export default function Navbar({ onMenu, menuOpen }) { const [open, setOpen] = useState(''); const [busy, setBusy] = useState(false); const resource = useResource(paths.notifications); const notifications = Array.isArray(resource.data) ? resource.data : []; const unread = notifications.filter(n => !n.isRead).length; async function read(id) { if (busy)
    return; setBusy(true); try {
    await api.put(`${paths.notifications}/${id}/read`);
    resource.reload();
}
catch (err) {
    toast.error(message(err));
}
finally {
    setBusy(false);
} } return <header className="relative flex items-center justify-between gap-3 bg-gradient-to-r from-slate-950 to-orange-700 text-white p-4"><div className="flex items-center gap-3"><button className="md:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={onMenu}><Menu /></button><span className="font-bold text-lg">MovieAnime <span className="text-orange-200">Admin</span></span></div><div className="flex items-center gap-4"><button aria-label="Notifications" aria-expanded={open === 'notifications'} onClick={() => setOpen(v => v === 'notifications' ? '' : 'notifications')} className="relative"><Bell />{unread > 0 && <span className="absolute -top-2 -right-2 bg-red-700 rounded-full text-xs px-1">{unread}</span>}</button><button aria-label="Account menu" aria-expanded={open === 'account'} onClick={() => setOpen(v => v === 'account' ? '' : 'account')}><UserCircle /></button></div>{open && <div className="absolute z-30 top-full right-2 w-[min(22rem,95vw)] panel text-slate-900 max-h-[70vh] overflow-auto"><div className="flex justify-between mb-3"><strong>{open === 'account' ? getSession()?.admin?.name || 'Admin' : 'Notifications'}</strong><button aria-label="Close menu" onClick={() => setOpen('')}>✕</button></div>{open === 'account' ? <AdminDropdown /> : <State resource={resource}>{notifications.length ? notifications.map(n => <div key={n._id} className="border-b py-3"><p>{n.message}</p><small>{dateLabel(n.createdAt)}</small>{!n.isRead && <button className="block text-indigo-700" disabled={busy} onClick={() => read(n._id)}>Mark as read</button>}</div>) : <p>No notifications.</p>}<button className="btn-secondary mt-3" onClick={resource.reload}>Refresh</button></State>}</div>}</header>; }
