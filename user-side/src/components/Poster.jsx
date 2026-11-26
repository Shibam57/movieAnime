export default function Poster({ src, alt = '', className = '', ...props }) {
  return <img {...props} src={src || '/placeholder.svg'} alt={alt} loading="lazy" decoding="async" className={className} onError={e => { if (!e.currentTarget.src.endsWith('/placeholder.svg')) e.currentTarget.src = '/placeholder.svg'; }} />;
}
