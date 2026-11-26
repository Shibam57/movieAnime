let pending;
export function loadCheckout() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (!pending) pending = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    const fail = () => { clearTimeout(timer); script.remove(); reject(new Error('Unable to load Razorpay. Check your connection and try again.')); };
    const timer = setTimeout(fail, 15000);
    script.onload = () => { clearTimeout(timer); if (window.Razorpay) resolve(window.Razorpay); else fail(); };
    script.onerror = fail;
    document.head.appendChild(script);
  }).catch(error => { pending = null; throw error; });
  return pending;
}
