import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { BrandLogo } from '../components/Navbar';

export default function Login() {
  const { login } = useBooking();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    login({ email: email.trim() });
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    login({ email: 'aarav@roommate.demo', name: 'Aarav Sharma' });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <BrandLogo />
          </div>
          <h1 className="font-display font-bold text-xl text-navy">Welcome Back</h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to manage your bookings and saved preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-200 focus:ring-navy/20'
              }`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full px-3.5 py-2.5 pr-10 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-slate-200 focus:ring-navy/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-navy hover:bg-navy-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Log In
          </button>
        </form>

        <div className="my-4 flex items-center gap-2 text-xs text-slate-400">
          <div className="flex-1 h-px bg-slate-200" />
          <span>or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 rounded-lg border border-accent/40 bg-accent-light hover:bg-orange-100 text-accent text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          One-Click Demo Login (Aarav Sharma)
        </button>

        <p className="text-center text-xs text-slate-500 mt-5">
          New to Room-mate?{' '}
          <Link to="/signup" className="font-semibold text-accent hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
