// frontend/src/App.jsx
import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function Home({games, loading}) {
    return (
        <main className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Featured Games</h2>

            {loading ? (
                <p className="text-slate-400">Loading catalog...</p>
            ) : games.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                    No games found. Did you run the import script?
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <div
                            key={game.id}
                            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-lg flex flex-col"
                        >
                            {/* Image Section - Updated to use cover_image_url from RAWG */}
                            <div className="relative h-48 w-full bg-slate-800">
                                {game.cover_image_url ? (
                                    <img
                                        src={game.cover_image_url}
                                        alt={game.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        No Cover
                                    </div>
                                )}

                                {/* Subscription Tier Badge */}
                                {game.minimum_subscription_tier ? (
                                    <div className="absolute top-3 left-3">
                    <span
                        className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-400/90 backdrop-blur-sm px-2.5 py-1 rounded shadow-sm">
                      {game.minimum_subscription_tier.name}
                    </span>
                                    </div>
                                ) : (
                                    <div className="absolute top-3 left-3">
                    <span
                        className="text-xs font-bold uppercase tracking-wider text-white bg-slate-800/90 backdrop-blur-sm px-2.5 py-1 rounded shadow-sm border border-slate-700">
                      Buy Only
                    </span>
                                    </div>
                                )}
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex flex-col flex-grow">
                                {/* Platforms Tags (Showing up to 3) */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {game.platforms && game.platforms.slice(0, 3).map(platform => (
                                        <span
                                            key={platform.id}
                                            className="text-[10px] font-medium text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded"
                                        >
                      {platform.name}
                    </span>
                                    ))}
                                    {game.platforms && game.platforms.length > 3 && (
                                        <span className="text-[10px] text-slate-500 px-1 py-0.5">
                      +{game.platforms.length - 3}
                    </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold mb-1 leading-tight">{game.title}</h3>

                                {/* Genres & Developer Data */}
                                <p className="text-sm text-slate-400 mb-1">
                                    {game.developer?.name || 'Unknown Developer'}
                                </p>
                                <p className="text-xs text-slate-500 mb-6 flex-grow">
                                    {game.genres && game.genres.map(g => g.name).join(', ')}
                                </p>

                                {/* Footer Section aligned to bottom */}
                                <div
                                    className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">
                                    <span className="text-lg font-bold">${game.price}</span>
                                    <button
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-md shadow-indigo-900/20">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default function App() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('access_token'));

    useEffect(() => {
        // Make sure your Django server is running!
        axios.get('http://127.0.0.1:8000/api/games/')
            .then((res) => {
                setGames(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching games:", error);
                setLoading(false);
            });
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">

                {/* Navigation Bar */}
                <header
                    className="max-w-6xl mx-auto mb-12 flex justify-between items-center border-b border-slate-800 pb-6">
                    <Link to="/"
                          className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-opacity">
                        PixelVault
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link to="/" className="text-slate-300 hover:text-white font-medium transition-colors">
                            Store
                        </Link>

                        {isAuth ? (
                            <Link
                                to="/profile"
                                className="bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 px-4 py-2 rounded-lg hover:bg-indigo-600/30 transition-colors font-medium"
                            >
                                My Profile
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login"
                                      className="text-slate-300 hover:text-white font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register"
                                      className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-900/20">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </nav>
                </header>

                {/* Page Routes */}
                <Routes>
                    <Route path="/" element={<Home games={games} loading={loading}/>}/>
                    <Route path="/login" element={<Login setAuth={setIsAuth}/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/profile" element={<Profile setAuth={setIsAuth}/>}/>
                </Routes>

            </div>
        </Router>
    );
}