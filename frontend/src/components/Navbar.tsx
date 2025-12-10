import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
    const { items, customers, selectedCustomer, setSelectedCustomer } = useCart();
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 rounded-lg transition ${isActive ? 'bg-pink-200 text-pink-800' : 'text-gray-600 hover:bg-pink-100 hover:text-pink-600'}`;

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <NavLink to="/" className="text-2xl font-bold text-pink-400">
                        OrderManager
                    </NavLink>

                    <div className="flex gap-2">
                        <NavLink to="/" className={linkClass} end>
                            Dashboard
                        </NavLink>
                        <NavLink to="/products" className={linkClass}>
                            Products
                        </NavLink>
                        <NavLink to="/cart" className={linkClass}>
                            Cart {cartCount > 0 && (
                                <span className="ml-1 bg-pink-300 text-pink-800 text-xs px-2 py-0.5 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>
                        <NavLink to="/orders" className={linkClass}>
                            Orders
                        </NavLink>
                    </div>

                    <select
                        value={selectedCustomer}
                        onChange={e => setSelectedCustomer(+e.target.value)}
                        className="p-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                        <option value={0}>Select Customer</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;