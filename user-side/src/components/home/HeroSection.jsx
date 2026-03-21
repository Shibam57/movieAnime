import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const images = [
  "https://www.yardbarker.com/media/5/9/59b05ec5d563587cb0840a52de180fb5dd058c2a/thumb_16x9/best-movie-series-franchises-binge-right.jpg", 
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6MRJZTmtENhq49Z_9M0KtnzhrFhNPtcthFg&s",
  "https://www.hollywoodreporter.com/wp-content/uploads/2025/05/solo-leveling-jpeg.jpg?w=1296&h=729&crop=1",
  "https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/04/10-best-death-game-movies-tv-shows-ranked.jpg",
  "https://images.entertainment.ie/media/w780_wxnqgl8OmJM3nX16ytVWDfPn8If.jpg?w=1280&h=768&q=low",
  "https://i.ytimg.com/vi/983OxN0PMQo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBFRGySVS3e9SqxIvJ6VfeDobdvog",
  "https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/12/image-collage-of-jujutsu-kaisen-oshi-no-ko-and-demon-slayer.jpg",
  "https://static1.colliderimages.com/wordpress/wp-content/uploads/2021/08/FOUNDATION-APPLE-TV.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6fWQZOwK1-9TP7PjRqIo9EqPoZhrrhL-Law&s",
  "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/08/hinh-nen-anime-cute-1.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtG4jyA68b2-RrbTjDXEORyjrlmM6feMFH7MlbsRExbNn_kXuY-Qmry36g9SxyMzSaM0A&usqp=CAU",
  "https://c4.wallpaperflare.com/wallpaper/31/267/646/rampage-dwayne-johnson-2018-movies-movies-wallpaper-preview.jpg",
  "https://images.squarespace-cdn.com/content/v1/61cccdf24b15db3d8a4a4d3c/1682193385052-Z0I1EIWXAB7ESNOBSNV9/Screen+Shot+2023-04-22+at+3.50.40+PM.png",
  "https://thenewsmen.co.in/public/upload/news/story_mul_image_1625500974_5.jpg",
  "https://static0.cbrimages.com/wordpress/wp-content/uploads/2025/01/demon-slayer-infinity-castle-trilogy-movie-performance.jpg?q=70&fit=contain&w=1200&h=628&dpr=1",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOBCn6vc0BYCQ5gziSLJT6Hv03vNzE93DTRUEUpNGyAR_87gNM8wyosyOLMjoqzuSPsJU&usqp=CAU",
  "https://www.nyfa.edu/wp-content/uploads/2022/11/action-movie.jpg",
  "https://sm.ign.com/ign_in/blogroll/b/best-actio/best-action-movies-on-netflix-right-now-june-2022_grun.jpg",
  "https://legendary-digital-network-assets.s3.amazonaws.com/wp-content/uploads/2020/03/13051345/The-Untamed-Interior.png",
  "https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/4bfff1f9-ac1e-4156-a6e2-f22ee1de456c/Screenshot+2025-05-28+at+12.28.46%E2%80%AFPM.jpg",
  "https://gamespace.com/wp-content/uploads/2022/04/Isekai-Revelry-Arrived-in-That-Time-I-Got-Reincarnated-as-a-Slime-ISEKAI-Memories.jpg",
];

const words = [
  { text: "Movies", color: "text-red-500" },
  { text: "Series", color: "text-indigo-400" },
  { text: "Anime", color: "text-yellow-400" },
];

function ScrollingColumn({ direction = "down" }) {
  return (
    <div className="relative flex flex-col overflow-hidden h-[95vh] w-1/3">
      <motion.div
        animate={{
          y: direction === "down" ? ["0%", "-100%"] : ["-100%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 150, // adjust for speed (lower = faster)
          ease: "linear",
        }}
        className="flex flex-col animate-infinite-scroll"
      >
        {/* Duplicate images to create seamless loop */}
        {[...images, ...images].map((src, i) => (
          <img
            key={i}
            src={src}
            alt="poster"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x600?text=Image+Not+Found";
            }}
            className="rounded-xl shadow-lg w-full object-cover mb-4"
          />
        ))}
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
    const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[95vh] flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Background Image Columns */}
      <div className="absolute inset-0 flex">
        <ScrollingColumn direction="down" />
        <ScrollingColumn direction="up" />
        <ScrollingColumn direction="down" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80" />

      {/* Centered Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-4xl text-center px-4"
      >
        <div className="relative z-10 max-w-4xl text-center px-4">
      {/* Animated Heading */}
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 brightness-150">
      Unlimited{" "}
      <span className="inline-block relative w-[7ch]">
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index].text}
            className={`${words[index].color} absolute left-0`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: -55 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            {words[index].text}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>

      {/* More Interesting Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-gray-200 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        Dive into a world of{" "}
        <span className="font-semibold text-white">blockbuster movies</span>  
        and{" "}
        <span className="font-semibold text-white">addictive series</span>
        and{" "}
        <span className="font-semibold text-white">anime</span>.
        Watch anywhere, anytime, without limits.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex justify-center gap-4 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <Link
          to="/movies"
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-2xl shadow-lg text-lg font-medium transition"
        >
          Browse Movies
        </Link>
        <Link
          to="/series"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg text-lg font-medium transition"
        >
          Explore Series
        </Link>
      </motion.div>
    </div>
      </motion.div>
    </section>
  );
}