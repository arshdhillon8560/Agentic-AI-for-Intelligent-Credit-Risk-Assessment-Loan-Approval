import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Lock } from 'lucide-react';

import bgImage from '../assets/background_man.png';
import logo from '../assets/virtusa_logo.png';
import icon from '../assets/icon.png';

export const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
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
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-6">
        <img src={logo} className="h-8" alt="logo" />

        <nav className="hidden md:flex gap-16 text-slate-700 font-medium">
          <span className="hover:text-[#0f3b53] cursor-pointer">Home</span>
          <span className="hover:text-[#0f3b53] cursor-pointer">About Us</span>
          <span className="hover:text-[#0f3b53] cursor-pointer">Support</span>
        </nav>

        <Link to="/login" className="font-semibold">
          Login/Signup
        </Link>
      </header>

      {/* MAIN */}
      <div className="relative flex h-[calc(100vh-80px)] overflow-hidden">

        {/* SAME GRADIENT AS LOGIN */}
        <div className="absolute inset-0 
          bg-gradient-to-r 
          from-white 
          via-[#133950] 
          to-[#002841]" 
        />

        {/* LEFT IMAGE */}
        <div className="w-1/2 flex items-center justify-center relative z-10">
          <img
            src={bgImage}
            alt="man"
            className="h-[800px] object-contain"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 flex items-center justify-center relative z-10 px-6">

          {/* CARD (SAME AS LOGIN) */}
          <div className="w-[480px] bg-[#f3f4f6] rounded-3xl shadow-xl p-12">

            {/* ICON */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-2xl flex items-center justify-center">
                <img src={icon} alt="icon" className="w-lg h-lg" />
              </div>
            </div>

            {/* TEXT */}
            <h1 className="text-3xl font-bold text-center">Create Account</h1>
            <p className="text-center text-gray-600 mb-6">
              Sign up to create your account
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME */}
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg bg-white"
                  required
                />
              </div>

              {/* EMAIL */}
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

              {/* PHONE */}
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="Mobile Number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg bg-white"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg bg-white"
                  required
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#002841] text-white py-3 rounded-lg"
              >
                {loading ? 'Creating...' : 'Sign Up'}
              </button>
            </form>

            {/* FOOTER */}
            <p className="text-center mt-5 text-sm text-gray-700">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#002841]">
                Sign In
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};