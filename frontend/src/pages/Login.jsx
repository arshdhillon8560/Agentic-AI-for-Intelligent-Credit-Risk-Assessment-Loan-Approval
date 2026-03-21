import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

import bgImage from '../assets/background_man.png';
import logo from '../assets/virtusa_logo.png';
import icon from '../assets/icon.png';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="h-screen w-full flex overflow-hidden">

      {/* LEFT IMAGE */}
      <div className="hidden lg:flex w-1/2 h-full relative">
        <img src={bgImage} className="w-lg h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-[#0f3b53]" />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col h-full">

        {/* HEADER */}
        <header className="flex items-center justify-between px-8 py-6">
          <img src={logo} className="h-8" />
          <nav className="hidden md:flex gap-8 text-slate-700 font-medium">
            <span className="hover:text-sky-600 cursor-pointer">Home</span>
            <span className="hover:text-sky-600 cursor-pointer">About Us</span>
            <span className="hover:text-sky-600 cursor-pointer">Support</span>
          </nav>
          <Link to="/signup" className="font-semibold">Login/SignUp</Link>
        </header>

        {/* FORM */}
        <div className="flex flex-1 items-center justify-center px-6">

          <div className="w-[400px] max-h-[90vh] bg-white rounded-3xl shadow-xl p-8">

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-slate-200 rounded-2xl flex items-center justify-center">
                <img src={icon} className="w-10 h-10" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
            <p className="text-center text-slate-500 mb-6">Sign in to your account</p>

            {error && (
              <div className="bg-red-50 text-red-600 p-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">

              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border rounded-lg"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="text-right text-sm text-gray-500">
                Forgot Password?
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0f3b53] text-white py-3 rounded-lg"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center mt-4 text-sm">
              Don’t have an account?{' '}
              <Link to="/signup" className="font-semibold">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};