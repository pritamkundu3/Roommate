import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { BrandLogo } from './Navbar';

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300 border-t border-navy-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Room-mate */}
          <div>
            <BrandLogo dark />
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Room-mate curates clean, verified, design-forward hotels across India’s top
              business and leisure cities with transparent pricing and instant booking.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#social-facebook"
                onClick={(e) => e.preventDefault()}
                aria-label="Facebook"
                className="p-2 rounded-lg bg-white/10 hover:bg-accent text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#social-twitter"
                onClick={(e) => e.preventDefault()}
                aria-label="Twitter"
                className="p-2 rounded-lg bg-white/10 hover:bg-accent text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#social-instagram"
                onClick={(e) => e.preventDefault()}
                aria-label="Instagram"
                className="p-2 rounded-lg bg-white/10 hover:bg-accent text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#social-linkedin"
                onClick={(e) => e.preventDefault()}
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-white/10 hover:bg-accent text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-accent transition-colors">
                  Browse All Hotels
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-accent transition-colors">
                  Deals & Promo Codes
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-accent transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Top Destinations
            </h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              {['Kolkata', 'Delhi', 'Mumbai', 'Bangalore', 'Goa', 'Jaipur'].map((city) => (
                <li key={city}>
                  <Link
                    to={`/hotels?city=${encodeURIComponent(city)}`}
                    className="hover:text-accent transition-colors"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Indiranagar 100ft Road, Bengaluru 560038, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a href="tel:+9118001029988" className="hover:text-white transition-colors">
                  +91 1800-102-9988 (24/7)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href="mailto:support@room-mate.in" className="hover:text-white transition-colors">
                  support@room-mate.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Room-mate Hospitality Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/legal/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/legal/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
