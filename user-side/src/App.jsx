import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import GenreSeriesPage from "./pages/GenreSeriesPage";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
// import MovieDetails from "./pages/MovieDetails";
import SeriesList from "./pages/SeriesList";
import SeriesDetails from "./pages/SeriesDetails";
import Payments from "./pages/Payments";
import PaymentsPage from "./pages/PaymentsPage";
import SignUp from "./pages/SignUp";
import SeasonPage from "./pages/SeasonPage";
import EpisodePage from "./pages/EpisodePage";
import Footer from "./components/Footer";
import SearchResultsPage from "./pages/SearchResultsPage";
import WatchEpisode from "./pages/WatchEpisode";
import WatchMovie from "./pages/WatchMovie";
import Profile from "./pages/Profile";


export default function App() {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <div className="pt-15">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Login page with Home in background */}
          <Route
            path="/login"
            element={
              <div className="relative min-h-screen">
                <div className="fixed inset-0 z-0 overflow-hidden">
                  <Home />
                </div>
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <div className="relative z-20 flex items-center justify-center min-h-screen">
                  <Login />
                </div>
              </div>
            }
          />

          <Route
            path="/signup"
            element={
              <div className="relative min-h-screen">
                <div className="fixed inset-0 z-0 overflow-hidden">
                  <Home />
                </div>
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <div className="relative z-20 flex items-center justify-center min-h-screen">
                  <SignUp />
                </div>
              </div>
            }
          />

          <Route path="/genre/:genreId" element={<GenreSeriesPage />} />
          <Route path="/movies" element={<Movies />} />
          {/* <Route path="/movies/:movieId" element={<MovieDetails />} /> */}
          <Route path="/series" element={<SeriesList />} />
          <Route path="/series/:seriesId" element={<SeriesDetails />} />
          <Route path="/payments/:seriesId" element={<Payments />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/series/:seriesId/season/:seasonId" element={<SeasonPage />} />
          <Route path="/series/:seriesId/season/:seasonId/episodes" element={<EpisodePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/series/:seriesId/season/:seasonId/episode/:episodeId" element={<WatchEpisode />} />
          <Route path="/movies/:movieId" element={<WatchMovie />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        </div>

        <Footer />
      </div>
    
  );
}