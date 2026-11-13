import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function Home({ games, loading }) {
  return (
    <main className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Featured Games</h2>
      {loading ? (
        <p className="text-slate-400">Loading catalog...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-lg">
              {game.cover_image ? (
                <img src={game.cover_image} alt={game.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-slate-800 flex items-center justify-center text-slate-500">No Cover</div>
              )}
              <div className="p-5">
                <h3 className="text-xl font-bold mb-1">{game.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{game.developer}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <span className="text-lg font-bold">${game.price}</span>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer">
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
  // Check if user already has a token saved in localStorage
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('access_token'));

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/games/')
      .then((res) => {
        setGames(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white p-8">
        {/* Navigation Bar */}
        <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center border-b border-slate-800 pb-6">
          <Link to="/" className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            PixelVault
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors">Store</Link>
            {isAuth ? (
              <Link to="/profile" className="bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 px-4 py-2 rounded-lg hover:bg-indigo-600/30 transition-colors">
                My Profile
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </header>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Home games={games} loading={loading} />} />
          <Route path="/login" element={<Login setAuth={setIsAuth} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile setAuth={setIsAuth} />} />
        </Routes>
      </div>
    </Router>
  );
}