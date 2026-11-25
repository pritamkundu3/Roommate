import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Offers from './pages/Offers';
import About from './pages/About';
import Legal from './pages/Legal';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <h1 className="font-display font-bold text-3xl text-navy">404 — Page Not Found</h1>
      <p className="text-sm text-slate-500 mt-2">
        The page you requested doesn’t exist or may have moved.
      </p>
      <Link
        to="/"
        className="inline-block mt-5 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold"
      >
        Return Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/booking" element={<Booking />} />
              <Route
                path="/booking-confirmation/:bookingId"
                element={<BookingConfirmation />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/about" element={<About />} />
              <Route path="/legal/:doc" element={<Legal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BookingProvider>
    </BrowserRouter>
  );
}
