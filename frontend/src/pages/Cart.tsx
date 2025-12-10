import { useCart } from '../context/CartContext';
import { createOrder } from '../api';

function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, total, selectedCustomer } = useCart();

  const handlePlaceOrder = async () => {
    if (!selectedCustomer) {
      alert('Please select a customer from the navbar.');
      return;
    }
    if (items.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    try {
      await createOrder({
        customerId: selectedCustomer,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });
      clearCart();
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error creating order:', error);  
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <p className="text-gray-600">Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{item.product.name}</h2>
                    <p className="text-gray-600">${item.product.price} each</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1 bg-pink-200 text-pink-800 rounded-lg hover:bg-pink-300"
                      >-</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1 bg-pink-200 text-pink-800 rounded-lg hover:bg-pink-300"
                      >+</button>
                      <span className="w-20 text-right font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-4 px-3 py-1 bg-red-200 text-red-800 rounded-lg hover:bg-red-300"
                      >Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-pink-400">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full p-3 bg-pink-200 text-pink-800 rounded-xl hover:bg-pink-300"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
