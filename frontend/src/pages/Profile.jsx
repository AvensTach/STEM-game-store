// frontend/src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Calendar, Mail, ShieldCheck, Zap } from 'lucide-react';

export default function Profile({ setAuth }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://127.0.0.1:8000/api/auth/profile/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setUser(res.data))
    .catch(() => {
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

  // Check if the user object has a nested, active subscription
  const hasActiveSub = user.subscription && user.subscription.is_active;

  return (
    <div className="max-w-3xl mx-auto mt-12 space-y-6">

      {/* Main Profile Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
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

      {/* Subscription Status Card */}
      <div
        className={`rounded-2xl p-8 border transition-all duration-500 ${
          hasActiveSub 
            ? 'bg-slate-900 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]' 
            : 'bg-slate-900/50 border-slate-800'
        }`}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ShieldCheck className={hasActiveSub ? 'text-indigo-400' : 'text-slate-500'} />
          Subscription Status
        </h3>

        {hasActiveSub ? (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-extrabold text-white">
                  {user.subscription.tier.name}
                </span>
                {/* Glowing Status Badge */}
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  Active
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Level {user.subscription.tier.access_level} Access • Valid until <span className="text-slate-200 font-medium">{new Date(user.subscription.end_date).toLocaleDateString()}</span>
              </p>
            </div>
            <Link
              to="/pricing"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-lg transition-colors text-sm font-medium border border-slate-700 hover:border-slate-600 cursor-pointer"
            >
              Manage Plan
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-center bg-slate-950 p-6 rounded-xl border border-slate-800">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-bold text-slate-300 mb-1">No Active Plan</h4>
              <p className="text-sm text-slate-500">Unlock the full library by subscribing to a tier.</p>
            </div>
            <Link
              to="/pricing"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl transition-colors font-bold shadow-lg shadow-indigo-900/20 cursor-pointer"
            >
              <Zap size={18} />
              View Plans
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}