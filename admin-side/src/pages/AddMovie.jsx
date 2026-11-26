import ContentForm from '../components/ContentForm';
import { paths } from '../utils/contracts';
export default function AddMovie() { return <ContentForm kind="movie" endpoint={paths.movies} back="/movies/all"/>; }
