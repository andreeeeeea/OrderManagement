import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    alert('Login clicked');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="p-3 border border-gray-200 rounded-xl"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-3 border border-gray-200 rounded-xl"
          />
          <button
            onClick={handleLogin}
            className="p-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600"
          >
            Login
          </button>
        </div>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account? <a href="/register" className="text-pink-500">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
