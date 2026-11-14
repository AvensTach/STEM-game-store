// frontend/src/pages/Checkout.jsx
import {useLocation, useNavigate} from 'react-router-dom';
import {useCart} from '../context/CartContext';
import {CreditCard, Lock} from 'lucide-react';
import axios from 'axios';

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const {cart, fetchCart} = useCart();

    // Determine what we are checking out
    const isSubscription = location.state?.type === 'subscription';
    const subData = location.state;

    // Calculate totals based on context
    const itemsCount = isSubscription ? 1 : cart?.items?.length || 0;
    const totalAmount = isSubscription ? subData.total : cart?.total_price || 0;

    const handlePayment = async () => {
        const token = localStorage.getItem('access_token');

        try {
            if (isSubscription) {
                // Handle Subscription Logic (Endpoint to be built in Phase 3)
                await axios.post('http://127.0.0.1:8000/api/subscriptions/subscribe/', {
                    tier_id: subData.tier.id,
                    duration_months: subData.duration
                }, {headers: {Authorization: `Bearer ${token}`}});

                alert("Subscription activated!");
                navigate('/profile');
            } else {
                // Handle Cart Checkout (Corrected to target the orders app)
                await axios.post('http://127.0.0.1:8000/api/orders/checkout/', {}, {
                    headers: {Authorization: `Bearer ${token}`}
                });

                fetchCart();
                alert("Games added to your library!");
                navigate('/library');
            }
        } catch (error) {
            console.error("Payment failed", error);
            alert("Payment failed. Please try again.");
        }
    };

    if (!isSubscription && itemsCount === 0) {
        return <div className="text-center mt-24 text-slate-400">Nothing to checkout.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Payment Form (Mock) */}
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="text-indigo-400"/> Payment Details
                </h2>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Cardholder Name</label>
                        <input type="text"
                               className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                               placeholder="John Doe"/>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Card Number</label>
                        <input type="text"
                               className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                               placeholder="•••• •••• •••• ••••"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Expiry</label>
                            <input type="text"
                                   className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                                   placeholder="MM/YY"/>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">CVC</label>
                            <input type="text"
                                   className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                                   placeholder="123"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                    {isSubscription ? (
                        <div className="flex justify-between items-center py-4 border-b border-slate-800">
                            <div>
                                <p className="font-bold">{subData.tier.name} Subscription</p>
                                <p className="text-sm text-slate-400">{subData.duration} Month Plan</p>
                            </div>
                            <p className="font-bold">${subData.total}</p>
                        </div>
                    ) : (
                        cart.items.map(item => (
                            <div key={item.id}
                                 className="flex justify-between items-center py-4 border-b border-slate-800">
                                <div className="flex items-center gap-3">
                                    <img src={item.game.cover_image_url} alt="Cover"
                                         className="w-12 h-12 object-cover rounded"/>
                                    <p className="font-medium text-sm">{item.game.title}</p>
                                </div>
                                <p className="font-bold">${item.game.price}</p>
                            </div>
                        ))
                    )}

                    <div className="flex justify-between items-center mt-6 mb-8 text-xl">
                        <span className="text-slate-400">Total</span>
                        <span className="font-extrabold text-white">${totalAmount}</span>
                    </div>

                    <button
                        onClick={handlePayment}
                        className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
                    >
                        <Lock size={18}/> Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
}