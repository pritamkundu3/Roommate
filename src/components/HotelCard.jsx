import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Coffee, Car, Waves, ArrowRight } from 'lucide-react';
import SmartImage from './SmartImage';

function getAmenityIcon(amenity) {
  if (amenity.includes('Wi-Fi')) return <Wifi className="w-3 h-3" />;
  if (amenity.includes('Breakfast')) return <Coffee className="w-3 h-3" />;
  if (amenity.includes('Parking')) return <Car className="w-3 h-3" />;
  if (amenity.includes('Pool')) return <Waves className="w-3 h-3" />;
  return null;
}

export default function HotelCard({ hotel, layout = 'grid' }) {
  const isRow = layout === 'row';

  return (
    <div
      className={`group bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex ${
        isRow ? 'flex-col sm:flex-row' : 'flex-col'
      }`}
    >
      {/* Image */}
      <Link
        to={`/hotels/${hotel.id}`}
        className={`relative block overflow-hidden shrink-0 ${
          isRow ? 'h-48 sm:h-auto sm:w-64 md:w-72' : 'h-44 w-full'
        }`}
      >
        <SmartImage
          src={hotel.images[0]}
          alt={hotel.name}
          fallbackLabel={hotel.name}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {hotel.discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-accent text-white text-[11px] font-bold shadow-sm">
            {hotel.discountPercent}% OFF
          </span>
        )}
        {hotel.tag && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-navy/90 text-white text-[11px] font-medium backdrop-blur-sm">
            {hotel.tag}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
        <div>
          {/* Top Rating & Stars */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-0.5" aria-label={`${hotel.starRating} star hotel`}>
              {Array.from({ length: hotel.starRating }).map((_, idx) => (
                <Star
                  key={idx}
                  className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                />
              ))}
              <span className="ml-1 text-[11px] font-medium text-slate-500">
                {hotel.starRating}-Star
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-xs font-semibold">
                {hotel.guestRating.toFixed(1)}
                <Star className="w-3 h-3 fill-white" />
              </span>
              <span className="text-[11px] text-slate-500">({hotel.reviewCount})</span>
            </div>
          </div>

          {/* Hotel Name */}
          <Link to={`/hotels/${hotel.id}`} className="block">
            <h3 className="font-display font-semibold text-base text-navy group-hover:text-accent transition-colors line-clamp-1">
              {hotel.name}
            </h3>
          </Link>

          {/* Location */}
          <p className="mt-0.5 text-xs text-slate-500 flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{hotel.locality}</span>
          </p>

          {isRow && (
            <p className="mt-2 text-xs text-slate-600 line-clamp-2 hidden sm:block">
              {hotel.description}
            </p>
          )}

          {/* Amenities */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, isRow ? 4 : 3).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
              >
                {getAmenityIcon(amenity)}
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-navy">
                ₹{hotel.pricePerNight.toLocaleString('en-IN')}
              </span>
              {hotel.originalPrice > hotel.pricePerNight && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{hotel.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="block text-[11px] text-slate-500">per night + taxes</span>
          </div>

          <Link
            to={`/hotels/${hotel.id}`}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-navy hover:bg-navy-700 text-white text-xs font-semibold transition-colors shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
