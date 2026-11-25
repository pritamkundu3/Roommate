import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, SearchX, X, LayoutGrid, List } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import HotelCard from '../components/HotelCard';
import { HOTELS } from '../data/hotels';
import { useBooking } from '../context/BookingContext';

const INITIAL_FILTERS = {
  city: '',
  maxPrice: 7000,
  stars: [],
  amenities: [],
};

function HotelSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded w-20" />
          <div className="h-8 bg-slate-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export default function Hotels() {
  const [urlParams, setUrlParams] = useSearchParams();
  const { updateSearch } = useBooking();

  const initialCity = urlParams.get('city') || '';

  const [filters, setFilters] = useState({
    ...INITIAL_FILTERS,
    city: initialCity,
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync URL ?city= param into filters & context
  useEffect(() => {
    const cityFromUrl = urlParams.get('city') || '';
    setFilters((prev) => (prev.city === cityFromUrl ? prev : { ...prev, city: cityFromUrl }));
    updateSearch({ city: cityFromUrl });
  }, [urlParams]);

  const triggerBriefLoader = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 180);
  };

  const handleFilterChange = (patch) => {
    triggerBriefLoader();
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      if ('city' in patch) {
        if (patch.city) {
          setUrlParams({ city: patch.city });
        } else {
          setUrlParams({});
        }
        updateSearch({ city: patch.city });
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    triggerBriefLoader();
    setFilters(INITIAL_FILTERS);
    setUrlParams({});
    updateSearch({ city: '' });
  };

  const handleSearchBarSubmit = ({ city }) => {
    triggerBriefLoader();
    setFilters((prev) => ({ ...prev, city }));
    if (city) {
      setUrlParams({ city });
    } else {
      setUrlParams({});
    }
  };

  const filteredHotels = useMemo(() => {
    const queryCity = filters.city.trim().toLowerCase();

    const matched = HOTELS.filter((hotel) => {
      if (queryCity) {
        const inCity = hotel.city.toLowerCase().includes(queryCity);
        const inLocality = hotel.locality.toLowerCase().includes(queryCity);
        const inName = hotel.name.toLowerCase().includes(queryCity);
        if (!inCity && !inLocality && !inName) return false;
      }

      if (filters.maxPrice < 7000 && hotel.pricePerNight > filters.maxPrice) {
        return false;
      }

      if (filters.stars.length > 0 && !filters.stars.includes(hotel.starRating)) {
        return false;
      }

      if (
        filters.amenities.length > 0 &&
        !filters.amenities.every((a) => hotel.amenities.includes(a))
      ) {
        return false;
      }

      return true;
    });

    const sorted = [...matched];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === 'rating-desc') {
      sorted.sort((a, b) => b.guestRating - a.guestRating);
    } else {
      sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.guestRating - a.guestRating);
    }

    return sorted;
  }, [filters, sortBy]);

  const activeFilterCount =
    (filters.city ? 1 : 0) +
    (filters.maxPrice < 7000 ? 1 : 0) +
    filters.stars.length +
    filters.amenities.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Compact Search Bar */}
      <div className="mb-6">
        <SearchBar variant="compact" onSearch={handleSearchBarSubmit} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar (Desktop + Mobile Drawer) */}
        <FilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          mobileOpen={mobileFiltersOpen}
          onCloseMobile={() => setMobileFiltersOpen(false)}
          activeCount={activeFilterCount}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Results & Sort Bar */}
          <div className="bg-white rounded-xl border border-slate-200/90 px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div>
              <h1 className="font-display font-bold text-base sm:text-lg text-navy">
                {filters.city ? `Stays in ${filters.city}` : 'All Verified Stays'}
              </h1>
              <p className="text-xs text-slate-500">
                Showing {filteredHotels.length}{' '}
                {filteredHotels.length === 1 ? 'property' : 'properties'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile Filter Trigger */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-navy hover:bg-slate-50"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-accent text-white text-[10px]">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <select
                  aria-label="Sort hotels"
                  value={sortBy}
                  onChange={(e) => {
                    triggerBriefLoader();
                    setSortBy(e.target.value);
                  }}
                  className="text-xs font-medium text-navy bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Guest Rating: High to Low</option>
                </select>
              </div>

              {/* View Toggle (Desktop) */}
              <div className="hidden sm:flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`p-1.5 ${
                    viewMode === 'grid'
                      ? 'bg-navy text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('row')}
                  aria-label="List view"
                  className={`p-1.5 ${
                    viewMode === 'row'
                      ? 'bg-navy text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {filters.city && (
                <button
                  type="button"
                  onClick={() => handleFilterChange({ city: '' })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy/10 text-navy text-xs font-medium hover:bg-navy/15"
                >
                  City: {filters.city}
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.maxPrice < 7000 && (
                <button
                  type="button"
                  onClick={() => handleFilterChange({ maxPrice: 7000 })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy/10 text-navy text-xs font-medium hover:bg-navy/15"
                >
                  Max ₹{filters.maxPrice}
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.stars.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    handleFilterChange({
                      stars: filters.stars.filter((s) => s !== star),
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy/10 text-navy text-xs font-medium hover:bg-navy/15"
                >
                  {star} Star
                  <X className="w-3 h-3" />
                </button>
              ))}
              {filters.amenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() =>
                    handleFilterChange({
                      amenities: filters.amenities.filter((a) => a !== amenity),
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy/10 text-navy text-xs font-medium hover:bg-navy/15"
                >
                  {amenity}
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}

          {/* Hotel Grid / List / Loading / Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <HotelSkeleton key={i} />
              ))}
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <SearchX className="w-6 h-6" />
              </div>
              <h2 className="font-display font-semibold text-lg text-navy">
                No hotels match your criteria
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Try increasing your budget range, removing a few amenity filters, or searching another city.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'row'
                  ? 'flex flex-col gap-4'
                  : 'grid grid-cols-1 sm:grid-cols-2 gap-5'
              }
            >
              {filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  layout={viewMode === 'row' ? 'row' : 'grid'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
