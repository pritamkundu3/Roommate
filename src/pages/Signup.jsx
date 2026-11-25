import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { BrandLogo } from '../components/Navbar';

export default function Signup() {
  const { signup } = useBooking();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    signup({ name, email });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <BrandLogo />
          </div>
          <h1 className="font-display font-bold text-xl text-navy">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join Room-mate for faster checkouts and member-only rates
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Nair"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-200 focus:ring-navy/20'
              }`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

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
                placeholder="At least 6 characters"
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
            className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Sign Up
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-navy hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
