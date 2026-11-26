import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Poster from '../components/Poster';
export default function Profile() {
    const { user } = useAuth();
    return <section className="page-shell">
    <h1 className="text-3xl font-bold mb-6">My profile</h1>
    <div className="max-w-2xl rounded-2xl bg-gray-900 border border-white/10 p-6 space-y-5">
    <div className="flex flex-wrap items-center gap-5">
    <Poster src={user.avatar} alt="Profile avatar" className="w-24 h-24 rounded-full object-cover"/>
    <div className="min-w-0 break-words">
    <h2 className="text-2xl font-semibold">{user.fullname}</h2>
    <p className="text-gray-400">@{user.username}</p>
    <p>{user.email}</p>
    </div>
    </div>
    <p>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}</p>
    <Link to="/payments" className="btn inline-block">My purchases</Link>
    </div>
    </section>;
}
