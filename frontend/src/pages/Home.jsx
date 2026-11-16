// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play, TrendingUp, Clock, ArrowRight, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import GameCard from '../components/GameCard';
import GameCardSkeleton from '../components/GameCardSkeleton';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const [games, setGames] = useState([]);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setRecentGames(JSON.parse(localStorage.getItem('pixelvault_recent') || '[]'));

    Promise.all([
      axios.get('http://127.0.0.1:8000/api/games/?is_featured=true'),
      axios.get('http://127.0.0.1:8000/api/games/')
    ])
      .then(([featuredRes, normalRes]) => {
        setFeaturedGames(featuredRes.data.results || featuredRes.data);
        setGames(normalRes.data.results || normalRes.data);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const displayFeatured = featuredGames.length > 0 ? featuredGames : games.slice(0, 3);
  const trendingGames = games.slice(3, 7);
  const newReleases = [...games].sort((a,b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, 4);

  useEffect(() => {
    if (displayFeatured.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === displayFeatured.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [displayFeatured.length, currentSlide]);

  return (
    <div className="max-w-[1600px] w-full mx-auto py-8 space-y-16">

      {loading ? (
        <div className="w-full h-[500px] rounded-3xl bg-slate-900 animate-pulse border border-slate-800"></div>
      ) : (
        <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 group">
          {displayFeatured.map((game, index) => (
            <div key={game.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
              <img src={game.cover_image_url} alt={game.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

              <div className="absolute top-8 left-8 z-20">
                <span className="bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg border border-indigo-500/50 inline-block">
                  Featured Now
                </span>
              </div>

              <div className="absolute bottom-0 left-0 p-12 w-full md:w-2/3 z-20">
                <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">{game.title}</h1>
                <p className="text-slate-300 mb-8 line-clamp-2 drop-shadow-md">{game.description}</p>
                <div className="flex items-center gap-4">
                  <Link to={`/game/${game.id}`} className="bg-white text-black font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-slate-200 transition-colors">
                    <Play fill="currentColor" size={20} /> View Game
                  </Link>
                  <span className="text-3xl font-extrabold text-white drop-shadow-md">${game.price}</span>
                </div>
              </div>
            </div>
          ))}

          {displayFeatured.length > 1 && (
            <>
              <button onClick={() => setCurrentSlide((prev) => (prev === 0 ? displayFeatured.length - 1 : prev - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10">
                <ChevronLeft size={32} />
              </button>
              <button onClick={() => setCurrentSlide((prev) => (prev === displayFeatured.length - 1 ? 0 : prev + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10">
                <ChevronRight size={32} />
              </button>

              {/* Smooth Dynamic Sliding Dots Indicator */}
              <div className="absolute bottom-6 right-12 z-30 flex items-center justify-center h-4">
                {displayFeatured.map((_, idx) => {
                  const totalItems = displayFeatured.length;

                  if (totalItems <= 3) {
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`rounded-full transition-all duration-300 ease-out cursor-pointer ${
                          currentSlide === idx ? 'w-3 h-3 mx-1.5 bg-white scale-125' : 'w-3 h-3 mx-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    );
                  }

                  // 1. Calculate the sliding window of exactly 3 main dots
                  let mainStart = currentSlide - 1;
                  if (mainStart < 0) mainStart = 0;
                  if (mainStart + 2 >= totalItems) mainStart = totalItems - 3;
                  const mainEnd = mainStart + 2;

                  // 2. Assign dynamic classes for smooth CSS transitions
                  let dotClass = "w-0 h-0 mx-0 opacity-0 overflow-hidden"; // Fully collapsed and invisible

                  if (idx >= mainStart && idx <= mainEnd) {
                    // Render 3 Main Dots
                    dotClass = currentSlide === idx
                      ? "w-3 h-3 mx-1.5 opacity-100 bg-white scale-125"
                      : "w-3 h-3 mx-1.5 opacity-100 bg-white/40 hover:bg-white/70";
                  } else if (idx === mainStart - 1 || idx === mainEnd + 1) {
                    // Render 1 Small Dot on the edges
                    dotClass = "w-1.5 h-1.5 mx-1.5 opacity-100 bg-white/30 hover:bg-white/60";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      // The transition-all animates width, height, and margins simultaneously!
                      className={`rounded-full transition-all duration-300 ease-out cursor-pointer ${dotClass}`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {!loading && recentGames.length > 0 && (
        <div>
          <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-2">
            <h2 className="text-2xl font-bold flex items-center gap-2"><History className="text-amber-400"/> Jump Back In</h2>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentGames.map(game => <GameCard key={`recent-${game.id}`} game={game} />)}
          </motion.div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2"><TrendingUp className="text-indigo-400"/> Recommended for You</h2>
          <Link to="/catalog" className="text-sm font-medium text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors">
            Browse All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <GameCardSkeleton key={n} />)}
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingGames.map(game => <GameCard key={game.id} game={game} />)}
          </motion.div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Clock className="text-emerald-400"/> New Releases</h2>
          <Link to="/catalog?ordering=-release_date" className="text-sm font-medium text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors">
            View Latest <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <GameCardSkeleton key={n} />)}
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newReleases.map(game => <GameCard key={game.id} game={game} />)}
          </motion.div>
        )}
      </div>

    </div>
  );
}