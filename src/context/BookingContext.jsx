import React, { createContext, useContext, useEffect, useState } from 'react';

const BookingContext = createContext(null);

const STORAGE_KEYS = {
  USER: 'roommate_user',
  BOOKINGS: 'roommate_bookings',
  SEARCH: 'roommate_search',
  DRAFT: 'roommate_booking_draft',
};

function formatDateOffset(daysFromToday) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split('T')[0];
}

const DEFAULT_SEARCH = {
  city: '',
  checkIn: formatDateOffset(2),
  checkOut: formatDateOffset(4),
  guests: 2,
};

const SEED_BOOKINGS = [
  {
    bookingId: 'RM-842910',
    hotelId: 'rm-kol-parkstreet',
    hotelName: 'Room-mate Townhouse Park Street',
    hotelImage:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    locality: 'Park Street, Kolkata',
    roomId: 'deluxe',
    roomName: 'Deluxe King Room',
    checkIn: formatDateOffset(14),
    checkOut: formatDateOffset(16),
    nights: 2,
    guests: 2,
    pricePerNight: 3299,
    subtotal: 6598,
    taxes: 792,
    discount: 0,
    totalAmount: 7390,
    guestName: 'Aarav Sharma',
    guestEmail: 'aarav@roommate.demo',
    guestPhone: '+91 98765 43210',
    paymentMethod: 'Pay at Hotel',
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
  },
  {
    bookingId: 'RM-619304',
    hotelId: 'rm-goa-calangute',
    hotelName: 'Room-mate Palms Calangute',
    hotelImage:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
    locality: 'Calangute, North Goa',
    roomId: 'classic',
    roomName: 'Classic Room',
    checkIn: formatDateOffset(-25),
    checkOut: formatDateOffset(-22),
    nights: 3,
    guests: 2,
    pricePerNight: 3299,
    subtotal: 9897,
    taxes: 1188,
    discount: 1000,
    totalAmount: 10085,
    guestName: 'Aarav Sharma',
    guestEmail: 'aarav@roommate.demo',
    guestPhone: '+91 98765 43210',
    paymentMethod: 'UPI (Demo)',
    status: 'Completed',
    createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
  },
];

function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

export function BookingProvider({ children }) {
  const [user, setUser] = useState(() => safeParse(STORAGE_KEYS.USER, null));
  const [bookings, setBookings] = useState(() => {
    const stored = safeParse(STORAGE_KEYS.BOOKINGS, null);
    if (stored && Array.isArray(stored)) return stored;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
    return SEED_BOOKINGS;
  });
  const [searchParams, setSearchParams] = useState(() =>
    safeParse(STORAGE_KEYS.SEARCH, DEFAULT_SEARCH)
  );
  const [bookingDraft, setBookingDraft] = useState(() =>
    safeParse(STORAGE_KEYS.DRAFT, null)
  );

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {
      // ignore storage errors
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch {
      // ignore storage errors
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH, JSON.stringify(searchParams));
    } catch {
      // ignore storage errors
    }
  }, [searchParams]);

  useEffect(() => {
    try {
      if (bookingDraft) {
        localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(bookingDraft));
      } else {
        localStorage.removeItem(STORAGE_KEYS.DRAFT);
      }
    } catch {
      // ignore storage errors
    }
  }, [bookingDraft]);

  const updateSearch = (updates) => {
    setSearchParams((prev) => ({ ...prev, ...updates }));
  };

  const login = ({ email, name }) => {
    const profile = {
      name: name || email.split('@')[0].replace(/[._-]/g, ' '),
      email,
      phone: '+91 98765 43210',
      city: 'Kolkata',
      memberSince: 'Nov 2026',
    };
    setUser(profile);
    return profile;
  };

  const signup = ({ name, email }) => {
    const profile = {
      name: name.trim(),
      email: email.trim(),
      phone: '',
      city: '',
      memberSince: 'Nov 2026',
    };
    setUser(profile);
    return profile;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const startBookingDraft = ({ hotel, room, checkIn, checkOut, guests }) => {
    const draft = {
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.images[0],
      locality: hotel.locality,
      starRating: hotel.starRating,
      guestRating: hotel.guestRating,
      roomId: room.id,
      roomName: room.name,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
      checkIn: checkIn || searchParams.checkIn,
      checkOut: checkOut || searchParams.checkOut,
      guests: guests || searchParams.guests || 2,
    };
    setBookingDraft(draft);
    return draft;
  };

  const confirmBooking = ({
    draft,
    guestName,
    guestEmail,
    guestPhone,
    guests,
    specialRequests,
    paymentMethod,
    promoDiscount = 0,
    promoCode = '',
  }) => {
    const nights = calculateNights(draft.checkIn, draft.checkOut);
    const subtotal = draft.pricePerNight * nights;
    const taxes = Math.round(subtotal * 0.12);
    const discount = Math.min(promoDiscount, subtotal);
    const totalAmount = Math.max(0, subtotal + taxes - discount);
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `RM-${randomCode}`;

    const newBooking = {
      bookingId,
      hotelId: draft.hotelId,
      hotelName: draft.hotelName,
      hotelImage: draft.hotelImage,
      locality: draft.locality,
      roomId: draft.roomId,
      roomName: draft.roomName,
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      nights,
      guests: Number(guests),
      pricePerNight: draft.pricePerNight,
      subtotal,
      taxes,
      discount,
      promoCode,
      totalAmount,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests: specialRequests || '',
      paymentMethod,
      status: 'Upcoming',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setBookingDraft(null);
    return newBooking;
  };

  const cancelBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId ? { ...b, status: 'Cancelled' } : b
      )
    );
  };

  return (
    <BookingContext.Provider
      value={{
        user,
        bookings,
        searchParams,
        bookingDraft,
        updateSearch,
        login,
        signup,
        logout,
        updateProfile,
        startBookingDraft,
        setBookingDraft,
        confirmBooking,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return ctx;
}
