import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Star,
  MapPin,
  Check,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Navigation,
  ShieldCheck,
  BedDouble,
  ArrowLeft,
} from 'lucide-react';
import { HOTELS } from '../data/hotels';
import { useBooking, calculateNights } from '../context/BookingContext';
import SmartImage from '../components/SmartImage';
import BookingSummary from '../components/BookingSummary';

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { searchParams, updateSearch, startBookingDraft } = useBooking();

  const hotel = useMemo(() => HOTELS.find((h) => h.id === id), [id]);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState(hotel?.rooms[0]?.id || 'classic');

  const today = new Date().toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(searchParams.checkIn || addDays(today, 2));
  const [checkOut, setCheckOut] = useState(searchParams.checkOut || addDays(today, 4));
  const [guests, setGuests] = useState(searchParams.guests || 2);

  if (!hotel) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-bold text-2xl text-navy">Hotel not found</h1>
        <p className="text-sm text-slate-500 mt-2">
          The property you are looking for may have been moved or is unavailable.
        </p>
        <Link
          to="/hotels"
          className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hotels
        </Link>
      </div>
    );
  }

  const selectedRoom =
    hotel.rooms.find((r) => r.id === selectedRoomId) || hotel.rooms[0];

  const handleCheckInChange = (val) => {
    setCheckIn(val);
    if (checkOut <= val) {
      setCheckOut(addDays(val, 1));
    }
  };

  const handleBookNow = () => {
    updateSearch({ checkIn, checkOut, guests: Number(guests) });
    startBookingDraft({
      hotel,
      room: selectedRoom,
      checkIn,
      checkOut,
      guests: Number(guests),
    });
    navigate('/booking');
  };

  const nextImage = () =>
    setActiveImage((prev) => (prev + 1) % hotel.images.length);
  const prevImage = () =>
    setActiveImage((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-navy">
          Home
        </Link>
        <span>/</span>
        <Link to={`/hotels?city=${encodeURIComponent(hotel.city)}`} className="hover:text-navy">
          {hotel.city}
        </Link>
        <span>/</span>
        <span className="text-navy font-medium truncate">{hotel.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-0.5">
              {Array.from({ length: hotel.starRating }).map((_, idx) => (
                <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </span>
            {hotel.tag && (
              <span className="px-2 py-0.5 rounded bg-accent-light text-accent text-[11px] font-semibold">
                {hotel.tag}
              </span>
            )}
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy">
            {hotel.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-accent shrink-0" />
            {hotel.address}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-xs">
          <div className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold text-sm flex items-center gap-1">
            {hotel.guestRating.toFixed(1)}
            <Star className="w-3.5 h-3.5 fill-white" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-navy">Excellent</p>
            <p className="text-slate-500">{hotel.reviewCount} verified reviews</p>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-7">
        <div className="md:col-span-3 relative rounded-xl overflow-hidden h-64 sm:h-80 md:h-96 bg-slate-200">
          <SmartImage
            src={hotel.images[activeImage]}
            alt={`${hotel.name} view ${activeImage + 1}`}
            fallbackLabel={hotel.name}
            className="w-full h-full"
          />
          <button
            type="button"
            onClick={prevImage}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-navy shadow flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={nextImage}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-navy shadow flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-navy/80 text-white text-xs font-medium">
            {activeImage + 1} / {hotel.images.length}
          </span>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-1 gap-2.5">
          {hotel.images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(idx)}
              className={`relative rounded-lg overflow-hidden h-16 md:h-[88px] border-2 transition-all ${
                activeImage === idx
                  ? 'border-accent ring-2 ring-accent/30'
                  : 'border-transparent opacity-80 hover:opacity-100'
              }`}
            >
              <SmartImage
                src={img}
                alt={`${hotel.name} thumbnail ${idx + 1}`}
                fallbackLabel={`Photo ${idx + 1}`}
                className="w-full h-full"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Details + Sticky Booking Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-start">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview & Description */}
          <section className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <h2 className="font-display font-semibold text-lg text-navy mb-2">
              About This Stay
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{hotel.description}</p>

            {/* Amenities */}
            <h3 className="font-display font-semibold text-sm text-navy mt-5 mb-3">
              Amenities & Facilities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {hotel.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Choose Your Room */}
          <section id="rooms" className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <h2 className="font-display font-semibold text-lg text-navy mb-1">
              Available Room Types
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Select a room category to update your booking summary
            </p>

            <div className="space-y-3.5">
              {hotel.rooms.map((room) => {
                const isSelected = selectedRoom.id === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`rounded-xl border p-3.5 flex flex-col sm:flex-row gap-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-accent bg-accent-light/40 ring-1 ring-accent'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <SmartImage
                      src={room.image}
                      alt={room.name}
                      fallbackLabel={room.name}
                      className="w-full sm:w-40 h-32 sm:h-28 rounded-lg shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display font-semibold text-base text-navy">
                              {room.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                              <span className="inline-flex items-center gap-1">
                                <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                                {room.bedType}
                              </span>
                              <span>{room.size}</span>
                              <span className="inline-flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                Max {room.maxGuests}
                              </span>
                            </p>
                          </div>
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {room.availableCount} left
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {room.amenities.map((a) => (
                            <span
                              key={a}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-navy">
                            ₹{room.pricePerNight.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-500"> / night</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoomId(room.id);
                          }}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isSelected
                              ? 'bg-accent text-white'
                              : 'bg-navy text-white hover:bg-navy-700'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select Room'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Check-in & Policies */}
          <section className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <h2 className="font-display font-semibold text-lg text-navy mb-3">
              Check-in & House Policies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Clock className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Check-in Time</span>
                  <span className="text-sm font-semibold text-navy">{hotel.checkInTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Clock className="w-5 h-5 text-navy shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Check-out Time</span>
                  <span className="text-sm font-semibold text-navy">{hotel.checkOutTime}</span>
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {hotel.policies.map((policy, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{policy}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Map & Location */}
          <section className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-lg text-navy">
                Location & Nearby Landmarks
              </h2>
              <a
                href={`https://www.openstreetmap.org/?mlat=${hotel.coordinates.lat}&mlon=${hotel.coordinates.lng}#map=15/${hotel.coordinates.lat}/${hotel.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover"
              >
                <Navigation className="w-3.5 h-3.5" />
                Open in Maps
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Clean Interactive Map Preview Card */}
              <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(#172554 1px, transparent 1px), radial-gradient(#172554 1px, #f8fafc 1px)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px',
                  }}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-md mb-2">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="font-display font-semibold text-sm text-navy">
                    {hotel.locality}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {hotel.coordinates.lat.toFixed(4)}° N, {hotel.coordinates.lng.toFixed(4)}° E
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {hotel.nearbyLandmarks.map((lm) => (
                  <div
                    key={lm.name}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                  >
                    <span className="font-medium text-navy">{lm.name}</span>
                    <span className="font-semibold text-accent">{lm.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Guest Reviews */}
          <section className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="font-display font-semibold text-lg text-navy">
                  Guest Reviews
                </h2>
                <p className="text-xs text-slate-500">
                  Rated {hotel.guestRating}/5 across {hotel.reviewCount} verified stays
                </p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                96% Guests Recommend
              </span>
            </div>

            <div className="space-y-3">
              {hotel.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-navy text-white text-xs font-semibold flex items-center justify-center">
                        {rev.author.charAt(0)}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-navy">{rev.author}</p>
                        <p className="text-[11px] text-slate-400">
                          {rev.stayType} • {rev.date}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white text-xs font-semibold">
                      {rev.rating.toFixed(1)}
                      <Star className="w-3 h-3 fill-white" />
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-2">{rev.title}</p>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sticky Booking Sidebar */}
        <div className="lg:sticky lg:top-20 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 space-y-3">
            <h3 className="font-display font-semibold text-sm text-navy">
              Adjust Stay Dates & Guests
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Check-in
                </label>
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => handleCheckInChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Check-out
                </label>
                <input
                  type="date"
                  min={addDays(checkIn, 1)}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Guests ({calculateNights(checkIn, checkOut)}{' '}
                {calculateNights(checkIn, checkOut) === 1 ? 'night' : 'nights'})
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
              >
                {Array.from({ length: selectedRoom.maxGuests }).map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {idx + 1} {idx + 1 === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <BookingSummary
            hotelName={hotel.name}
            hotelImage={hotel.images[0]}
            locality={hotel.locality}
            roomName={selectedRoom.name}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={Math.min(guests, selectedRoom.maxGuests)}
            pricePerNight={selectedRoom.pricePerNight}
          />

          <button
            type="button"
            onClick={handleBookNow}
            className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-md transition-colors"
          >
            Book Now — Proceed to Guest Details
          </button>
        </div>
      </div>
    </div>
  );
}
