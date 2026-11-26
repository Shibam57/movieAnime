import { createContext, useContext, useCallback, useRef, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { loadCheckout } from '../services/checkout';
import { unwrap, validOrder } from '../utils/contracts';
const PaymentContext = createContext(null);
const PENDING_KEY = 'movieanime.pending-verification.v1';
function readPending() {
  try { const value = JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null'); return value?.userId && value?.payload?.paymentId ? value : null; } catch { return null; }
}
function savePending(value) {
  try { if (value) sessionStorage.setItem(PENDING_KEY, JSON.stringify(value)); else sessionStorage.removeItem(PENDING_KEY); } catch { /* in-memory fallback */ }
}
export function PaymentProvider({ children }) {
  const { user } = useAuth();
  const userId = user?._id;
  const activeUser = useRef(userId); activeUser.current = userId;
  const busy = useRef(false);
  const [processing, setProcessing] = useState(false);
  const [revision, setRevision] = useState(0);
  const [pendingVerification, setPendingVerification] = useState(readPending);
  const checkAccess = useCallback(async (contentId, contentModel) => {
    if (!userId) return false;
    const { data } = await api.get(`/api/v1/payments/access/${encodeURIComponent(contentId)}`, { params: { contentModel } });
    return data?.hasAccess === true;
  }, [userId]);
  const verify = async record => {
    if (record.userId !== activeUser.current) throw new Error('Log in to the original account to verify this payment.');
    const result = unwrap(await api.post('/api/v1/payments/verify', record.payload));
    if (result?.paymentStatus !== 'success') throw new Error('Payment has not been confirmed.');
    savePending(null); setPendingVerification(null); setRevision(v => v + 1);
    return result;
  };
  const startPayment = async ({ contentId, contentModel, title }) => {
    if (!userId) throw new Error('Please log in to purchase content.');
    if (busy.current) throw new Error('A payment is already in progress.');
    if (pendingVerification) throw new Error(pendingVerification.userId === userId ? 'Verify your previous payment before creating another order.' : 'Another account has an unresolved payment in this tab. Log in to that account to verify it.');
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID?.trim();
    if (!key) throw new Error('Payment is not configured.');
    busy.current = true; setProcessing(true);
    try {
      const Razorpay = await loadCheckout();
      if (activeUser.current !== userId) throw new Error('Your account changed.');
      const { order, paymentId } = unwrap(await api.post('/api/v1/payments/create-payments', { contentId, contentModel, currency: 'INR' }));
      if (!validOrder(order, paymentId)) throw new Error('Invalid payment order received.');
      if (activeUser.current !== userId) throw new Error('Your account changed.');
      return await new Promise((resolve, reject) => {
        let submitted = false;
        const razor = new Razorpay({ key, amount: order.amount, currency: order.currency, order_id: order.id, name: 'MovieAnime', description: `Purchase: ${title || 'Content'}`, prefill: { name: user.fullname, email: user.email }, theme: { color: '#ef4444' },
          modal: { ondismiss: () => { if (!submitted) resolve(false); } },
          handler: async response => {
            if (submitted) return;
            submitted = true;
            const record = { userId, payload: { paymentId, razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature } };
            savePending(record); setPendingVerification(record);
            try { await verify(record); resolve(true); }
            catch { reject(new Error('Payment received but verification failed. Do not pay again; retry verification.')); }
          }
        });
        // Razorpay may allow another attempt in the same checkout after a failure.
        razor.open();
      });
    } finally { busy.current = false; setProcessing(false); }
  };
  const retryVerification = async () => {
    if (busy.current || !pendingVerification || pendingVerification.userId !== userId) return false;
    busy.current = true; setProcessing(true);
    try { await verify(pendingVerification); return true; }
    finally { busy.current = false; setProcessing(false); }
  };
  return <PaymentContext.Provider value={{ checkAccess, startPayment, processing, revision, retryVerification, needsVerification: Boolean(pendingVerification && pendingVerification.userId === userId) }}>{children}</PaymentContext.Provider>;
}
export const usePayment = () => useContext(PaymentContext);
