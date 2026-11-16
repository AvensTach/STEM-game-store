// frontend/src/pages/Catalog.jsx
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

import GameCard from '../components/GameCard';
import GameCardSkeleton from '../components/GameCardSkeleton';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);

  const [games, setGames] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [platformsList, setPlatformsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState(searchParams.get('genres') ? searchParams.get('genres').split(',') : []);
  const [selectedPlatforms, setSelectedPlatforms] = useState(searchParams.get('platforms') ? searchParams.get('platforms').split(',') : []);
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('ordering') || '');
  const [tierLevel, setTierLevel] = useState(searchParams.get('tier_level') || '');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/genres/').then(res => setGenresList(res.data));
    axios.get('http://127.0.0.1:8000/api/platforms/').then(res => setPlatformsList(res.data));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchGames = (pageToFetch, append = false) => {
    if (!append) setLoading(true);

    const params = new URLSearchParams();
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (selectedGenres.length > 0) params.append('genres', selectedGenres.join(','));
    if (selectedPlatforms.length > 0) params.append('platforms', selectedPlatforms.join(','));
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);
    if (tierLevel) params.append('tier_level', tierLevel);
    if (sortBy) params.append('ordering', sortBy);
    params.append('page', pageToFetch);

    setSearchParams(params);

    axios.get(`http://127.0.0.1:8000/api/games/?${params.toString()}`)
      .then(res => {
        if (append) {
          setGames(prev => [...prev, ...res.data.results]);
        } else {
          setGames(res.data.results);
        }
        setTotalResults(res.data.count);
        setTotalPages(Math.ceil(res.data.count / 12));
        setCurrentPage(pageToFetch);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      fetchGames(currentPage, false);
      isFirstRender.current = false;
    } else {
      fetchGames(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedGenres, selectedPlatforms, minPrice, maxPrice, tierLevel, sortBy]);

  const toggleArrayItem = (array, setArray, item) => {
    if (array.includes(item)) setArray(array.filter(i => i !== item));
    else setArray([...array, item]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedGenres([]);
    setSelectedPlatforms([]);
    setMinPrice('');
    setMaxPrice('');
    setTierLevel('');
    setSortBy('');
  };

  const handleLoadMore = () => fetchGames(currentPage + 1, true);
  const handlePageChange = (page) => fetchGames(page, false);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <div className="max-w-[1600px] w-full mx-auto py-8 flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-64 flex-shrink-0 space-y-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit sticky top-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2"><Filter size={20}/> Filters</h3>
          <button onClick={handleClearFilters} className="text-xs flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer">
            <RotateCcw size={14} /> Clear
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text" placeholder="Search games..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-indigo-500 outline-none text-white"
          />
        </div>

        <div>
          <h4 className="font-bold text-slate-400 mb-3 text-sm uppercase">Sort By</h4>
          <select
            value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white cursor-pointer"
          >
            <option value="">Relevance</option>
            <option value="-release_date">Newest Releases</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
        </div>

        <div>
          <h4 className="font-bold text-slate-400 mb-3 text-sm uppercase">Subscription</h4>
          <select
            value={tierLevel} onChange={(e) => setTierLevel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white cursor-pointer"
          >
            <option value="">All Games</option>
            <option value="1">Included in Basic</option>
            <option value="2">Included in Pro</option>
            <option value="3">Included in Ultimate</option>
          </select>
        </div>

        <div>
          <h4 className="font-bold text-slate-400 mb-3 text-sm uppercase">Price Range</h4>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
            <span className="text-slate-500">-</span>
            <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-400 mb-3 text-sm uppercase">Genres</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {genresList.map(genre => (
              <label key={genre.slug} className="flex items-center gap-3 cursor-pointer text-sm">
                <input type="checkbox" checked={selectedGenres.includes(genre.slug)} onChange={() => toggleArrayItem(selectedGenres, setSelectedGenres, genre.slug)} className="accent-indigo-500 w-4 h-4" />
                {genre.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-extrabold">All Games</h1>
          <span className="text-slate-400 font-medium">{totalResults} Results found</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map(n => <GameCardSkeleton key={n} />)}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
            No games found matching your filters.
          </div>
        ) : (
          <>
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {games.map(game => <GameCard key={game.id} game={game} />)}
            </motion.div>

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-6 border-t border-slate-800 pt-8">
                {currentPage < totalPages && (
                  <button
                    onClick={handleLoadMore}
                    className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg cursor-pointer"
                  >
                    <Plus size={18} /> Load More Games
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {pageNumbers.map(num => (
                    <button
                      key={num}
                      onClick={() => handlePageChange(num)}
                      className={`w-10 h-10 rounded-lg font-bold transition-colors cursor-pointer ${currentPage === num ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}