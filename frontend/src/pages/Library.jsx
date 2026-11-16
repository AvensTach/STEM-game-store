// frontend/src/pages/Library.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play, Grid, Download, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

// Framer Motion Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Library() {
  const [libraryGames, setLibraryGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    axios.get('http://127.0.0.1:8000/api/library/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const games = res.data.results ? res.data.results : res.data;
        setLibraryGames(games);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching library:", err);
        setLoading(false);
      });
  }, []);

  // Updated Client-side filtering logic with Smart Fallbacks
  const filteredGames = libraryGames.filter(item => {
    const game = item.game || item;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesType = true;
    if (filterType === 'purchased') {
      // Smart fallback: assume purchased if it has NO subscription tier attached
      matchesType = item.access_type === 'purchase' || !game.minimum_subscription_tier;
    } else if (filterType === 'subscription') {
      // Smart fallback: assume subscription if it requires a tier
      matchesType = item.access_type === 'subscription' || !!game.minimum_subscription_tier;
    }

    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-[1600px] w-full mx-auto py-8 space-y-8">

      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-6 mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">My Library</h1>
          <p className="text-slate-400">Games you own or have access to via subscription.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:border-indigo-500 outline-none text-white shadow-inner transition-colors"
            />
          </div>

          <div className="relative w-full md:w-auto flex-1 md:flex-none">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none">
              <Filter size={16} />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-8 py-2.5 text-sm focus:border-indigo-500 outline-none text-white shadow-inner transition-colors cursor-pointer appearance-none"
            >
              <option value="all">All Games</option>
              <option value="purchased">Purchased</option>
              <option value="subscription">Subscription</option>
            </select>
          </div>

          <div className="text-slate-500 flex items-center justify-center gap-2 font-medium whitespace-nowrap bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-800 w-full md:w-auto">
            <Grid size={18} className="text-indigo-400" />
            {filteredGames.length} {filteredGames.length === 1 ? 'Game' : 'Games'}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading your games...</div>
      ) : libraryGames.length === 0 ? (
        <div className="text-center py-32 bg-slate-900/50 rounded-3xl border border-slate-800">
          <h2 className="text-2xl font-bold text-slate-300 mb-4">Your library is empty</h2>
          <p className="text-slate-500 mb-8">It's time to find your next favorite game!</p>
          <Link to="/catalog" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-colors">
            Browse Catalog
          </Link>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-32 bg-slate-900/50 rounded-3xl border border-slate-800">
          <h2 className="text-2xl font-bold text-slate-300 mb-2">No matches found</h2>
          <p className="text-slate-500">Try adjusting your search term or filter.</p>
        </div>
      ) : (

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredGames.map(item => {
            const game = item.game || item;

            return (
              <motion.div key={game.id} variants={cardVariant} className="h-full">
                <Tilt
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  glareEnable={true}
                  glareMaxOpacity={0.15}
                  scale={1.02}
                  transitionSpeed={400}
                  className="h-full"
                >
                  <div className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500 transition-colors flex flex-col h-full shadow-lg relative cursor-pointer">

                    <Link to={`/game/${game.id}`} className="relative h-48 w-full bg-slate-800 flex-shrink-0 block overflow-hidden">
                      <img
                        src={game.cover_image_url}
                        alt={game.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />

                      {/* Updated Access Badge with Smart Fallback */}
                      <div className="absolute top-2 right-2">
                        {item.access_type === 'subscription' || !!game.minimum_subscription_tier ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 bg-indigo-400 px-2 py-1 rounded shadow-sm">
                            Subscription
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-400 px-2 py-1 rounded shadow-sm">
                            Owned
                          </span>
                        )}
                      </div>

                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-10">
                        <button className="bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-900/50 transform scale-75 group-hover:scale-100 transition-all duration-300">
                          <Play fill="currentColor" size={24} />
                        </button>
                      </div>
                    </Link>

                    <div className="p-5 flex flex-col flex-grow bg-slate-900">
                      <h3 className="font-bold text-lg truncate mb-1 text-white">{game.title}</h3>
                      <p className="text-sm text-slate-500 mb-5">{game.developer?.name || 'Unknown Developer'}</p>

                      <button className="mt-auto w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-lg transition-colors border border-slate-700 hover:border-slate-600">
                        <Download size={16} /> Install
                      </button>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}