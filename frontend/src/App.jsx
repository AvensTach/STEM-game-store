// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import GameDetail from './pages/GameDetail';
import Library from './pages/Library';
import SubscriptionSetup from './pages/SubscriptionSetup';
import Checkout from './pages/Checkout';

// Context & Components
import { CartProvider, useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

// Helper component for the Navbar cart icon
function CartNavIcon() {
  const { cart, setIsCartOpen } = useCart();
  const itemCount = cart?.items?.length || 0;

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative text-slate-300 hover:text-white transition-colors p-2 cursor-pointer"
    >
      <ShoppingCart size={22} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950">
          {itemCount}
        </span>
      )}
    </button>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('access_token'));

  // We only fetch the user profile globally now. Games are fetched by Home/Catalog.
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.get('http://127.0.0.1:8000/api/auth/profile/', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [isAuth]);

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
          <header className="max-w-[1600px] w-full mx-auto mb-12 flex justify-between items-center border-b border-slate-800 pb-6">
            <Link to="/" className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-opacity">
              PixelVault
            </Link>

            <nav className="flex items-center gap-6">
              <Link to="/" className="text-slate-300 hover:text-white font-medium transition-colors">
                Store
              </Link>
              <Link to="/catalog" className="text-slate-300 hover:text-white font-medium transition-colors">
                Catalog
              </Link>
              <Link to="/pricing" className="text-slate-300 hover:text-white font-medium transition-colors">
                Subscriptions
              </Link>

              {isAuth && (
                <Link to="/library" className="text-slate-300 hover:text-white font-medium transition-colors">
                  My Library
                </Link>
              )}

              {/* Dynamic Cart Icon */}
              {isAuth && <CartNavIcon />}

              {isAuth ? (
                <Link
                  to="/profile"
                  className="bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 px-4 py-2 rounded-lg hover:bg-indigo-600/30 transition-colors font-medium"
                >
                  My Profile
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-900/20">
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </header>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/library" element={<Library />} />
            <Route path="/login" element={<Login setAuth={setIsAuth} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile setAuth={setIsAuth} />} />
            <Route path="/game/:id" element={<GameDetail user={user} />} />
            <Route path="/subscribe/:tierId" element={<SubscriptionSetup />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>

        {/* Global Cart Drawer */}
        <CartDrawer />
      </Router>
    </CartProvider>
  );
}