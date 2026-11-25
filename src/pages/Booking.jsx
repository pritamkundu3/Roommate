import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  CreditCard,
  Smartphone,
  Building,
  Tag,
  ArrowLeft,
  ArrowRight,
  Lock,
  BedDouble,
} from 'lucide-react';
import { useBooking, calculateNights } from '../context/BookingContext';
import { HOTELS, OFFERS } from '../data/hotels';
import BookingSummary from '../components/BookingSummary';

const STEPS = [
  { id: 1, label: 'Hotel & Room' },
  { id: 2, label: 'Guest Details' },
  { id: 3, label: 'Review & Pay' },
];

export default function Booking() {
  const navigate = useNavigate();
  const { user, bookingDraft, setBookingDraft, confirmBooking } = useBooking();

  const [step, setStep] = useState(bookingDraft ? 2 : 1);

  // Fallback hotel selector if user opened /booking directly without draft
  const [fallbackHotelId, setFallbackHotelId] = useState(HOTELS[0].id);
  const fallbackHotel = HOTELS.find((h) => h.id === fallbackHotelId) || HOTELS[0];

  const activeDraft = bookingDraft;

  // Step 2: Guest details
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [guests, setGuests] = useState(activeDraft?.guests || 2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [errors, setErrors] = useState({});

  // Step 3: Promo & mock payment
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pay at Hotel');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [submitting, setSubmitting] = useState(false);

  const handleSelectFallbackRoom = (room) => {
    const today = new Date();
    const ci = new Date(today);
    ci.setDate(ci.getDate() + 2);
    const co = new Date(today);
    co.setDate(co.getDate() + 4);

    setBookingDraft({
      hotelId: fallbackHotel.id,
      hotelName: fallbackHotel.name,
      hotelImage: fallbackHotel.images[0],
      locality: fallbackHotel.locality,
      starRating: fallbackHotel.starRating,
      guestRating: fallbackHotel.guestRating,
      roomId: room.id,
      roomName: room.name,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
      checkIn: ci.toISOString().split('T')[0],
      checkOut: co.toISOString().split('T')[0],
      guests: 2,
    });
    setGuests(2);
    setStep(2);
  };

  const currentHotel = activeDraft
    ? HOTELS.find((h) => h.id === activeDraft.hotelId)
    : null;

  const handleRoomSwitch = (room) => {
    if (!activeDraft) return;
    setBookingDraft({
      ...activeDraft,
      roomId: room.id,
      roomName: room.name,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
    });
    if (guests > room.maxGuests) {
      setGuests(room.maxGuests);
    }
  };

  const validateGuestStep = () => {
    const nextErrors = {};
    if (!guestName.trim() || guestName.trim().length < 2) {
      nextErrors.guestName = 'Please enter the primary guest’s full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())) {
      nextErrors.guestEmail = 'Please enter a valid email address.';
    }
    const digits = guestPhone.replace(/\D/g, '');
    if (digits.length < 10) {
      nextErrors.guestPhone = 'Please enter a valid 10-digit phone number.';
    }
    if (!guests || guests < 1) {
      nextErrors.guests = 'Select at least 1 guest.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNextToReview = (e) => {
    e.preventDefault();
    if (validateGuestStep()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const offer = OFFERS.find((o) => o.code === code);
    if (!offer) {
      setPromoError('Invalid promo code. Try WELCOME20, WEEKEND25, or STAYMORE15.');
      setAppliedPromo(null);
      return;
    }
    const nights = calculateNights(activeDraft.checkIn, activeDraft.checkOut);
    const subtotal = activeDraft.pricePerNight * nights;
    if (subtotal < offer.minAmount) {
      setPromoError(`Minimum booking subtotal of ₹${offer.minAmount} required for ${offer.code}.`);
      setAppliedPromo(null);
      return;
    }
    const rawDiscount = Math.round((subtotal * offer.discountPercent) / 100);
    const discountAmount = Math.min(rawDiscount, offer.maxDiscount);
    setAppliedPromo({ code: offer.code, discountAmount });
  };

  const handleConfirm = () => {
    if (!activeDraft) return;
    setSubmitting(true);
    setTimeout(() => {
      const created = confirmBooking({
        draft: activeDraft,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        guests,
        specialRequests: specialRequests.trim(),
        paymentMethod,
        promoDiscount: appliedPromo?.discountAmount || 0,
        promoCode: appliedPromo?.code || '',
      });
      setSubmitting(false);
      navigate(`/booking-confirmation/${created.bookingId}`);
    }, 450);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
      {/* Stepper */}
      <div className="bg-white rounded-xl border border-slate-200/90 px-4 py-3.5 mb-6 shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {STEPS.map((s, idx) => {
            const completed = step > s.id;
            const current = step === s.id;
            return (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                      completed
                        ? 'bg-emerald-600 text-white'
                        : current
                        ? 'bg-accent text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {completed ? <Check className="w-4 h-4" /> : s.id}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      current ? 'text-navy' : completed ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                      step > s.id ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step 1: Select Hotel & Room if no draft or editing Step 1 */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-xl text-navy">
                Step 1: Select Hotel & Room
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeDraft
                  ? `Currently selected: ${activeDraft.hotelName}`
                  : 'Choose a Room-mate hotel and room type to begin your reservation.'}
              </p>
            </div>
            {activeDraft && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-accent hover:underline"
              >
                Continue to Guest Details →
              </button>
            )}
          </div>

          {!activeDraft ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  Choose Property
                </label>
                <select
                  value={fallbackHotelId}
                  onChange={(e) => setFallbackHotelId(e.target.value)}
                  className="w-full sm:w-96 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
                >
                  {HOTELS.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} — {h.city} (from ₹{h.pricePerNight})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fallbackHotel.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-display font-semibold text-base text-navy">
                        {room.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {room.bedType} • {room.size} • Max {room.maxGuests} Guests
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-navy">
                        ₹{room.pricePerNight.toLocaleString('en-IN')}/night
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectFallbackRoom(room)}
                        className="px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentHotel?.rooms.map((room) => {
                  const selected = activeDraft.roomId === room.id;
                  return (
                    <div
                      key={room.id}
                      onClick={() => handleRoomSwitch(room)}
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        selected
                          ? 'border-accent bg-accent-light/40 ring-1 ring-accent'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-semibold text-sm text-navy">
                          {room.name}
                        </h3>
                        <BedDouble className="w-4 h-4 text-accent" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {room.bedType} • Max {room.maxGuests} Guests
                      </p>
                      <div className="mt-3 font-bold text-navy text-base">
                        ₹{room.pricePerNight.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-slate-500">/ night</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-semibold"
                >
                  Continue to Guest Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Steps 2 & 3 Layout with Booking Summary */}
      {step >= 2 && activeDraft && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            {step === 2 && (
              <form
                onSubmit={handleNextToReview}
                className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h1 className="font-display font-bold text-xl text-navy">
                      Guest Details
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Booking confirmation will be sent to this email & phone number
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-medium text-slate-500 hover:text-navy"
                  >
                    Change Room
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                        errors.guestName
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-slate-200 focus:ring-navy/20'
                      }`}
                    />
                    {errors.guestName && (
                      <p className="text-xs text-red-600 mt-1">{errors.guestName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                        errors.guestEmail
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-slate-200 focus:ring-navy/20'
                      }`}
                    />
                    {errors.guestEmail && (
                      <p className="text-xs text-red-600 mt-1">{errors.guestEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                        errors.guestPhone
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-slate-200 focus:ring-navy/20'
                      }`}
                    />
                    {errors.guestPhone && (
                      <p className="text-xs text-red-600 mt-1">{errors.guestPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">
                      Number of Guests *
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20 bg-white"
                    >
                      {Array.from({ length: activeDraft.maxGuests || 4 }).map((_, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          {idx + 1} {idx + 1 === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Early check-in, quiet high-floor room, extra pillows..."
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    to={`/hotels/${activeDraft.hotelId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-navy"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Hotel
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-sm transition-colors"
                  >
                    Continue to Review & Pay
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-5">
                {/* Guest Overview */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-display font-semibold text-base text-navy">
                      Confirm Guest Information
                    </h2>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-semibold text-accent hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-500 block">Primary Guest</span>
                      <span className="font-semibold text-navy">{guestName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Email</span>
                      <span className="font-semibold text-navy break-all">{guestEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Phone</span>
                      <span className="font-semibold text-navy">{guestPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
                  <h2 className="font-display font-semibold text-base text-navy mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-accent" />
                    Have a Promo Code?
                  </h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Try WELCOME20 or WEEKEND25"
                      className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-lg uppercase focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 rounded-lg bg-navy hover:bg-navy-700 text-white text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-red-600 mt-1.5">{promoError}</p>
                  )}
                  {appliedPromo && (
                    <div className="mt-2 flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                      <span>
                        Code <strong>{appliedPromo.code}</strong> applied — saving ₹
                        {appliedPromo.discountAmount.toLocaleString('en-IN')}!
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedPromo(null);
                          setPromoInput('');
                        }}
                        className="font-semibold underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Mock Payment */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display font-semibold text-base text-navy">
                      Payment Method (Demo)
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <Lock className="w-3 h-3" />
                      Mock Checkout
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'Pay at Hotel', icon: Building, sub: 'No prepayment needed' },
                      { id: 'UPI (Demo)', icon: Smartphone, sub: 'Instant mock UPI' },
                      { id: 'Card (Demo)', icon: CreditCard, sub: 'Test Visa / RuPay' },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const active = paymentMethod === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setPaymentMethod(opt.id)}
                          className={`text-left p-3 rounded-xl border transition-all ${
                            active
                              ? 'border-accent bg-accent-light/40 ring-1 ring-accent'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 mb-1.5 ${
                              active ? 'text-accent' : 'text-slate-500'
                            }`}
                          />
                          <p className="text-xs font-semibold text-navy">{opt.id}</p>
                          <p className="text-[11px] text-slate-500">{opt.sub}</p>
                        </button>
                      );
                    })}
                  </div>

                  {paymentMethod === 'Card (Demo)' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Test Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleConfirm}
                      className="flex-1 sm:flex-initial px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-colors"
                    >
                      {submitting ? 'Confirming Reservation...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Summary */}
          <div className="lg:sticky lg:top-20">
            <BookingSummary
              hotelName={activeDraft.hotelName}
              hotelImage={activeDraft.hotelImage}
              locality={activeDraft.locality}
              roomName={activeDraft.roomName}
              checkIn={activeDraft.checkIn}
              checkOut={activeDraft.checkOut}
              guests={guests}
              pricePerNight={activeDraft.pricePerNight}
              promoDiscount={appliedPromo?.discountAmount || 0}
              promoCode={appliedPromo?.code || ''}
            />
          </div>
        </div>
      )}
    </div>
  );
}
