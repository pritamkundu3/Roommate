import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Legal() {
  const { doc } = useParams();
  const isPrivacy = doc === 'privacy';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h1 className="font-display font-bold text-2xl text-navy">
          {isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'}
        </h1>
        <p className="text-xs text-slate-400">Last updated: November 2026</p>

        {isPrivacy ? (
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              Room-mate respects your privacy. This prototype stores your booking
              preferences, profile details, and mock reservations locally in your browser’s
              LocalStorage. No personal data is transmitted to external payment processors
              or third-party ad networks.
            </p>
            <p>
              You can clear your stored session and bookings anytime by logging out or
              clearing site storage in your browser settings.
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              All hotel listings, room tariffs, promo codes, and payment methods shown on
              Room-mate are demonstration mock data for prototype evaluation.
            </p>
            <p>
              Standard check-in begins at 12:00 PM / 2:00 PM depending on the property, and
              check-out is at 11:00 AM / 12:00 PM. Eligible upcoming bookings can be
              cancelled directly from your User Dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
