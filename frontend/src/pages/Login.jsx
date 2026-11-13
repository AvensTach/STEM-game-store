import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Request JWT tokens from Django
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
        username,
        password,
      });
      // Save tokens in browser localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setAuth(true);
      navigate('/profile');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      {error && <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-slate-400 mt-6 text-center">
        Don't have an account? <Link to="/register" className="text-indigo-400 hover:underline">Register here</Link>
      </p>
    </div>
  );
}