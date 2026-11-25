import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Clock, MapPin, ArrowRight } from 'lucide-react';
import SmartImage from '../components/SmartImage';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            About Room-mate
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy mt-1">
            Your stay, your way.
          </h1>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Room-mate was built on a simple promise: booking a clean, reliable, and
            thoughtfully designed hotel shouldn’t feel like a gamble. Whether it’s a quick
            work trip in Bangalore, a heritage weekend in Kolkata or Jaipur, or a coastal
            escape in Goa, every Room-mate property delivers predictable quality at honest
            prices.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/hotels"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold"
            >
              Explore Stays
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/offers"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 text-navy text-xs sm:text-sm font-semibold hover:bg-slate-50"
            >
              View Current Offers
            </Link>
          </div>
        </div>

        <SmartImage
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80"
          alt="Room-mate hospitality lounge"
          fallbackLabel="Room-mate Hospitality"
          className="h-64 lg:h-auto w-full"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '6 Cities', label: 'Across major hubs' },
          { value: '18+ Stays', label: 'Verified & audited' },
          { value: '4.7 / 5', label: 'Average guest rating' },
          { value: '24/7', label: 'Live concierge support' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-xs"
          >
            <p className="font-display font-bold text-xl sm:text-2xl text-navy">
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Standards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            icon: ShieldCheck,
            title: '30-Point Quality Check',
            text: 'Fresh linens, verified Wi-Fi speeds, spotless washrooms, and zero surprise fees.',
          },
          {
            icon: Clock,
            title: 'Flexible Check-in & Cancellation',
            text: 'Easy 24-hour free cancellation on standard bookings and instant digital receipts.',
          },
          {
            icon: MapPin,
            title: 'Prime Neighborhoods',
            text: 'Handpicked locations near metro stations, airports, business hubs, and beaches.',
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-navy text-accent flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="font-display font-semibold text-base text-navy">
                {card.title}
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{card.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
