import React from 'react';
import { Calendar, Users, BedDouble, MapPin, ShieldCheck } from 'lucide-react';
import { calculateNights } from '../context/BookingContext';
import SmartImage from './SmartImage';

export default function BookingSummary({
  hotelName,
  hotelImage,
  locality,
  roomName,
  checkIn,
  checkOut,
  guests,
  pricePerNight,
  promoDiscount = 0,
  promoCode = '',
}) {
  const nights = calculateNights(checkIn, checkOut);
  const subtotal = pricePerNight * nights;
  const taxes = Math.round(subtotal * 0.12);
  const effectiveDiscount = Math.min(promoDiscount, subtotal);
  const totalAmount = Math.max(0, subtotal + taxes - effectiveDiscount);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-4">
      <h3 className="font-display font-semibold text-base text-navy">Booking Summary</h3>

      {/* Hotel Header */}
      <div className="flex gap-3 pb-4 border-b border-slate-100">
        <SmartImage
          src={hotelImage}
          alt={hotelName}
          fallbackLabel={hotelName}
          className="w-20 h-16 rounded-lg shrink-0"
        />
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-navy line-clamp-1">{hotelName}</h4>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 line-clamp-1">
            <MapPin className="w-3 h-3 text-accent shrink-0" />
            {locality}
          </p>
          <p className="text-xs font-medium text-slate-700 flex items-center gap-1 mt-1">
            <BedDouble className="w-3.5 h-3.5 text-navy shrink-0" />
            {roomName}
          </p>
        </div>
      </div>

      {/* Stay Details */}
      <div className="grid grid-cols-2 gap-2.5 text-xs bg-slate-50 rounded-lg p-3 border border-slate-100">
        <div>
          <span className="text-slate-500 block">Check-in</span>
          <span className="font-semibold text-navy flex items-center gap-1 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            {checkIn}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Check-out</span>
          <span className="font-semibold text-navy flex items-center gap-1 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            {checkOut}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Duration</span>
          <span className="font-semibold text-navy">
            {nights} {nights === 1 ? 'Night' : 'Nights'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Guests</span>
          <span className="font-semibold text-navy flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {guests} {guests === 1 ? 'Guest' : 'Guests'}
          </span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>
            ₹{pricePerNight.toLocaleString('en-IN')} × {nights}{' '}
            {nights === 1 ? 'night' : 'nights'}
          </span>
          <span className="font-medium text-slate-800">
            ₹{subtotal.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Taxes & service fees (12%)</span>
          <span className="font-medium text-slate-800">
            ₹{taxes.toLocaleString('en-IN')}
          </span>
        </div>

        {effectiveDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Promo ({promoCode})</span>
            <span>- ₹{effectiveDiscount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
          <span className="font-display font-semibold text-navy">Total Amount</span>
          <span className="text-xl font-bold text-navy">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-emerald-50/70 border border-emerald-100 rounded-lg px-3 py-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Free cancellation up to 24 hours before check-in. No hidden fees.</span>
      </div>
    </div>
  );
}
