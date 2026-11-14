// frontend/src/pages/Library.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Search, Filter } from 'lucide-react';

export default function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch from your dedicated library app
    axios.get('http://127.0.0.1:8000/api/library/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setGames(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching library", err);
      setLoading(false);
    });
  }, [navigate]);

  // Extract unique genres from the user's library for the dropdown
  const availableGenres = [...new Set(games.flatMap(game => game.genres.map(g => g.name)))].sort();

  // Apply filters
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase());
    const matchesSource = sourceFilter === 'all' || game.access_source === sourceFilter;
    const matchesGenre = genreFilter === 'all' || game.genres.some(g => g.name === genreFilter);
    return matchesSearch && matchesSource && matchesGenre;
  });

  if (loading) return <p className="text-center text-slate-400 mt-24">Loading your library...</p>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">My Library</h1>
          <p className="text-slate-400 mt-2">{games.length} Games Available</p>
        </div>

        {/* Filters Area */}
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search library..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 w-full focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Access Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="all">All Sources</option>
            <option value="bought">Purchased</option>
            <option value="subscription">Subscription</option>
          </select>

          {/* Genre Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
            >
              <option value="all">All Genres</option>
              {availableGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredGames.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl">
          <p className="text-slate-400 text-lg">No games found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <Link
              to={`/game/${game.id}`}
              key={game.id}
              className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-40 w-full bg-slate-800">
                <img src={game.cover_image_url} alt={game.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Visual indicator of how they own it */}
                <div className="absolute top-3 right-3">
                  {game.access_source === 'bought' ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100 bg-indigo-600/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm border border-indigo-500">
                      Purchased
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-400/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
                      Subscription
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold mb-1 truncate">{game.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{game.developer?.name || 'Unknown'}</p>

                <button className="mt-auto flex items-center justify-center gap-2 w-full bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 text-sm font-bold py-2 rounded-lg transition-colors cursor-pointer">
                  <Play size={16} fill="currentColor" /> Play
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}