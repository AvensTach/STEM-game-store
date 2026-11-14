// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play, TrendingUp, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [games, setGames] = useState([]);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Fetch both Featured Games and standard games in parallel
    Promise.all([
      axios.get('http://127.0.0.1:8000/api/games/?is_featured=true'),
      axios.get('http://127.0.0.1:8000/api/games/')
    ])
      .then(([featuredRes, normalRes]) => {
        const fetchedFeatured = featuredRes.data.results ? featuredRes.data.results : featuredRes.data;
        const fetchedNormal = normalRes.data.results ? normalRes.data.results : normalRes.data;

        setFeaturedGames(fetchedFeatured);
        setGames(fetchedNormal);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Curation: Use actual featured games, or fallback if none exist in the DB
  const displayFeatured = featuredGames.length > 0 ? featuredGames.slice(0, 3) : games.slice(0, 3);
  const trendingGames = games.slice(3, 7);
  const newReleases = [...games].sort((a,b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, 4);

  // Auto-play carousel logic (Resets timer when currentSlide changes manually)
  useEffect(() => {
    if (displayFeatured.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === displayFeatured.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [displayFeatured.length, currentSlide]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? displayFeatured.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === displayFeatured.length - 1 ? 0 : prev + 1));
  };

  if (loading) return <div className="text-center text-slate-400 py-20">Loading Storefront...</div>;
  if (!games || games.length === 0) return null;

  const GameCard = ({ game }) => (
    <Link to={`/game/${game.id}`} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500 transition-all block flex flex-col h-full">
      <div className="relative h-48 w-full bg-slate-800 flex-shrink-0">
        <img src={game.cover_image_url} alt={game.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold truncate mb-1">{game.title}</h3>
        <p className="text-indigo-400 font-extrabold mt-auto">${game.price}</p>
      </div>
    </Link>
  );

  return (
    <div className="max-w-[1600px] w-full mx-auto py-8 space-y-16">

      {/* Featured Carousel */}
      <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 group">
        {displayFeatured.map((game, index) => (
          <div
            key={game.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
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

        {/* Navigation Arrows (Visible on Hover) */}
        {displayFeatured.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        {/* Carousel Indicators */}
        {displayFeatured.length > 1 && (
          <div className="absolute bottom-6 right-12 z-30 flex gap-2">
            {displayFeatured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recommended / Trending */}
      <div>
        <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2"><TrendingUp className="text-indigo-400"/> Recommended for You</h2>
          <Link to="/catalog" className="text-sm font-medium text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors">
            Browse All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingGames.map(game => <GameCard key={game.id} game={game} />)}
        </div>
      </div>

      {/* New Releases */}
      <div>
        <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Clock className="text-emerald-400"/> New Releases</h2>
          <Link to="/catalog?ordering=-release_date" className="text-sm font-medium text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors">
            View Latest <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newReleases.map(game => <GameCard key={game.id} game={game} />)}
        </div>
      </div>

    </div>
  );
}