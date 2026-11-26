import ContentForm from '../../components/ContentForm';
export default function AddSeries() { return <ContentForm kind="series" endpoint="/api/v1/series" back="/series/all"/>; }
