import CallToAction from "../components/home/CallToAction";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HeroSection from "../components/home/HeroSection";
import TrendingSeries from "../components/home/TrendingSeries";
import TrendingMovies from "../components/home/TrendingMovies";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-900">
      {/* Hero Section */}

      <HeroSection />
      <FeaturesSection />
      <TrendingSeries />
      <TrendingMovies />
      <CategoriesSection />
      <CallToAction />
    </div>
  );
}