// frontend/src/pages/GameDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Play, Calendar, Monitor, Tag, User, ShieldCheck, CreditCard } from 'lucide-react';

export default function GameDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/games/${id}/`)
      .then((res) => {
        setGame(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching game details", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center text-slate-400 mt-24">Loading game details...</p>;
  if (!game) return <p className="text-center text-red-400 mt-24">Game not found.</p>;

  // Smart Interaction Logic (reused from App.jsx)
  const gameTierLevel = game.minimum_subscription_tier?.access_level;
  const userTierLevel = user?.subscription?.is_active ? user.subscription.tier.access_level : 0;
  const hasAccess = gameTierLevel && userTierLevel >= gameTierLevel;

  return (
    <div className="max-w-[1600px] w-full mx-auto pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Store
      </button>

      {/* Hero Banner */}
      <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl mb-12 border border-slate-800">
        {game.cover_image_url ? (
          <img src={game.cover_image_url} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">No Image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        {/* --- MOVED BADGE: Top Left --- */}
        <div className="absolute top-6 left-6 z-10">
          {game.minimum_subscription_tier && (
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-400/90 backdrop-blur-md rounded-full shadow-lg border border-emerald-300/50">
              {game.minimum_subscription_tier.name}
            </span>
          )}
        </div>
        {/* ----------------------------- */}

        <div className="absolute bottom-0 left-0 p-10 w-full flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">{game.title}</h1>
          </div>

          <div className="flex items-center gap-6 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-xl">
            <div className="text-right">
              <p className="text-sm text-slate-400 font-medium">Price</p>
              <p className="text-3xl font-extrabold text-white">${game.price}</p>
            </div>

            {hasAccess ? (
              <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-emerald-900/20 cursor-pointer">
                <Play size={20} fill="currentColor" /> Play Now
              </button>
            ) : (
              <button
                onClick={() => addToCart(game.id)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-indigo-900/20 cursor-pointer"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">About this game</h2>
          <div className="text-slate-300 leading-relaxed space-y-4 whitespace-pre-wrap">
            {game.description || "No description available."}
          </div>
        </div>

        <div className="space-y-6">

          {/* --- NEW AVAILABILITY BLOCK --- */}
          {game.minimum_subscription_tier ? (
            <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/30 p-5 rounded-2xl shadow-lg flex items-start gap-4">
              <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400 mt-1">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-emerald-300 mb-1">Included in Subscription</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Available to play at no extra cost with the <span className="font-bold text-white">{game.minimum_subscription_tier.name}</span> subscription plan.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-start gap-4">
              <div className="p-2.5 bg-slate-800 rounded-xl text-slate-400 mt-1">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-300 mb-1">Purchase Only</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  This title is not currently included in any active subscription plans.
                </p>
              </div>
            </div>
          )}
          {/* ------------------------------ */}

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 border-b border-slate-800 pb-2">Details</h3>

            <div className="space-y-4">

              <div>
                <p className="text-sm text-slate-500 flex items-center gap-2 mb-1">
                  <User size={16}/> Developer
                </p>
                <p className="font-medium text-slate-200">
                  {game.developer?.name || 'Unknown Developer'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 flex items-center gap-2 mb-1"><Calendar size={16}/> Release Date</p>
                <p className="font-medium text-slate-200">{game.release_date || 'TBA'}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 flex items-center gap-2 mb-1"><Tag size={16}/> Genres</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {game.genres?.map(g => (
                    <span key={g.id} className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded">{g.name}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 flex items-center gap-2 mb-1"><Monitor size={16}/> Platforms</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {game.platforms?.map(p => (
                    <span key={p.id} className="bg-indigo-900/30 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-1 rounded">{p.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}