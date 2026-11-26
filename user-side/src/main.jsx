import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';
class ErrorBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<div role="alert" className="page-shell"><h1 className="text-2xl font-bold">Something went wrong</h1><p className="my-4">Reload the page to try again.</p><button className="btn" onClick={()=>window.location.reload()}>Reload</button></div>:this.props.children;}
}
createRoot(document.getElementById('root')).render(<StrictMode><ErrorBoundary><BrowserRouter><MotionConfig reducedMotion="user"><AuthProvider><PaymentProvider><App/></PaymentProvider></AuthProvider></MotionConfig></BrowserRouter></ErrorBoundary></StrictMode>);
