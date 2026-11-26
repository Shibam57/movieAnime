import { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useApiResource from '../hooks/useApiResource';
import { useEffect } from 'react';
import { searchItems, errorMessage } from '../utils/contracts';
import logo from '../assets/logo.png';
function SearchBox({ close }) {
    const [query, setQuery] = useState('');
    const [debounced, setDebounced] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const id = setTimeout(() => setDebounced(query.trim()), 300);
        return () => clearTimeout(id);
    }, [query]);
    const results = useApiResource(open && debounced.length >= 2 && debounced === query.trim() ? `/api/v1/content/search?q=${encodeURIComponent(debounced)}` : null);
    const submit = e => {
        e.preventDefault();
        if (!query.trim())
            return;
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setOpen(false);
        close?.();
    };
    return <form role="search" onSubmit={submit} className="relative flex flex-1 max-w-lg gap-2" onBlur={e => {
            if (!e.currentTarget.contains(e.relatedTarget))
                setOpen(false);
        }} onKeyDown={e => {
            if (e.key === 'Escape')
                setOpen(false);
        }}>
    <input aria-label="Search movies, series and episodes" className="field !mt-0 min-w-0" type="search" maxLength={100} placeholder="Search movies, series, episodes…" value={query} onFocus={() => setOpen(true)} onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
        }}/>
    <button aria-label="Search" className="btn-secondary" type="submit"><Search size={18}/></button>
        {open && debounced === query.trim() && debounced.length >= 2 && <div className="absolute top-full mt-2 left-0 right-0 bg-gray-900 border border-gray-700 rounded-xl shadow-lg max-h-72 overflow-auto z-50">{results.loading ? <p className="p-3 text-sm">Searching…</p> : results.error ? <p className="p-3 text-sm text-red-300">{results.error}</p> : searchItems(results.data).length ? searchItems(results.data).slice(0, 8).map(item => <Link key={`${item.type}-${item._id}`} to={item.path} onClick={() => {
                    setOpen(false);
                    close?.();
                }} className="block p-3 hover:bg-gray-800"><span className="text-xs text-indigo-300">{item.type}</span> · {item.title}</Link>) : <p className="p-3 text-sm text-gray-400">No matches</p>}</div>}
    </form>;
}
export default function Navbar() {
    const { user, loading, logout } = useAuth();
    const [mobile, setMobile] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const signOut = async () => {
        setBusy(true);
        setError('');
        try {
            await logout();
        }
        catch (err) {
            setError(`Signed out locally. Server logout failed: ${errorMessage(err)}`);
        }
        finally {
            setBusy(false);
            setMobile(false);
            navigate('/', { replace: true });
        }
    };
    const links = [['/', 'Home'], ['/movies', 'Movies'], ['/series', 'Series'], ...(user ? [['/payments', 'Purchases'], ['/profile', 'Profile']] : [])];
    const nav = links.map(([to, label]) => <NavLink end={to === '/'} key={to} to={to} onClick={() => setMobile(false)} className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-indigo-300' : 'text-gray-300 hover:text-white'}`}>{label}</NavLink>);
    const auth = loading ? <span className="text-sm text-gray-400">Checking session…</span> : user ? <button disabled={busy} onClick={signOut} className="flex items-center gap-2 text-sm text-gray-300 hover:text-red-300">
    <LogOut size={18}/>
    {busy ? 'Signing out…' : 'Logout'}
    </button> : <>
    <Link onClick={() => setMobile(false)} to="/login" className="text-sm">Login</Link>
    <Link onClick={() => setMobile(false)} to="/signup" className="btn text-sm">Sign up</Link>
    </>;
    return <header className="sticky top-0 z-50 bg-gray-950/95 border-b border-white/10 backdrop-blur">
    <nav aria-label="Main navigation" className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-3">
    <Link to="/" onClick={() => setMobile(false)}><img src={logo} alt="MovieAnime home" className="h-10 w-auto"/></Link>
    <div className="hidden lg:flex flex-1 justify-center"><SearchBox key={location.key}/></div>
    <div className="hidden lg:flex items-center gap-5">
    {nav}
    {auth}
    </div>
    <button className="ml-auto lg:hidden btn-secondary" aria-label="Toggle navigation" aria-expanded={mobile} onClick={() => setMobile(v => !v)}>{mobile ? <X /> : <Menu />}</button>
    </nav>
        {mobile && <div className="lg:hidden px-4 pb-4 space-y-4">
        <SearchBox key={location.key} close={() => setMobile(false)}/>
        <div className="flex flex-wrap items-center gap-5">
        {nav}
        {auth}
        </div>
        </div>}
    {error && <p role="alert" className="px-4 py-2 text-sm text-red-300">{error}</p>}
    </header>;
}
