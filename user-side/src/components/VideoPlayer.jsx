import { useRef, useState } from 'react';
export default function VideoPlayer({ src, poster, title, onRetry }) {
  const video = useRef(null);
  const [failed, setFailed] = useState(false);
  const skip = seconds => { const el = video.current; if (el && Number.isFinite(el.duration)) el.currentTime = Math.min(el.duration, Math.max(0, el.currentTime + seconds)); };
  if (!src) return null;
  return <div className="space-y-3"><video key={src} ref={video} aria-label={`Video player: ${title}`} src={src} poster={poster || '/placeholder.svg'} controls playsInline preload="metadata" onError={() => setFailed(true)} className="w-full aspect-video rounded-xl bg-black object-contain" />
    <div className="flex flex-wrap gap-2"><button className="btn-secondary" onClick={() => skip(-10)}>−10 sec</button><button className="btn-secondary" onClick={() => skip(10)}>+10 sec</button></div>
    {failed && <div role="alert" className="text-red-300">Video could not load. Check your connection or try refreshing playback. <button className="btn-secondary" onClick={() => { setFailed(false); onRetry?.(); video.current?.load(); }}>Retry playback</button></div>}
  </div>;
}
