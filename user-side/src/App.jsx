import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import { usePayment } from './context/PaymentContext';
import { useAuth } from './context/AuthContext';
import { errorMessage } from './utils/contracts';
import Home from './pages/Home';
import GenreSeriesPage from './pages/GenreSeriesPage';
import Login from './pages/Login';
import Movies from './pages/Movies';
import SeriesList from './pages/SeriesList';
import SeriesDetails from './pages/SeriesDetails';
import Payments from './pages/Payments';
import PaymentsPage from './pages/PaymentsPage';
import SignUp from './pages/SignUp';
import SeasonPage from './pages/SeasonPage';
import EpisodePage from './pages/EpisodePage';
import SearchResultsPage from './pages/SearchResultsPage';
import WatchEpisode from './pages/WatchEpisode';
import WatchMovie from './pages/WatchMovie';
import Profile from './pages/Profile';
function PendingPayment() {
    const { needsVerification, retryVerification, processing } = usePayment();
    const [error, setError] = useState('');
    if (!needsVerification)
        return null;
    return <div className="bg-amber-950 border-b border-amber-500/40 p-4 text-amber-100" role="status"><div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
    <p className="flex-1">A payment needs verification. Do not pay again.</p>
    <button disabled={processing} className="btn-secondary" onClick={async () => {
            setError('');
            try {
                await retryVerification();
            }
            catch (e) {
                setError(errorMessage(e));
            }
        }}>{processing ? 'Verifying…' : 'Retry verification'}</button>
    {error && <p role="alert" className="w-full">{error}</p>}
    </div></div>;
}
export default function App() {
    const location = useLocation();
    const { error: sessionError, retry: retrySession } = useAuth();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname, location.search]);
    return <div className="min-h-screen flex flex-col bg-black text-white">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-indigo-600 focus:p-3">Skip to content</a>
    <Navbar />
    {sessionError && <div role="alert" className="p-4 bg-red-950 text-red-100 text-center">Could not restore your session: {sessionError} <button className="btn-secondary" onClick={retrySession}>Retry session</button></div>}
    <PendingPayment />
    <main id="main" className="flex-1"><Routes>
    <Route path="/" element={<Home />}/>
    <Route path="/login" element={<Login />}/>
    <Route path="/signup" element={<SignUp />}/>
    <Route path="/genre/:genreId" element={<GenreSeriesPage />}/>
    <Route path="/movies" element={<Movies />}/>
    <Route path="/movies/:movieId" element={<WatchMovie />}/>
    <Route path="/series" element={<SeriesList />}/>
    <Route path="/series/:seriesId" element={<SeriesDetails />}/>
    <Route path="/payments/:seriesId" element={<Payments />}/>
    <Route path="/payments" element={<RequireAuth><PaymentsPage /></RequireAuth>}/>
    <Route path="/series/:seriesId/season/:seasonId" element={<SeasonPage />}/>
    <Route path="/series/:seriesId/season/:seasonId/episodes" element={<EpisodePage />}/>
    <Route path="/search" element={<SearchResultsPage />}/>
    <Route path="/series/:seriesId/season/:seasonId/episode/:episodeId" element={<WatchEpisode />}/>
    <Route path="/episodes/:episodeId" element={<WatchEpisode />}/>
    <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>}/>
    <Route path="*" element={<section className="page-shell text-center">
        <h1 className="text-4xl font-bold">Page not found</h1>
        <Link className="btn inline-block mt-6" to="/">Go home</Link>
        </section>}/>
    </Routes></main>
    <Footer />
    </div>;
}
