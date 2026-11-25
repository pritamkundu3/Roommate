import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, MapPin, Menu, X, User, LogOut, CalendarCheck } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export function BrandLogo({ dark = false }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2 group select-none">
      <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-navy text-white shadow-sm group-hover:bg-navy-700 transition-colors">
        <Home className="w-4 h-4" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-white flex items-center justify-center">
          <MapPin className="w-2 h-2 text-white hidden" />
        </span>
      </div>
      <div className="leading-none">
        <span
          className={`font-display font-bold text-xl tracking-tight ${
            dark ? 'text-white' : 'text-navy'
          }`}
        >
          Room<span className="text-accent">-</span>mate
        </span>
        <span
          className={`block text-[10px] font-medium tracking-wide ${
            dark ? 'text-slate-300' : 'text-slate-500'
          }`}
        >
          Your stay, your way.
        </span>
      </div>
    </Link>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, bookings } = useBooking();
  const navigate = useNavigate();

  const upcomingCount = bookings.filter((b) => b.status === 'Upcoming').length;

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-2.5 py-1.5 rounded-md ${
      isActive
        ? 'text-accent bg-accent-light'
        : 'text-slate-600 hover:text-navy hover:bg-slate-100'
    }`;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <BrandLogo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/hotels" className={navLinkClass}>
              Hotels
            </NavLink>
            <NavLink to="/offers" className={navLinkClass}>
              Offers
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
          </nav>

          {/* Desktop Auth / Dashboard Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-navy text-sm font-medium transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-navy text-white text-xs font-semibold flex items-center justify-center uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  {upcomingCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[11px] font-semibold rounded-full bg-accent text-white">
                      {upcomingCount}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Log out"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-navy hover:bg-slate-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-accent hover:bg-accent-hover text-white shadow-sm transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-navy transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg">
          <div className="flex flex-col space-y-1">
            <NavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>
            <NavLink
              to="/hotels"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              Hotels
            </NavLink>
            <NavLink
              to="/offers"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              Offers
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              About Us
            </NavLink>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 text-navy text-sm font-medium"
                >
                  <span className="inline-flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {user.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-accent font-semibold">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    {upcomingCount} Upcoming
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center px-3 py-2 rounded-lg border border-slate-300 text-navy text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="text-center px-3 py-2 rounded-lg bg-accent text-white text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
