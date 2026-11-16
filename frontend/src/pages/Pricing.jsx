// frontend/src/pages/Pricing.jsx
import {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Check} from 'lucide-react';

export default function Pricing() {
    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/subscriptions/tiers/')
            .then((res) => {
                setTiers(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load subscription tiers.');
                setLoading(false);
            });
    }, []);

    const handleSubscribe = async (tierId) => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate('/login');
            return;
        }

        setProcessingId(tierId);
        setError('');

        try {
            await axios.post(
                'http://127.0.0.1:8000/api/subscriptions/checkout/',
                {tier_id: tierId},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            // Redirect to profile to see the newly activated subscription
            navigate('/profile');
        } catch (err) {
            setError('Subscription failed. Please try again.');
            setProcessingId(null);
        }
    };

    if (loading) return <p className="text-center text-slate-400 mt-24">Loading plans...</p>;

    return (
        <div className="max-w-6xl mx-auto py-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-extrabold mb-4">Choose Your Level</h1>
                <p className="text-xl text-slate-400">
                    Unlock instant access to our massive library. Upgrade, downgrade, or cancel anytime.
                </p>
            </div>

            {error && (
                <div
                    className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/30 text-red-400 text-center p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {tiers.map((tier) => {
                    // Highlight the Premium tier (Assuming Level 3 is the highest)
                    const isPremium = tier.access_level === 3;

                    return (
                        <div
                            key={tier.id}
                            className={`relative bg-slate-900 rounded-3xl p-8 flex flex-col h-full transition-transform duration-300 hover:-translate-y-2 ${
                                isPremium
                                    ? 'border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20'
                                    : 'border border-slate-800 shadow-xl'
                            }`}
                        >
                            {isPremium && (
                                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span
                      className="bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-lg">
                    Most Popular
                  </span>
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-extrabold">${tier.price}</span>
                                <span className="text-slate-400">/mo</span>
                            </div>

                            <p className="text-slate-400 mb-8 flex-grow">
                                {tier.description || `Gain Level ${tier.access_level} catalog access.`}
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3">
                                    <div className="bg-emerald-500/20 p-1 rounded-full text-emerald-400">
                                        <Check size={16} strokeWidth={3}/>
                                    </div>
                                    <span className="text-slate-300 text-sm">Level {tier.access_level} Games</span>
                                </li>
                                {isPremium && (
                                    <li className="flex items-center gap-3">
                                        <div className="bg-emerald-500/20 p-1 rounded-full text-emerald-400">
                                            <Check size={16} strokeWidth={3}/>
                                        </div>
                                        <span className="text-slate-300 text-sm">Priority Support</span>
                                    </li>
                                )}
                            </ul>
                            <button
                                onClick={() => navigate(`/catalog?tier_level=${tier.access_level}`)}
                                className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-colors border border-slate-700 flex justify-center items-center gap-2 text-sm"
                            >
                                Browse Included Games
                            </button>

                            <button
                                onClick={() => navigate(`/subscribe/${tier.id}`, {state: {tier: tier}})}
                                disabled={processingId === tier.id}
                                className={`w-full py-3 px-4 rounded-xl font-bold transition-colors ${
                                    isPremium
                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {processingId === tier.id ? 'Processing...' : 'Subscribe Now'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}