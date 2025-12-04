import { useState } from 'react';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    alert('Register clicked');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="p-3 border border-gray-200 rounded-xl"
          />
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
            onClick={handleRegister}
            className="p-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600"
          >
            Register
          </button>
        </div>
        <p className="text-center mt-4 text-gray-600">
          Already have an account? <a href="/login" className="text-pink-500">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
