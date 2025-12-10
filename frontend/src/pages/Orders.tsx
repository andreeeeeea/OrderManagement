import { useEffect, useState } from 'react';
import type { Order } from '../types';
import { getOrders, updateOrderStatus } from '../api';

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = () => {
    getOrders().then(setOrders);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELED: 'bg-red-100 text-red-700',
  };

  const nextStatus: Record<string, string> = {
    PENDING: 'CONFIRMED',
    CONFIRMED: 'SHIPPED',
    SHIPPED: 'DELIVERED',
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <p className="text-gray-500 text-center">No orders yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(o => (
              <div key={o.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{o.id}</h2>
                    <p className="text-sm text-gray-500">{o.createdAt}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                </div>
                <div className="border-t pt-4">
                  {o.orderItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.product.name} x{item.quantity}</span>
                      <span>${item.priceAtTime}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">${o.totalAmount}</span>
                </div>
                {nextStatus[o.status] && (
                  <button
                    onClick={() => updateOrderStatus(o.id, nextStatus[o.status]).then(loadOrders)}
                    className="mt-4 w-full px-4 py-2 bg-pink-200 text-pink-800 rounded-lg hover:bg-pink-300"
                  >
                    Mark as {nextStatus[o.status]}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
