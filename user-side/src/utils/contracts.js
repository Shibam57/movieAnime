export const array = value => Array.isArray(value) ? value : [];
export function unwrap(response) {
  const body = response?.data;
  if (!body || typeof body !== 'object' || !Object.hasOwn(body, 'data')) throw new Error('Unexpected API response. Check the backend URL.');
  return body.data;
}
export function contentPath(type, id) {
  const root = { Movie: '/movies/', Series: '/series/', Episode: '/episodes/' }[type];
  return root && id ? root + encodeURIComponent(id) : null;
}
export function searchItems(data) {
  return [['Movie', data?.movies], ['Series', data?.series], ['Episode', data?.episodes]].flatMap(([type, items]) => array(items).filter(item => item?._id).map(item => ({ ...item, type, path: contentPath(type, item._id) })));
}
export const genreNames = item => array(item?.genre ?? item?.genres).map(g => typeof g === 'string' ? g : g?.name).filter(Boolean);
export const money = amount => Number.isFinite(Number(amount)) && amount != null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount)) : 'Price unavailable';
export function safeReturnPath(path) { return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') && !path.includes('\\') && !/^\/(login|signup)(?:[/?#]|$)/.test(path) ? path : '/'; }
export function errorMessage(error) {
  return error?.response?.data?.message || (error?.code === 'ECONNABORTED' ? 'The server is taking too long. Try again.' : error?.message || 'Something went wrong. Try again.');
}
export function validOrder(order, paymentId) { return typeof order?.id === 'string' && Number.isSafeInteger(order.amount) && order.amount > 0 && order.currency === 'INR' && typeof paymentId === 'string' && Boolean(paymentId); }
