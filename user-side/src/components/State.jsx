export default function State({ loading, error, retry, children }) {
  if (loading) return <p role="status" className="p-10 text-center text-gray-300 animate-pulse">Loading…</p>;
  if (error) return <div role="alert" className="mx-auto my-8 max-w-xl rounded-xl border border-red-500/40 bg-red-950/30 p-5 text-center"><p className="text-red-200">{error}</p>{retry && <button className="btn mt-4" onClick={retry}>Try again</button>}</div>;
  return children;
}
