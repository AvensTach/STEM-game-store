// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react'; // Restored to safe, original import
import { Toaster } from 'react-hot-toast';

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

import { CartProvider, useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

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

// Extracted Footer Component
function Footer() {
  const { setIsCartOpen } = useCart();

  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-[1600px] w-full mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-slate-800 pb-10">

          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight mb-4">
              PixelVault
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed pr-4">
              The ultimate destination for digital gaming. Buy, play, and discover your next favorite adventure with our premium subscription tiers.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-4 uppercase tracking-wider text-sm">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Storefront</Link></li>
              <li><Link to="/catalog" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Full Catalog</Link></li>
              <li><Link to="/pricing" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">PixelVault Subscriptions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-4 uppercase tracking-wider text-sm">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">My Profile</Link></li>
              <li><Link to="/library" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Game Library</Link></li>
              <li><button onClick={() => setIsCartOpen(true)} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm cursor-pointer">View Cart</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-4 uppercase tracking-wider text-sm">Legal & Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Refund Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Support Center</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PixelVault Gaming. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">Twitter</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">GitHub</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('access_token'));

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
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } }
          }}
        />

        {/* Outer flex column wrapper ensures footer gets pushed to the bottom */}
        <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans">

          <div className="flex-1 p-8">
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

          <Footer />
        </div>

        <CartDrawer />
      </Router>
    </CartProvider>
  );
}