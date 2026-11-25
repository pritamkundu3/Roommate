import React from 'react';
import { Link } from 'react-router-dom';
import {
  BadgePercent,
  ShieldCheck,
  Zap,
  Headphones,
  ArrowRight,
  Tag,
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import SmartImage from '../components/SmartImage';
import { HOTELS, getDestinationsWithCounts } from '../data/hotels';

const BENEFITS = [
  {
    icon: BadgePercent,
    title: 'Best Price Guarantee',
    description:
      'Transparent upfront pricing with zero hidden fees and instant member deals.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Hotels',
    description:
      'Every property passes a 30-point hygiene, Wi-Fi, and comfort inspection.',
  },
  {
    icon: Zap,
    title: 'Easy Booking',
    description:
      'Reserve your room in under 60 seconds with instant booking confirmation.',
  },
  {
    icon: Headphones,
    title: '24/7 Customer Support',
    description:
      'Round-the-clock human assistance for check-in help, changes, or cancellations.',
  },
];

export default function Home() {
  const destinations = getDestinationsWithCounts();
  const featuredHotels = HOTELS.filter((h) => h.featured).slice(0, 6);

  return (
    <div>
      {/* Compact Hero Section */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury modern hotel lobby"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-2xl mb-6">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-accent text-xs font-semibold backdrop-blur-xs mb-3 border border-white/15">
              <Tag className="w-3.5 h-3.5" />
              Save up to 25% with code WEEKEND25
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-[42px] text-white tracking-tight leading-tight">
              Find Your Perfect Stay.
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-200">
              Discover comfortable stays at the best prices.
            </p>
          </div>

          <SearchBar variant="hero" />
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-navy">
              Popular Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Explore curated Room-mate stays across India’s favourite cities
            </p>
          </div>
          <Link
            to="/hotels"
            className="text-xs sm:text-sm font-semibold text-accent hover:text-accent-hover inline-flex items-center gap-1"
          >
            Explore all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {destinations.map((dest) => (
            <Link
              key={dest.name}
              to={`/hotels?city=${encodeURIComponent(dest.name)}`}
              className="group relative rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="h-32 sm:h-36 w-full relative overflow-hidden">
                <SmartImage
                  src={dest.image}
                  alt={dest.name}
                  fallbackLabel={dest.name}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-display font-semibold text-sm sm:text-base leading-tight">
                    {dest.name}
                  </h3>
                  <p className="text-[11px] text-slate-200 mt-0.5">
                    {dest.hotelCount} {dest.hotelCount === 1 ? 'Hotel' : 'Hotels'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-navy">
              Featured Stays
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Handpicked guest favourites with top ratings and instant confirmation
            </p>
          </div>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-navy hover:bg-navy-700 text-white text-xs font-semibold transition-colors shrink-0"
          >
            <span>View All Hotels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>

      {/* Why Choose Room-mate? */}
      <section className="bg-white border-y border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-navy">
                Why Choose Room-mate?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Designed around what travelers actually care about — comfort, clarity, and speed.
              </p>
            </div>
            <Link
              to="/about"
              className="text-xs sm:text-sm font-semibold text-navy hover:text-accent inline-flex items-center gap-1"
            >
              Learn more about us
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 hover:border-accent/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-navy text-white flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-sm text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compact Offers Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-xl bg-gradient-to-r from-navy to-navy-700 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
              Member Exclusive
            </span>
            <h3 className="font-display font-bold text-lg sm:text-xl mt-0.5">
              Unlock Flat 20% Off Your Next Stay
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
              Use code <span className="font-mono font-semibold text-white">WELCOME20</span> during checkout on any property.
            </p>
          </div>
          <Link
            to="/offers"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold transition-colors shrink-0"
          >
            View All Offers
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
