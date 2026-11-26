import {Navigate,useParams} from 'react-router-dom';
export default function Payments(){const {seriesId}=useParams();return <Navigate to={`/series/${seriesId}`} replace/>;}
