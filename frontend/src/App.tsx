import { useEffect, useState } from 'react'
import type { Order, Product, Customer } from './types';
import { getProducts, getCustomers, getOrders, createOrder, updateOrderStatus } from './api';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const loadData = async () => {
    setOrders(await getOrders());
    setProducts(await getProducts());
    setCustomers(await getCustomers());
  }

  useEffect(() => { loadData(); }, []);

  const handleCreateOrder = async () => {
    if (!selectedCustomer || !selectedProduct) return alert('Select customer and product');
    await createOrder({
      customerId: selectedCustomer,
      items: [{ productId: selectedProduct, quantity }]
    });
    loadData();
  };

  const nextStatus: Record<string, string> = {PENDING: 'CONFIRMED', CONFIRMED: 'SHIPPED', SHIPPED: 'DELIVERED'};

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          📦 Order Management
        </h1>

        {/* Create Order Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-md mx-auto flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Create New Order</h2>
          <div className="flex flex-col gap-4 w-full">
            <select
              value={selectedCustomer}
              onChange={e => setSelectedCustomer(+e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
            >
              <option value={0}>Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select
              value={selectedProduct}
              onChange={e => setSelectedProduct(+e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
            >
              <option value={0}>Select Product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>)}
            </select>

            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(+e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              placeholder="Quantity"
            />

            <button
              onClick={handleCreateOrder}
              className="w-full p-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transform hover:scale-[1.02] transition-all shadow-md"
            >
              Create Order
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-pink-400 text-white">
                  <th className="p-4 text-left rounded-tl-xl">ID</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Items</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, idx) => (
                  <tr key={o.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-4 font-medium text-gray-600">#{o.id}</td>
                    <td className="p-4 text-gray-700">{o.customer.name}</td>
                    <td className="p-4 text-gray-600">{o.orderItems.map(i => `${i.product.name} x${i.quantity}`).join(', ')}</td>
                    <td className="p-4 font-semibold text-gray-800">${o.totalAmount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {nextStatus[o.status] && (
                        <button
                          onClick={() => updateOrderStatus(o.id, nextStatus[o.status]).then(loadData)}
                          className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition font-medium text-sm"
                        >
                          → {nextStatus[o.status]}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-pink-400 text-white">
                  <th className="p-4 text-left rounded-tl-xl">Name</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left rounded-tr-xl">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={p.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-4 font-medium text-gray-700">{p.name}</td>
                    <td className="p-4 text-gray-600">${p.price}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${p.stockQuantity > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stockQuantity} in stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App
