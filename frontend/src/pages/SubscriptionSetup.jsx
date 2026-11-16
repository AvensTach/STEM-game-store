// frontend/src/pages/SubscriptionSetup.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Calendar, ArrowRight } from 'lucide-react';

export default function SubscriptionSetup() {
  const { tierId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [tier, setTier] = useState(location.state?.tier || null);
  const [duration, setDuration] = useState(1); // 1, 3, or 12 months

  useEffect(() => {
    if (!tier) navigate('/pricing');
  }, [tier, navigate]);

  if (!tier) return null;

  // NEW: Dynamic discount math
  const calculateTotal = () => {
    const basePrice = tier.price * duration;
    let discountRate = 0;

    if (duration === 3) discountRate = 0.05; // 5% off
    if (duration === 12) discountRate = 0.15; // 15% off

    const finalPrice = basePrice - (basePrice * discountRate);
    return finalPrice.toFixed(2);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout', {
      state: {
        type: 'subscription',
        tier: tier,
        duration: duration,
        total: calculateTotal()
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Configure Subscription</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl mb-8">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-800">
          <div className="p-4 bg-indigo-500/20 rounded-xl text-indigo-400">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{tier.name} Tier</h2>
            <p className="text-slate-400">${tier.price} / month</p>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-slate-400"/> Select Billing Cycle
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { months: 1, label: 'Monthly', discount: 0 },
            { months: 3, label: 'Quarterly', discount: 5 },
            { months: 12, label: 'Annually', discount: 15 }
          ].map((plan) => (
            <button
              key={plan.months}
              onClick={() => setDuration(plan.months)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                duration === plan.months 
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                  : 'bg-slate-950 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="font-bold mb-1">{plan.label}</div>
              <div className="text-sm text-slate-400">{plan.months} Month{plan.months > 1 && 's'}</div>
              {plan.discount > 0 && (
                <span className="inline-block mt-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                  Save {plan.discount}%
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center bg-slate-950 p-6 rounded-xl border border-slate-800">
          <div>
            <p className="text-slate-400 text-sm mb-1">Total due today</p>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-extrabold">${calculateTotal()}</p>
              {duration > 1 && (
                <p className="text-sm text-slate-500 line-through">
                  ${(tier.price * duration).toFixed(2)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleProceedToCheckout}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-indigo-900/20 cursor-pointer"
          >
            Continue <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}