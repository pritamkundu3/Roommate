# Room-mate — Hotel Booking Platform

> **"Your stay, your way."**

Room-mate is a modern, responsive hotel discovery and booking platform built with **React**, **Vite**, **Tailwind CSS**, **React Router**, and **Lucide React**.

## Features

- **Homepage**: Sticky navigation bar, compact hero with interactive hotel search (destination autocomplete, date validation, guest selector), Popular Destinations across 6 Indian cities (Kolkata, Delhi, Mumbai, Bangalore, Goa, Jaipur), Featured Stays, and value propositions.
- **Hotel Listings (`/hotels`)**: Search by city/locality, filter by price range, star rating, and amenities, sort by recommended/price/guest rating, grid/list view toggle, skeleton loading states, and mobile filter drawer.
- **Hotel Details (`/hotels/:id`)**: Interactive photo gallery, room category selection (`Classic`, `Deluxe King`, `Executive Suite`), policies, nearby landmarks map preview, guest reviews, and live booking summary.
- **Multi-Step Booking Flow (`/booking` & `/booking-confirmation/:bookingId`)**: Room review, validated guest details form, promo code support (`WELCOME20`, `WEEKEND25`, `STAYMORE15`), mock payment options, and printable booking confirmation with unique booking ID (`RM-XXXXXX`).
- **Authentication & User Dashboard (`/login`, `/signup`, `/dashboard`)**: Mock authentication with one-click demo login, password visibility toggle, editable user profile, upcoming & past booking tabs, and booking cancellation persisted in `localStorage`.

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
├── components/
│   ├── BookingSummary.jsx
│   ├── FilterSidebar.jsx
│   ├── Footer.jsx
│   ├── HotelCard.jsx
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   └── SmartImage.jsx
├── context/
│   └── BookingContext.jsx
├── data/
│   └── hotels.js
├── pages/
│   ├── About.jsx
│   ├── Booking.jsx
│   ├── BookingConfirmation.jsx
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   ├── HotelDetails.jsx
│   ├── Hotels.jsx
│   ├── Legal.jsx
│   ├── Login.jsx
│   ├── Offers.jsx
│   └── Signup.jsx
├── App.jsx
├── index.css
└── main.jsx
```
