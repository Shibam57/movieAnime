import { motion } from "framer-motion";
import { Film, Tv, MonitorPlay, Smartphone } from "lucide-react";
import video from "../../assets/video.mp4";

const features = [
  {
    icon: <Film className="w-10 h-10 text-red-500" />,
    title: "Blockbuster Movies",
    description: "Discover free and paid movies in the catalog.",
  },
  {
    icon: <Tv className="w-10 h-10 text-indigo-500" />,
    title: "Addictive Series",
    description: "Discover series across different genres.",
  },
  {
    icon: <MonitorPlay className="w-10 h-10 text-green-500" />,
    title: "Anime Universe",
    description: "Dive into top anime series and movies, all in one place.",
  },
  {
    icon: <Smartphone className="w-10 h-10 text-yellow-500" />,
    title: "Watch Anywhere",
    description: "Stream seamlessly on mobile, tablet, or desktop anytime.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative w-full py-20 text-white overflow-hidden mt-1">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover blur-md scale-105"
        src={video}
        preload="none"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-extrabold mb-12 brightness-150"
        >
          Why Choose <span className="text-red-500">Our Platform</span>?
        </motion.h2>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-red-500/20 transition"
            >
              <div className="flex justify-center mb-4 brightness-150">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}