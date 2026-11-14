// frontend/src/components/CartDrawer.jsx
import { useCart } from '../context/CartContext.jsx';
import { X, Trash2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Background Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Slide-out Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <ShoppingCart size={20} className="text-indigo-400" />
            Your Cart
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center text-slate-500 mt-12 flex flex-col items-center">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <img
                  src={item.game.cover_image_url}
                  alt={item.game.title}
                  className="w-20 h-20 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-sm leading-tight">{item.game.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-extrabold text-indigo-400">${item.game.price}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-950">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400 font-medium">Total Price:</span>
            <span className="text-2xl font-extrabold text-white">
              ${parseFloat(cart.total_price || 0).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.items.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-indigo-900/20 cursor-pointer"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}