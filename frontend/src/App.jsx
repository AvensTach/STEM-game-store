// frontend/src/App.jsx
import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import {Play, ShoppingCart} from 'lucide-react';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import GameDetail from './pages/GameDetail';
import Library from './pages/Library';
import SubscriptionSetup from './pages/SubscriptionSetup';
import Checkout from './pages/Checkout';

import {CartProvider, useCart} from './context/CartContext';
import CartDrawer from './components/CartDrawer';

function Home({games, loading, user}) {
    // Extract addToCart from our new Context
    const {addToCart} = useCart();

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
                    {games.map((game) => {
                        // SMART INTERACTION LOGIC
                        const gameTierLevel = game.minimum_subscription_tier?.access_level;
                        const userTierLevel = user?.subscription?.is_active ? user.subscription.tier.access_level : 0;

                        const hasAccess = gameTierLevel && userTierLevel >= gameTierLevel;

                        return (
                            <div
                                key={game.id}
                                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-lg flex flex-col"
                            >

                                <Link to={`/game/${game.id}`}
                                      className="relative h-48 w-full bg-slate-800 block hover:opacity-90 transition-opacity">
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

                                    <div className="absolute top-3 left-3">
                                        {game.minimum_subscription_tier ? (
                                            <span
                                                className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-400/90 backdrop-blur-sm px-2.5 py-1 rounded shadow-sm">
                            {game.minimum_subscription_tier.name}
                          </span>
                                        ) : (
                                            <span
                                                className="text-xs font-bold uppercase tracking-wider text-white bg-slate-800/90 backdrop-blur-sm px-2.5 py-1 rounded shadow-sm border border-slate-700">
                            Buy Only
                          </span>
                                        )}
                                    </div>
                                </Link>

                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {game.platforms && game.platforms.slice(0, 3).map(platform => (
                                            <span
                                                key={platform.id}
                                                className="text-[10px] font-medium text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded"
                                            >
                        {platform.name}
                      </span>
                                        ))}
                                    </div>

                                    <h3 className="text-xl font-bold mb-1 leading-tight">{game.title}</h3>
                                    <p className="text-sm text-slate-400 mb-1">
                                        {game.developer?.name || 'Unknown Developer'}
                                    </p>
                                    <p className="text-xs text-slate-500 mb-6 flex-grow">
                                        {game.genres && game.genres.map(g => g.name).join(', ')}
                                    </p>

                                    <div
                                        className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">
                                        <span className="text-lg font-bold">${game.price}</span>

                                        {hasAccess ? (
                                            <button
                                                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-900/20">
                                                <Play size={16} fill="currentColor"/>
                                                Play
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => addToCart(game.id)}
                                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-md shadow-indigo-900/20"
                                            >
                                                Buy Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}

// Helper component for the Navbar cart icon
function CartNavIcon() {
    const {cart, setIsCartOpen} = useCart();
    const itemCount = cart?.items?.length || 0;

    return (
        <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-slate-300 hover:text-white transition-colors p-2 cursor-pointer"
        >
            <ShoppingCart size={22}/>
            {itemCount > 0 && (
                <span
                    className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950">
          {itemCount}
        </span>
            )}
        </button>
    );
}

export default function App() {
    const [games, setGames] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('access_token'));

    useEffect(() => {
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

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axios.get('http://127.0.0.1:8000/api/auth/profile/', {
                headers: {Authorization: `Bearer ${token}`}
            })
                .then((res) => setUser(res.data))
                .catch(() => setUser(null));
        } else {
            setUser(null);
        }
    }, [isAuth]);

    return (
        // Wrap the entire app in the CartProvider
        <CartProvider>
            <Router>
                <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
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
                            <Link to="/pricing"
                                  className="text-slate-300 hover:text-white font-medium transition-colors">
                                Subscriptions
                            </Link>

                            {isAuth && (
                                <Link to="/library"
                                      className="text-slate-300 hover:text-white font-medium transition-colors">
                                    My Library
                                </Link>
                            )}

                            {/* Dynamic Cart Icon */}
                            {isAuth && <CartNavIcon/>}

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

                    <Routes>
                        <Route path="/" element={<Home games={games} loading={loading} user={user}/>}/>
                        <Route path="/pricing" element={<Pricing/>}/>
                        <Route path="/library" element={<Library/>}/> {/* NEW ROUTE */}
                        <Route path="/login" element={<Login setAuth={setIsAuth}/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/profile" element={<Profile setAuth={setIsAuth}/>}/>
                        <Route path="/game/:id" element={<GameDetail user={user}/>}/>
                        <Route path="/subscribe/:tierId" element={<SubscriptionSetup/>}/>
                        <Route path="/checkout" element={<Checkout/>}/>
                    </Routes>
                </div>

                {/* Global Cart Drawer */}
                <CartDrawer/>
            </Router>
        </CartProvider>
    );
}