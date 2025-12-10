import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Order, Product } from './types';
import { getProducts, getOrders, updateOrderStatus } from './api';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const loadData = async () => {
    setOrders(await getOrders());
    setProducts(await getProducts());
  }

  useEffect(() => { loadData(); }, []);

  const nextStatus: Record<string, string> = {PENDING: 'CONFIRMED', CONFIRMED: 'SHIPPED', SHIPPED: 'DELIVERED'};

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELED: 'bg-red-100 text-red-700',
  };

  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockProducts = products.filter(p => p.stockQuantity <= 5).length;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-500 text-sm">Pending Orders</p>
            <p className="text-3xl font-bold text-amber-600">{pendingOrders}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-500 text-sm">Low Stock Items</p>
            <p className="text-3xl font-bold text-red-600">{lowStockProducts}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/products" className="bg-pink-200 text-pink-800 rounded-2xl shadow-lg p-6 hover:bg-pink-300 transition">
            <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
            <p className="text-pink-600">View all products and add to cart</p>
          </Link>
          <Link to="/orders" className="bg-purple-200 text-purple-800 rounded-2xl shadow-lg p-6 hover:bg-purple-300 transition">
            <h3 className="text-xl font-semibold mb-2">View All Orders</h3>
            <p className="text-purple-600">See complete order history</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Recent Orders</h2>
            <Link to="/orders" className="text-pink-400 hover:text-pink-500 text-sm font-medium">
              View All
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 text-left rounded-tl-xl">Order</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Total</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o, idx) => (
                    <tr key={o.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-4 font-medium text-gray-600">#{o.id}</td>
                      <td className="p-4 text-gray-700">{o.customer.name}</td>
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
                            {nextStatus[o.status]}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App
