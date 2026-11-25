import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  MapPin,
  BedDouble,
  Printer,
  ArrowRight,
  Home,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import SmartImage from '../components/SmartImage';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const { bookings } = useBooking();
  const [copied, setCopied] = useState(false);

  const booking = bookings.find((b) => b.bookingId === bookingId) || bookings[0];

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-bold text-2xl text-navy">
          Reservation Not Found
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          We couldn’t find that booking ID in your local history.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  const handleCopyId = () => {
    navigator.clipboard?.writeText(booking.bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Top Banner */}
        <div className="bg-navy text-white px-6 py-7 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Reservation Confirmed
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mt-1">
            Your Stay Is Booked!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            A confirmation copy has been saved for <strong>{booking.guestEmail}</strong>
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/15">
            <span className="text-xs text-slate-300">Booking ID:</span>
            <span className="font-mono font-bold text-sm tracking-wider text-white">
              {booking.bookingId}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="ml-1 p-1 rounded hover:bg-white/10 transition-colors"
              title="Copy Booking ID"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-200" />
              )}
            </button>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 pb-5 border-b border-slate-100">
            <SmartImage
              src={booking.hotelImage}
              alt={booking.hotelName}
              fallbackLabel={booking.hotelName}
              className="w-full sm:w-36 h-28 rounded-xl shrink-0"
            />
            <div className="flex-1">
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold mb-1">
                {booking.status}
              </span>
              <h2 className="font-display font-bold text-lg text-navy">
                {booking.hotelName}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                {booking.locality}
              </p>
              <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5 mt-2">
                <BedDouble className="w-4 h-4 text-navy" />
                {booking.roomName} • {booking.guests}{' '}
                {booking.guests === 1 ? 'Guest' : 'Guests'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-500 block">Check-in</span>
              <span className="font-semibold text-navy flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                {booking.checkIn}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Check-out</span>
              <span className="font-semibold text-navy flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                {booking.checkOut}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Duration</span>
              <span className="font-semibold text-navy mt-0.5 block">
                {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Payment</span>
              <span className="font-semibold text-navy mt-0.5 block">
                {booking.paymentMethod}
              </span>
            </div>
          </div>

          {/* Guest & Price Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <h3 className="font-display font-semibold text-sm text-navy mb-2">
                Guest Details
              </h3>
              <p>
                <span className="text-slate-500">Name:</span>{' '}
                <strong className="text-navy">{booking.guestName}</strong>
              </p>
              <p>
                <span className="text-slate-500">Email:</span>{' '}
                <strong className="text-navy">{booking.guestEmail}</strong>
              </p>
              <p>
                <span className="text-slate-500">Phone:</span>{' '}
                <strong className="text-navy">{booking.guestPhone}</strong>
              </p>
              {booking.specialRequests && (
                <p>
                  <span className="text-slate-500">Requests:</span>{' '}
                  <span className="text-slate-700">{booking.specialRequests}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <h3 className="font-display font-semibold text-sm text-navy mb-2">
                Payment Breakdown
              </h3>
              <div className="flex justify-between text-slate-600">
                <span>Room Tariff ({booking.nights} nights)</span>
                <span>₹{booking.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Fees</span>
                <span>₹{booking.taxes.toLocaleString('en-IN')}</span>
              </div>
              {booking.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>- ₹{booking.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-navy">
                <span>Total Amount</span>
                <span>₹{booking.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-navy hover:bg-slate-50"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
            <div className="flex items-center gap-2.5">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back to Home
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold"
              >
                View My Bookings
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
