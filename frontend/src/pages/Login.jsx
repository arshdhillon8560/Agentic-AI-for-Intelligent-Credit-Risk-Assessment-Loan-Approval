import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock } from 'lucide-react';

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
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-6">
        <img src={logo} className="h-8" alt="logo" />

        <nav className="w-lg hidden md:flex gap-16 text-slate-700 font-medium">
          <span className="hover:text-[#0f3b53] cursor-pointer">Home</span>
          <span className="hover:text-[#0f3b53] cursor-pointer">About Us</span>
          <span className="hover:text-[#0f3b53] cursor-pointer">Support</span>
        </nav>

        <Link to="/signup" className="font-semibold">
          Login/Signup
        </Link>
      </header>

      {/* MAIN */}
      <div className="relative flex h-[calc(100vh-80px)] overflow-hidden">

        {/* FULL SCREEN GRADIENT (MAIN FIX) */}
        <div className="absolute inset-0
          bg-gradient-to-r 
          from-white 
          via-[#133950] 
          to-[#002841]" 
        />

        {/* LEFT IMAGE */}
        <div className="w-1/2  flex items-center justify-center relative z-10">
          <img
            src={bgImage}
            alt="man"
            className="h-[800px] object-contain"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 flex items-center justify-center relative z-10 px-6">

          {/* CARD */}
          <div className="w-[480px] bg-[#f3f4f6] rounded-3xl shadow-xl p-12">

            {/* ICON */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-2xl flex items-center justify-center">
                <img src={icon} alt="icon" className="w-lg h-lg" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
            <p className="text-center text-gray-600 mb-6">
              Sign in to your account
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg bg-white"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg bg-white"
                  required
                />
                <div className="text-right text-sm text-gray-600">
                Forgot Password?
              </div>
              </div>

              

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#002841] text-white py-3 rounded-lg"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center mt-5 text-sm text-gray-700">
              Don’t have an account?{' '}
              <Link to="/signup" className="font-semibold text-[#002841]">
                Sign Up
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};