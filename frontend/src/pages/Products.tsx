import { useEffect, useState } from 'react';
import type { Product } from '../types';
import { getProducts } from '../api';
import { useCart } from '../context/CartContext';

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-2">{p.name}</h2>
              <p className="text-gray-600 mb-4">{p.description}</p>
              <p className="text-2xl font-bold text-pink-400 mb-4">${p.price}</p>
              <p className="text-sm text-gray-500 mb-4">{p.stockQuantity} in stock</p>
              <button
                onClick={() => addToCart(p)}
                className="w-full p-3 bg-pink-200 text-pink-800 rounded-xl hover:bg-pink-300">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
