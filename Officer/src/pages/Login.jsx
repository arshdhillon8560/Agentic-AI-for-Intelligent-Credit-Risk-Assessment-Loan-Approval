import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock } from 'lucide-react';
import '../App.css'

import bgImage from '../assets/background_man.png';
import logo from '../assets/virtusa_logo.png';
import icon from '../assets/icon.png';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authAPI.login(formData);

      if (!res.token) {
        setError(res.message || "Login failed");
        return;
      }

      login(res.token);
      navigate('/dashboard');

    } catch (err) {
      setError("Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white">

      {/* HEADER */}
      <header className="flex items-center justify-between px-10 py-6">
        <img src={logo} className="h-8" />

        <nav className="hidden md:flex gap-12 text-gray-700 font-medium">
          <span className="hover:text-primary cursor-pointer">Home</span>
          <span className="hover:text-primary cursor-pointer">About Us</span>
          <span className="hover:text-primary cursor-pointer">Support</span>
        </nav>

        <span className="font-semibold text-gray-700">Officer Panel</span>
      </header>

      {/* MAIN */}
      <div className="flex flex-1 relative overflow-hidden">

        {/* BACKGROUND GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-[#133950] to-[#002841]" />

        {/* LEFT IMAGE */}
        <div className="w-1/2 hidden lg:flex items-center justify-center relative z-10">
          <img
            src={bgImage}
            alt="man"
            className="h-[800px] object-contain"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex items-center justify-center relative z-10 px-6">

          {/* CARD */}
          <div className="w-[420px] bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-10">

            {/* ICON */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-2xl flex items-center justify-center">
                <img src={icon} className="w-lg h-lg" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-gray-800">
              Officer Login
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Secure access to credit dashboard
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

             

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center mt-5 text-sm text-gray-600">
              System Access Restricted to Officers
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};