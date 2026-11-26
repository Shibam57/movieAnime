import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import { money, errorMessage } from '../utils/contracts';
export default function PurchaseButton({ item, type, onSuccess }) {
    const { user, loading, error: sessionError, retry: retrySession } = useAuth();
    const { startPayment, processing, needsVerification, retryVerification } = usePayment();
    const location = useLocation();
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const buy = async () => {
        setError('');
        setNotice('');
        try {
            const ok = needsVerification ? await retryVerification() : await startPayment({ contentId: item._id, contentModel: type, title: item.title });
            if (ok) {
                setNotice('Payment verified.');
                onSuccess?.();
            }
            else
                setNotice('Checkout closed. No purchase was confirmed.');
        }
        catch (err) {
            setError(errorMessage(err));
        }
    };
    if (loading)
        return <p>Checking session…</p>;
    if (sessionError)
        return <p role="alert">Unable to restore session. <button className="btn-secondary" onClick={retrySession}>Retry session</button></p>;
    if (!user)
        return <Link className="btn inline-block" to="/login" state={{ from: location.pathname + location.search }}>Log in to purchase</Link>;
    return <div className="space-y-3">
    <p className="text-lg font-semibold">{money(item.price)}</p>
    <button className="btn" disabled={processing} onClick={buy}>{processing ? 'Processing…' : needsVerification ? 'Retry previous payment verification' : 'Buy with Razorpay'}</button>
    {error && <p role="alert" className="text-red-300">{error}</p>}
    {notice && <p role="status" className="text-gray-300">{notice}</p>}
    </div>;
}
