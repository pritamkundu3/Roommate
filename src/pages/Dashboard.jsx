import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  BedDouble,
  Edit3,
  Check,
  X,
  User,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import SmartImage from '../components/SmartImage';

export default function Dashboard() {
  const { user, bookings, login, updateProfile, cancelBooking } = useBooking();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [editing, setEditing] = useState(false);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
  });

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-14 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-navy/10 text-navy flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-xl text-navy">
            Sign in to view your Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Access your profile, upcoming stays, and booking history in one place.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-navy text-white text-xs font-semibold"
            >
              Log In
            </Link>
            <button
              type="button"
              onClick={() => login({ email: 'aarav@roommate.demo', name: 'Aarav Sharma' })}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Try Demo Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter((b) => b.status === 'Upcoming');
  const pastBookings = bookings.filter((b) => b.status !== 'Upcoming');
  const displayed = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const startEdit = () => {
    setProfileForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      city: user.city || '',
    });
    setEditing(true);
  };

  const saveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;
    updateProfile({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
      city: profileForm.city.trim(),
    });
    setEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Card */}
        <aside className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex items-start justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-navy text-white font-display font-bold text-lg flex items-center justify-center uppercase shrink-0">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="font-display font-bold text-base text-navy">{user.name}</h1>
                <p className="text-xs text-slate-500 break-all">{user.email}</p>
              </div>
            </div>
            {!editing && (
              <button
                type="button"
                onClick={startEdit}
                className="p-1.5 rounded-lg text-slate-500 hover:text-navy hover:bg-slate-100"
                title="Edit Profile"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={saveProfile} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-navy mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-navy mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-navy mb-1">Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-navy mb-1">Home City</label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, city: e.target.value }))
                  }
                  placeholder="e.g. Kolkata"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-lg bg-accent text-white font-semibold"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-slate-200 text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Phone</span>
                <span className="font-medium text-navy">
                  {user.phone || 'Not provided'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Home City</span>
                <span className="font-medium text-navy">
                  {user.city || 'Not provided'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Bookings</span>
                <span className="font-semibold text-accent">{bookings.length}</span>
              </div>
            </div>
          )}
        </aside>

        {/* Bookings Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-navy text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Upcoming ({upcomingBookings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('past')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'past'
                    ? 'bg-navy text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Past & Cancelled ({pastBookings.length})
              </button>
            </div>

            <Link
              to="/hotels"
              className="text-xs font-semibold text-accent hover:text-accent-hover"
            >
              + Book Another Stay
            </Link>
          </div>

          {displayed.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="font-display font-semibold text-base text-navy">
                No {activeTab === 'upcoming' ? 'upcoming' : 'past'} bookings yet
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Ready for your next trip? Browse curated hotels across 6 cities.
              </p>
              <Link
                to="/hotels"
                className="inline-block mt-4 px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold"
              >
                Explore Hotels
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {displayed.map((b) => (
                <div
                  key={b.bookingId}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row gap-4"
                >
                  <SmartImage
                    src={b.hotelImage}
                    alt={b.hotelName}
                    fallbackLabel={b.hotelName}
                    className="w-full sm:w-36 h-28 rounded-lg shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-semibold text-slate-500">
                          ID: {b.bookingId}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            b.status === 'Upcoming'
                              ? 'bg-emerald-50 text-emerald-700'
                              : b.status === 'Cancelled'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <Link
                        to={`/hotels/${b.hotelId}`}
                        className="font-display font-bold text-base text-navy hover:text-accent transition-colors block mt-0.5"
                      >
                        {b.hotelName}
                      </Link>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-accent" />
                        {b.locality}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {b.checkIn} → {b.checkOut} ({b.nights}n)
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                          {b.roomName}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs text-slate-500">Total: </span>
                        <span className="font-bold text-sm text-navy">
                          ₹{b.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/booking-confirmation/${b.bookingId}`}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-navy hover:bg-slate-50"
                        >
                          View Receipt
                        </Link>

                        {b.status === 'Upcoming' &&
                          (confirmCancelId === b.bookingId ? (
                            <div className="flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-lg border border-red-200">
                              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                              <span className="text-[11px] text-red-700 font-medium">
                                Cancel?
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  cancelBooking(b.bookingId);
                                  setConfirmCancelId(null);
                                }}
                                className="px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-semibold"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmCancelId(null)}
                                className="px-1.5 py-0.5 text-[11px] text-slate-600 font-medium"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmCancelId(b.bookingId)}
                              className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                            >
                              Cancel Booking
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
