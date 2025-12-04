function Cart() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <p className="text-gray-500 text-center">Your cart is empty</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between mb-4">
            <span className="text-lg">Total:</span>
            <span className="text-2xl font-bold">$0.00</span>
          </div>
          <button className="w-full p-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
