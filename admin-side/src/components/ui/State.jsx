export default function State({ resource, children }) { if (resource.loading)
    return <p role="status" className="panel">Loading…</p>; if (resource.error)
    return <div className="panel" role="alert"><p className="text-red-700">{resource.error}</p><button className="btn mt-3" onClick={resource.reload}>Retry</button></div>; return children; }
