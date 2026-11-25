import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { DESTINATION_META } from '../data/hotels';

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function SearchBar({ variant = 'hero', onSearch }) {
  const { searchParams, updateSearch } = useBooking();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [city, setCity] = useState(searchParams.city || '');
  const [checkIn, setCheckIn] = useState(searchParams.checkIn || addDays(today, 1));
  const [checkOut, setCheckOut] = useState(searchParams.checkOut || addDays(today, 3));
  const [guests, setGuests] = useState(searchParams.guests || 2);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setCity(searchParams.city || '');
    if (searchParams.checkIn) setCheckIn(searchParams.checkIn);
    if (searchParams.checkOut) setCheckOut(searchParams.checkOut);
    if (searchParams.guests) setGuests(searchParams.guests);
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = DESTINATION_META.filter((d) =>
    d.name.toLowerCase().includes(city.trim().toLowerCase())
  );

  const handleCheckInChange = (val) => {
    setCheckIn(val);
    if (checkOut <= val) {
      setCheckOut(addDays(val, 1));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    const cleanCity = city.trim();
    updateSearch({ city: cleanCity, checkIn, checkOut, guests: Number(guests) });
    if (onSearch) {
      onSearch({ city: cleanCity, checkIn, checkOut, guests: Number(guests) });
    } else {
      const qs = cleanCity ? `?city=${encodeURIComponent(cleanCity)}` : '';
      navigate(`/hotels${qs}`);
    }
  };

  const isHero = variant === 'hero';

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-xl shadow-lg border border-slate-200/80 ${
        isHero ? 'p-2.5 sm:p-3' : 'p-2.5'
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
        {/* Destination */}
        <div ref={wrapperRef} className="relative lg:col-span-4">
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 px-3 pt-1">
            Destination / City
          </label>
          <div className="flex items-center px-3 pb-1.5">
            <MapPin className="w-4 h-4 text-accent shrink-0 mr-2" />
            <input
              type="text"
              value={city}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setCity(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Where are you going? (e.g. Goa)"
              className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>

          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 max-h-56 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  setCity('');
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>All Destinations</span>
                <span className="text-[11px] text-slate-400">6 cities</span>
              </button>
              {filteredCities.map((dest) => (
                <button
                  key={dest.name}
                  type="button"
                  onClick={() => {
                    setCity(dest.name);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium text-navy">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    {dest.name}
                  </span>
                  <span className="text-xs text-slate-400">{dest.subtitle.split('&')[0]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Check-in */}
        <div className="lg:col-span-2 border-t sm:border-t-0 sm:border-l border-slate-200">
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 px-3 pt-1">
            Check-in
          </label>
          <div className="flex items-center px-3 pb-1.5">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0 mr-1.5" />
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="w-full text-sm font-medium text-slate-900 focus:outline-none bg-transparent"
              required
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="lg:col-span-2 border-t lg:border-t-0 sm:border-l border-slate-200">
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 px-3 pt-1">
            Check-out
          </label>
          <div className="flex items-center px-3 pb-1.5">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0 mr-1.5" />
            <input
              type="date"
              min={addDays(checkIn, 1)}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full text-sm font-medium text-slate-900 focus:outline-none bg-transparent"
              required
            />
          </div>
        </div>

        {/* Guests */}
        <div className="lg:col-span-2 border-t sm:border-t-0 sm:border-l border-slate-200">
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 px-3 pt-1">
            Guests
          </label>
          <div className="flex items-center px-3 pb-1.5">
            <Users className="w-4 h-4 text-slate-400 shrink-0 mr-1.5" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full text-sm font-medium text-slate-900 focus:outline-none bg-transparent cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="sm:col-span-2 lg:col-span-2">
          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search Hotels</span>
          </button>
        </div>
      </div>
    </form>
  );
}
