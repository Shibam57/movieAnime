import useApiResource from '../hooks/useApiResource';
import CallToAction from "../components/home/CallToAction";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HeroSection from "../components/home/HeroSection";
import TrendingSeries from "../components/home/TrendingSeries";
import TrendingMovies from "../components/home/TrendingMovies";

export default function Home() {
  const trendingMovies = useApiResource('/api/v1/movies/trending');
  return (
    <div className="w-full min-h-screen bg-gray-900">
      {/* Hero Section */}

      <HeroSection movies={trendingMovies.data} />
      <FeaturesSection />
      <TrendingSeries />
      <TrendingMovies resource={trendingMovies} />
      <CategoriesSection />
      <CallToAction />
    </div>
  );
}