import React from 'react';
import { Star, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { AMENITIES_LIST, DESTINATION_META } from '../data/hotels';

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  mobileOpen,
  onCloseMobile,
  activeCount,
}) {
  const toggleStar = (star) => {
    const exists = filters.stars.includes(star);
    const next = exists
      ? filters.stars.filter((s) => s !== star)
      : [...filters.stars, star];
    onChange({ stars: next });
  };

  const toggleAmenity = (amenity) => {
    const exists = filters.amenities.includes(amenity);
    const next = exists
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ amenities: next });
  };

  const content = (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-navy" />
          <h2 className="font-display font-semibold text-sm text-navy">
            Filters {activeCount > 0 && `(${activeCount})`}
          </h2>
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* City Quick Filter */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
          City
        </h3>
        <select
          value={filters.city}
          onChange={(e) => onChange({ city: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy/20"
        >
          <option value="">All Cities</option>
          {DESTINATION_META.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Max Price / Night
          </h3>
          <span className="text-xs font-bold text-navy">
            ₹{filters.maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min={1500}
          max={7000}
          step={250}
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-orange-500 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>₹1,500</span>
          <span>₹4,000</span>
          <span>₹7,000+</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 mt-2.5">
          {[2500, 4000, 7000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange({ maxPrice: preset })}
              className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                filters.maxPrice === preset
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {preset === 7000 ? 'All' : `≤ ₹${preset}`}
            </button>
          ))}
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
          Star Rating
        </h3>
        <div className="space-y-1.5">
          {[5, 4, 3].map((star) => {
            const checked = filters.stars.includes(star);
            return (
              <label
                key={star}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-sm"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleStar(star)}
                    className="rounded border-slate-300 text-accent focus:ring-accent"
                  />
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: star }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </span>
                </span>
                <span className="text-xs text-slate-500">{star} Star</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
          Amenities
        </h3>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {AMENITIES_LIST.map((amenity) => {
            const checked = filters.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(amenity)}
                  className="rounded border-slate-300 text-accent focus:ring-accent"
                />
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 bg-white rounded-xl border border-slate-200/90 shadow-sm p-4">
          {content}
        </div>
      </aside>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-80 max-w-[85vw] bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-bold text-navy">Filter Stays</span>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>
            <button
              type="button"
              onClick={onCloseMobile}
              className="mt-6 w-full py-2.5 rounded-lg bg-navy text-white text-sm font-semibold"
            >
              Show Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}
