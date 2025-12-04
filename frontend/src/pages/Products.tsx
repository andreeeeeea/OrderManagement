import { useEffect, useState } from 'react';
import type { Product } from '../types';
import { getProducts } from '../api';

function Products() {
  const [products, setProducts] = useState<Product[]>([]);

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
              <p className="text-2xl font-bold text-pink-500 mb-4">${p.price}</p>
              <p className="text-sm text-gray-500 mb-4">{p.stockQuantity} in stock</p>
              <button className="w-full p-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600">
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
