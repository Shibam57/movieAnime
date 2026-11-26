import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import State from './State';
export default function RequireAuth({children}) {
 const {user,loading,error,retry}=useAuth();const location=useLocation();
 if(loading||error)return <State loading={loading} error={error} retry={retry}/>;
 return user?children:<Navigate to="/login" replace state={{from:location.pathname+location.search}}/>;
}
