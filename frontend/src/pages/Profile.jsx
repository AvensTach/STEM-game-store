import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Calendar, Mail } from 'lucide-react';

export default function Profile({ setAuth }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user data by passing the JWT token in the Authorization header
    axios.get('http://127.0.0.1:8000/api/auth/profile/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setUser(res.data))
    .catch(() => {
      // If token is expired or invalid, clear storage and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setAuth(false);
      navigate('/login');
    });
  }, [navigate, setAuth]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAuth(false);
    navigate('/');
  };

  if (!user) return <p className="text-center text-slate-400 mt-12">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              Active Account
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="space-y-4 text-slate-300">
        <div className="flex items-center gap-3">
          <Mail size={18} className="text-slate-500" />
          <span>{user.email || 'No email provided'}</span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-slate-500" />
          <span>Joined: {new Date(user.date_joined).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}