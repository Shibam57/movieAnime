import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import useApiResource from '../hooks/useApiResource';
import State from '../components/State';
import { array, contentPath, money } from '../utils/contracts';
export default function PaymentsPage() {
    const { user } = useAuth();
    const { revision } = usePayment();
    const resource = useApiResource(user ? '/api/v1/payments/user-payments' : null, `${user?._id}:${revision}`);
    const list = array(resource.data);
    return <section className="page-shell">
    <h1 className="text-3xl font-bold mb-6">My purchases</h1>
    <State loading={resource.loading} error={resource.error} retry={resource.reload}>{list.length ? <ul className="space-y-4">{list.map(p => {
                const id = p.contentId?._id || (typeof p.contentId === 'string' ? p.contentId : null);
                const path = contentPath(p.contentModel, id);
                return <li key={p._id} className="p-5 rounded-xl bg-gray-900 border border-white/10 flex flex-wrap justify-between gap-4">
                <div>
                <h2 className="text-lg font-semibold">{p.contentId?.title || 'Content unavailable'}</h2>
                <p className="text-gray-400">{p.contentModel} · {money(p.amount)} · {p.method || 'Razorpay'}</p>
                <p className="text-green-300">{p.paymentStatus}</p>
                {p.createdAt && <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</p>}
                </div>
                {path && <Link className="btn-secondary self-center" to={path}>Open content →</Link>}
                </li>;
            })}</ul> : <p>No verified purchases yet. <Link className="text-indigo-300" to="/movies">Browse movies</Link></p>}</State>
    </section>;
}
