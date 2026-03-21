import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AddMovie from "./pages/AddMovie";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Users from "./pages/Users";
import Movies from "./pages/Movies";
import AddSeries from "./pages/series/AddSeries";
import SeriesList from "./pages/series/SeriesList";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SeasonList from "./pages/season/SeasonList";
import EpisodeList from "./pages/episode/EpisodeList";
import AddSeason from "./pages/season/AddSeason";
import AddEpisode from "./pages/episode/AddEpisode";





function App() {
  return (
    <>
    <Router>
      <Routes>
        {/* Public pages: Login & Signup */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Wrap all protected/admin pages inside Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/movies/all" element={<Movies />} />
          <Route path="movies/add" element={<AddMovie />} />
          <Route path="series/add" element={<AddSeries />} />
          <Route path="series/all" element={<SeriesList />} />
          <Route path="/series/:seriesId/seasons" element={<SeasonList />} />
          <Route path="/series/:seriesId/seasons/add" element={<AddSeason />} />
          <Route
          path="/series/:seriesId/seasons/:seasonId/episodes"
          element={<EpisodeList />} />
          <Route
          path="/series/:seriesId/seasons/:seasonId/episodes/add"
          element={<AddEpisode />} />
          <Route path="/payments" element={<Payments/>} />
          <Route path="/analytics" element={<Analytics/>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
    
    {/* Toast Container must be included once in your app */}
      <ToastContainer
        position="top-right"
        autoClose={2000}     // 2 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"       // or "dark"
      />
    </>
  );
}

export default App;